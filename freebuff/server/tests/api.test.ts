import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { Application } from "express";
import { createApp } from "../src/app.js";
import { connectDatabase, disconnectDatabase, dbState } from "../src/config/db.js";
import { Checkin } from "../src/models/checkin.model.js";

// ---------------------------------------------------------------------------
// Real MongoDB configuration only (spec requirement). If MongoDB is not
// reachable, DB-dependent tests SKIP with an explicit message — the database
// is never silently replaced by an in-memory or mocked one.
// ---------------------------------------------------------------------------
const uri = process.env.TEST_MONGO_URI ?? process.env.MONGO_URI ?? "";

let mongoAvailable = false;
if (uri) {
  try {
    await connectDatabase(uri);
    mongoAvailable = dbState() === "connected";
  } catch (err) {
    console.warn(
      `[api tests] MongoDB unavailable at "${uri}" (${err instanceof Error ? err.message : err}). ` +
        "DB-dependent tests will be SKIPPED. Start MongoDB or set MONGO_URI/TEST_MONGO_URI to run them."
    );
  }
} else {
  console.warn(
    "[api tests] MONGO_URI/TEST_MONGO_URI is not set. " +
      "DB-dependent tests will be SKIPPED. Set MONGO_URI (e.g. Atlas) to run them."
  );
}

const app: Application = createApp();

const db = mongoAvailable ? describe : describe.skip;
const unique = () => `user-${Date.now()}-${Math.round(Math.random() * 1e6)}@test.local`;

async function registerUser(name: string): Promise<{ token: string; id: string }> {
  const email = unique();
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name, email, password: "password123" });
  expect(res.status).toBe(201);
  return { token: res.body.token, id: res.body.user.id };
}

function dayString(offsetFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetFromToday);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// --- Health: does not depend on MongoDB ------------------------------------
describe("GET /api/health", () => {
  it("returns the Freebuff health payload as JSON", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toMatchObject({ status: "ok", service: "freebuff-api" });
  });
});

describe("GET /api/unknown (error format)", () => {
  it("returns JSON 404, never an empty body or HTML", async () => {
    const res = await request(app).get("/api/definitely-not-a-route");
    expect(res.status).toBe(404);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body.error).toBeTruthy();
  });
});

// --- Everything below needs the real database --------------------------------
if (mongoAvailable) {
  beforeAll(async () => {
    // Clear collections so runs are deterministic.
    await Promise.all([
      Checkin.deleteMany({}),
      (await import("../src/models/user.model.js")).User.deleteMany({}),
      (await import("../src/models/exam.model.js")).Exam.deleteMany({}),
      (await import("../src/models/careLink.model.js")).CareLink.deleteMany({}),
      (await import("../src/models/nudge.model.js")).Nudge.deleteMany({}),
    ]);
  });

  afterAll(async () => {
    await disconnectDatabase();
  });
}

db("auth", () => {
  it("registers a user and never returns the password hash", async () => {
    const email = unique();
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Ada Test", email, password: "password123" });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe(email.toLowerCase());
    expect(JSON.stringify(res.body)).not.toContain("passwordHash");
  });

  it("rejects duplicate registration with 409", async () => {
    const email = unique();
    await request(app).post("/api/auth/register").send({ name: "A", email, password: "password123" });
    const res = await request(app).post("/api/auth/register").send({ name: "B", email, password: "password123" });
    expect(res.status).toBe(409);
    expect(res.body.error).toBeTruthy();
  });

  it("returns 400 for an invalid registration payload", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "X", email: "not-an-email", password: "123" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("logs in with correct credentials", async () => {
    const email = unique();
    await request(app).post("/api/auth/register").send({ name: "Login User", email, password: "password123" });
    const res = await request(app).post("/api/auth/login").send({ email, password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toBeTruthy();
  });

  it("returns 401 JSON for a wrong password", async () => {
    const email = unique();
    await request(app).post("/api/auth/register").send({ name: "Wrong", email, password: "password123" });
    const res = await request(app).post("/api/auth/login").send({ email, password: "wrong-password" });
    expect(res.status).toBe(401);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body.error).toBe("Invalid email or password");
  });

  it("protects /api/auth/me: 401 without a token, 200 with one", async () => {
    const noToken = await request(app).get("/api/auth/me");
    expect(noToken.status).toBe(401);
    expect(noToken.body.error).toBeTruthy();

    const { token } = await registerUser("Me User");
    const ok = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    expect(ok.status).toBe(200);
    expect(ok.body.user.onboardingCompleted).toBe(false);
  });
});

db("check-ins and risk", () => {
  it("creates a check-in and returns the computed risk", async () => {
    const { token } = await registerUser("Checkin User");
    const res = await request(app)
      .post("/api/checkins")
      .set("Authorization", `Bearer ${token}`)
      .send({ sleepHours: 8, stress: 2, mood: 4, deadlines: 1 });
    expect(res.status).toBe(201);
    expect(res.body.checkin.date).toBeTruthy();
    expect(res.body.risk).toMatchObject({ score: 0, level: "low" });
    expect(typeof res.body.risk.calculatedAt).toBe("string");
  });

  it("rejects invalid check-in values with 400", async () => {
    const { token } = await registerUser("Invalid Checkin");
    const res = await request(app)
      .post("/api/checkins")
      .set("Authorization", `Bearer ${token}`)
      .send({ sleepHours: 8, stress: 9, mood: 4, deadlines: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/stress/i);
  });

  it("exposes GET /api/checkins and /api/checkins/latest", async () => {
    const { token } = await registerUser("List Checkin");
    await request(app)
      .post("/api/checkins")
      .set("Authorization", `Bearer ${token}`)
      .send({ sleepHours: 7, stress: 2, mood: 4, deadlines: 0, date: dayString(-1) });
    const list = await request(app).get("/api/checkins").set("Authorization", `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.count).toBe(1);
    const latest = await request(app).get("/api/checkins/latest").set("Authorization", `Bearer ${token}`);
    expect(latest.status).toBe(200);
    expect(latest.body.checkin.sleepHours).toBe(7);
  });

  it("computes the risk summary from check-ins", async () => {
    const { token } = await registerUser("Summary User");
    for (const off of [-2, -1, 0]) {
      await request(app)
        .post("/api/checkins")
        .set("Authorization", `Bearer ${token}`)
        .send({ sleepHours: 5, stress: 5, mood: 2, deadlines: 4, date: dayString(off) });
    }
    const res = await request(app).get("/api/checkins/summary").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    // 30 (sleep<6) + 10 (falling trend? 5,5,5 flat -> no) + 25 + 20 + 10 = 85
    expect(res.body.score).toBe(85);
    expect(res.body.level).toBe("high");
    expect(res.body.reasons.length).toBeGreaterThan(0);
    expect(res.body.calculatedAt).toBeTruthy();
  });
});

db("exam calendar and proximity", () => {
  it("creates, lists, patches and deletes an exam", async () => {
    const { token } = await registerUser("Exam User");
    const created = await request(app)
      .post("/api/exams")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Linear Algebra", date: dayString(6), type: "exam", notes: "chapters 1-4" });
    expect(created.status).toBe(201);
    const id = created.body.exam._id;

    const list = await request(app).get("/api/exams").set("Authorization", `Bearer ${token}`);
    expect(list.body.count).toBe(1);

    const patched = await request(app)
      .patch(`/api/exams/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Linear Algebra II" });
    expect(patched.status).toBe(200);
    expect(patched.body.exam.title).toBe("Linear Algebra II");

    const deleted = await request(app).delete(`/api/exams/${id}`).set("Authorization", `Bearer ${token}`);
    expect(deleted.status).toBe(200);
    const empty = await request(app).get("/api/exams").set("Authorization", `Bearer ${token}`);
    expect(empty.body.count).toBe(0);
  });

  it("uses the next UPCOMING exam for proximity scoring and ignores past exams", async () => {
    const { token } = await registerUser("Proximity User");
    for (const off of [-1, 0]) {
      await request(app)
        .post("/api/checkins")
        .set("Authorization", `Bearer ${token}`)
        .send({ sleepHours: 9, stress: 1, mood: 5, deadlines: 0, date: dayString(off) });
    }
    // Past exam must be ignored.
    await request(app)
      .post("/api/exams")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Past exam", date: dayString(-3) });

    const far = await request(app).get("/api/checkins/summary").set("Authorization", `Bearer ${token}`);
    expect(far.body.score).toBe(0);

    // Exam 5 days out -> +8.
    const exam5 = await request(app)
      .post("/api/exams")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "History", date: dayString(5) });
    const summary5 = await request(app).get("/api/checkins/summary").set("Authorization", `Bearer ${token}`);
    expect(summary5.body.score).toBe(8);

    // Move it to 2 days out -> +15.
    await request(app)
      .patch(`/api/exams/${exam5.body.exam._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ date: dayString(2) });
    const summary2 = await request(app).get("/api/checkins/summary").set("Authorization", `Bearer ${token}`);
    expect(summary2.body.score).toBe(15);

    // A second, sooner exam becomes the "next upcoming" exam.
    await request(app)
      .post("/api/exams")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Quiz", date: dayString(1) });
    // 15 still (both within 3 days).
    const summaryBoth = await request(app).get("/api/checkins/summary").set("Authorization", `Bearer ${token}`);
    expect(summaryBoth.body.score).toBe(15);
  });

  it("returns 404 when another user's exam is accessed", async () => {
    const owner = await registerUser("Exam Owner");
    const stranger = await registerUser("Exam Stranger");
    const created = await request(app)
      .post("/api/exams")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ title: "Private", date: dayString(3) });
    const res = await request(app)
      .patch(`/api/exams/${created.body.exam._id}`)
      .set("Authorization", `Bearer ${stranger.token}`)
      .send({ title: "Hijack" });
    expect(res.status).toBe(404);
  });
});

db("AI support validation", () => {
  it("requires configuration: returns 503 JSON when CLAUDE_API_KEY is missing", async () => {
    const { token } = await registerUser("AI User");
    const res = await request(app).post("/api/ai/support").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(503);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body.error).toContain("CLAUDE_API_KEY");
  });
});

db("care circle privacy", () => {
  it("shares only the risk-level word — never raw values or the score", async () => {
    const owner = await registerUser("Circle Owner");
    const friend = await registerUser("Circle Friend");

    // Owner logs in with heavy raw data.
    await request(app)
      .post("/api/checkins")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ sleepHours: 4, stress: 5, mood: 1, deadlines: 5, date: dayString(-1) });
    await request(app)
      .post("/api/checkins")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ sleepHours: 4.5, stress: 5, mood: 1, deadlines: 5, date: dayString(0) });

    // Owner invites friend, friend approves.
    const invite = await request(app)
      .post("/api/care-circle/invite")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ email: (await request(app).get("/api/auth/me").set("Authorization", `Bearer ${friend.token}`)).body.user.email });
    expect(invite.status).toBe(201);

    const approve = await request(app)
      .post("/api/care-circle")
      .set("Authorization", `Bearer ${friend.token}`)
      .send({ careLinkId: invite.body.careLink.id, action: "approve" });
    expect(approve.status).toBe(200);

    // Friend's view: risk-level WORD only.
    const friendView = await request(app).get("/api/care-circle").set("Authorization", `Bearer ${friend.token}`);
    expect(friendView.status).toBe(200);
    const approved = friendView.body.approved.find(
      (l: { friend: { id: string } }) => l.friend.id === owner.id
    );
    expect(approved).toBeTruthy();
    expect(approved.supportStatus.riskLevel).toBe("high");

    const serialized = JSON.stringify(friendView.body);
    expect(serialized).not.toContain("sleepHours");
    expect(serialized).not.toContain("stress");
    expect(serialized).not.toContain("mood");
    expect(serialized).not.toContain('"score"');
    expect(serialized).not.toContain("reasons");

    // Owner's view of the same link.
    const ownerView = await request(app).get("/api/care-circle").set("Authorization", `Bearer ${owner.token}`);
    const ownerLink = ownerView.body.approved.find((l: { friend: { id: string } }) => l.friend.id === friend.id);
    expect(ownerLink).toBeTruthy();
    expect(JSON.stringify(ownerView.body)).not.toContain("passwordHash");

    // Removal works from either side.
    const removed = await request(app)
      .delete(`/api/care-circle/${ownerLink.id}`)
      .set("Authorization", `Bearer ${friend.token}`);
    expect(removed.status).toBe(200);
  });

  it("enforces the maximum of 3 approved care links", async () => {
    const owner = await registerUser("Max Owner");
    for (let i = 0; i < 3; i++) {
      const friend = await registerUser(`Max Friend ${i}`);
      const me = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${friend.token}`);
      const invite = await request(app)
        .post("/api/care-circle/invite")
        .set("Authorization", `Bearer ${owner.token}`)
        .send({ email: me.body.user.email });
      await request(app)
        .post("/api/care-circle")
        .set("Authorization", `Bearer ${friend.token}`)
        .send({ careLinkId: invite.body.careLink.id, action: "approve" });
    }
    const fourth = await registerUser("Max Friend 3");
    const me4 = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${fourth.token}`);
    const invite4 = await request(app)
      .post("/api/care-circle/invite")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ email: me4.body.user.email });
    expect(invite4.status).toBe(400);
    expect(invite4.body.error).toMatch(/maximum/i);
  });
});

db("nudges", () => {
  it("creates one supportive nudge after high risk on 2 consecutive days, with no raw data", async () => {
    const { token } = await registerUser("Nudge User");
    const heavy = { sleepHours: 4, stress: 5, mood: 1, deadlines: 5 };

    await request(app)
      .post("/api/checkins")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...heavy, date: dayString(-1) }); // day 1: high risk stored
    const day2 = await request(app)
      .post("/api/checkins")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...heavy, date: dayString(0) }); // day 2: nudge should fire
    expect(day2.status).toBe(201);

    const list = await request(app).get("/api/nudges").set("Authorization", `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.nudges.length).toBe(1);
    expect(list.body.nudges[0].seen).toBe(false);
    const text: string = list.body.nudges[0].text.toLowerCase();
    expect(text).not.toMatch(/sleep|stress|mood|score|\d{2,}/);

    const nudgeId = list.body.nudges[0]._id;
    const read = await request(app).post(`/api/nudges/${nudgeId}/read`).set("Authorization", `Bearer ${token}`);
    expect(read.status).toBe(200);
    expect(read.body.nudge.seen).toBe(true);
  });
});
