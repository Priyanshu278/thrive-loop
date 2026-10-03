// Boots the real Freebuff server as a child process, verifies the API
// contract, prints the MongoDB status, and exits 0/1. No mocks anywhere.
import { spawn } from "node:child_process";

const PORT = process.env.VERIFY_PORT ?? "4100";
const BASE = `http://localhost:${PORT}`;
const results: Array<{ name: string; ok: boolean; detail: string }> = [];

function check(name: string, ok: boolean, detail = ""): void {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  -> " + detail : ""}`);
}

async function waitForServer(): Promise<void> {
  for (let i = 0; i < 90; i++) {
    try {
      const r = await fetch(`${BASE}/api/health`);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server did not start in time");
}

interface Res {
  status: number;
  contentType: string;
  body: string;
  json: any;
  isJson: boolean;
}

async function call(method: string, path: string, body?: unknown, token?: string): Promise<Res> {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json: any = null;
  let isJson = false;
  try {
    json = JSON.parse(text);
    isJson = true;
  } catch {
    isJson = false;
  }
  return { status: res.status, contentType: res.headers.get("content-type") ?? "", body: text, json, isJson };
}

async function main(): Promise<void> {
  const server = spawn(process.execPath, ["--import", "tsx/esm", "src/server.ts"], {
    cwd: new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"),
    env: { ...process.env, PORT },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (d) => process.stdout.write(`[server] ${d}`));
  server.stderr.on("data", (d) => process.stdout.write(`[server:err] ${d}`));

  try {
    await waitForServer();

    const health = await call("GET", "/api/health");
    check(
      "GET /api/health -> 200 {status:'ok', service:'freebuff-api'}",
      health.status === 200 && health.isJson && health.json.status === "ok" && health.json.service === "freebuff-api",
      JSON.stringify(health.json)
    );
    const dbConnected = health.json?.db === "connected";
    console.log(`\nDatabase state: ${health.json?.db ?? "unknown"}${dbConnected ? "" : "  (set MONGO_URI in server/.env and restart)"}`);

    const notFound = await call("GET", "/api/definitely-not-a-route");
    check(
      "unknown /api route -> JSON 404 with error (never empty)",
      notFound.status === 404 && notFound.isJson && typeof notFound.json.error === "string",
      `${notFound.status} ${notFound.body.slice(0, 80)}`
    );

    const protectedNoToken = await call("GET", "/api/checkins/summary");
    check(
      "protected route without token -> 401 JSON (when DB up) or 503 JSON (when DB down)",
      (dbConnected && protectedNoToken.status === 401 && protectedNoToken.isJson) ||
        (!dbConnected && protectedNoToken.status === 503 && protectedNoToken.isJson),
      `${protectedNoToken.status} ${protectedNoToken.body.slice(0, 80)}`
    );

    const badRegister = await call("POST", "/api/auth/register", { name: "", email: "bad", password: "1" });
    check(
      "invalid register payload -> JSON error (400 when DB up, 503 JSON when DB down)",
      badRegister.isJson && (dbConnected ? badRegister.status === 400 : badRegister.status === 503),
      `${badRegister.status} ${badRegister.body.slice(0, 80)}`
    );

    if (dbConnected) {
      const email = `verify-${Date.now()}@test.local`;
      const reg = await call("POST", "/api/auth/register", { name: "Verify User", email, password: "password123" });
      check("register -> 201 JSON {token, user} without passwordHash", reg.status === 201 && reg.isJson && !!reg.json.token && !reg.body.includes("passwordHash"), `${reg.status}`);

      const login = await call("POST", "/api/auth/login", { email, password: "password123" });
      check("login -> 200 JSON {token, user}", login.status === 200 && login.isJson && !!login.json.token, `${login.status}`);

      const wrong = await call("POST", "/api/auth/login", { email, password: "wrong" });
      check("wrong password -> 401 JSON {error:'Invalid email or password'}", wrong.status === 401 && wrong.json?.error === "Invalid email or password", `${wrong.status} ${wrong.body.slice(0, 60)}`);

      const me = await call("GET", "/api/auth/me", undefined, reg.json.token);
      check("GET /api/auth/me with token -> 200 JSON", me.status === 200 && me.isJson && !!me.json.user?.id, `${me.status}`);

      const checkin = await call("POST", "/api/checkins", { sleepHours: 8, stress: 2, mood: 4, deadlines: 1 }, reg.json.token);
      check("POST /api/checkins -> 201 JSON {checkin, risk}", checkin.status === 201 && checkin.isJson && checkin.json.risk?.level === "low", `${checkin.status} ${JSON.stringify(checkin.json.risk ?? {}).slice(0, 80)}`);

      const ai = await call("POST", "/api/ai/support", undefined, reg.json.token);
      check("POST /api/ai/support without CLAUDE_API_KEY -> 503 JSON (clearly reported, no fake answer)", ai.status === 503 && ai.json?.error?.includes("CLAUDE_API_KEY"), `${ai.status} ${ai.body.slice(0, 70)}`);
    }

    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - failed}/${results.length} checks passed`);
    process.exitCode = failed ? 1 : 0;
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error("verify crashed:", err);
  process.exit(1);
});
