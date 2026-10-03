import { describe, expect, it } from "vitest";
import {
  calculateRiskScore,
  daysUntilExam,
  type RiskCheckinInput,
} from "../src/services/riskScore.service.js";

const BASE = new Date(2026, 9, 10, 12, 0, 0); // 2026-10-10 local noon

function day(offset: number): string {
  const d = new Date(BASE);
  d.setDate(d.getDate() + offset);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dayOfMonth}`;
}

function checkin(offset: number, values: Partial<RCheckin> = {}): RCheckin {
  return {
    date: day(offset),
    sleepHours: 8,
    stress: 1,
    mood: 4,
    deadlines: 0,
    ...values,
  };
}
type RCheckin = RiskCheckinInput;

function examIn(days: number): Date {
  return new Date(BASE.getFullYear(), BASE.getMonth(), BASE.getDate() + days, 9, 0, 0);
}

describe("calculateRiskScore — sleep rules", () => {
  it("scores 0 for no data", () => {
    const r = calculateRiskScore({ checkins: [], nextExamDate: null, now: BASE });
    expect(r.score).toBe(0);
    expect(r.level).toBe("low");
    expect(r.reasons).toEqual([]);
  });

  it("adds 30 (not 15) when average sleep is below 6 — strongest threshold only", () => {
    const r = calculateRiskScore({
      checkins: [checkin(-1, { sleepHours: 5 }), checkin(0, { sleepHours: 5 })],
      now: BASE,
    });
    expect(r.score).toBe(30);
    expect(r.reasons).toContain("Average sleep over the last 7 days is below 6 hours");
  });

  it("adds 15 when average sleep is 6-7 hours", () => {
    const r = calculateRiskScore({
      checkins: [checkin(-1, { sleepHours: 6 }), checkin(0, { sleepHours: 7 })],
      now: BASE,
    });
    expect(r.score).toBe(15);
    expect(r.reasons).toContain("Average sleep over the last 7 days is below 7 hours");
  });

  it("adds nothing when average sleep is 7+ hours", () => {
    const r = calculateRiskScore({
      checkins: [checkin(-1, { sleepHours: 7 }), checkin(0, { sleepHours: 8 })],
      now: BASE,
    });
    expect(r.score).toBe(0);
  });

  it("uses only the last 7 recorded check-ins for sleep", () => {
    const old = [0, 1, 2].map((i) => checkin(-20 + i, { sleepHours: 2 }));
    const recent = [-1, 0, 1, 2, 3, 4, 5].map((i) => checkin(i - 6, { sleepHours: 9 }));
    const r = calculateRiskScore({ checkins: [...old, ...recent], now: BASE });
    // The 3 old low-sleep entries fall outside the last-7-records window.
    expect(r.score).toBe(0);
  });

  it("adds 10 when the latest 3 sleep values are strictly decreasing", () => {
    const r = calculateRiskScore({
      checkins: [
        checkin(-2, { sleepHours: 7 }),
        checkin(-1, { sleepHours: 6.5 }),
        checkin(0, { sleepHours: 6 }),
      ],
      now: BASE,
    });
    expect(r.score).toBe(15 + 10); // avg 6.5h -> +15, trend -> +10
    expect(r.reasons).toContain("Sleep has been falling over the last 3 days");
  });

  it("does not add trend points for equal or increasing sleep", () => {
    const flat = calculateRiskScore({
      checkins: [checkin(-2, { sleepHours: 7 }), checkin(-1, { sleepHours: 7 }), checkin(0, { sleepHours: 7 })],
      now: BASE,
    });
    const rising = calculateRiskScore({
      checkins: [checkin(-2, { sleepHours: 6 }), checkin(-1, { sleepHours: 6.5 }), checkin(0, { sleepHours: 7 })],
      now: BASE,
    });
    expect(flat.reasons).not.toContain("Sleep has been falling over the last 3 days");
    expect(rising.reasons).not.toContain("Sleep has been falling over the last 3 days");
  });

  it("ignores the trend rule with fewer than 3 check-ins", () => {
    const r = calculateRiskScore({
      checkins: [checkin(-1, { sleepHours: 7 }), checkin(0, { sleepHours: 4 })],
      now: BASE,
    });
    expect(r.score).toBe(30); // avg 5.5h -> +30
    expect(r.reasons).not.toContain("Sleep has been falling over the last 3 days");
  });
});

describe("calculateRiskScore — stress, mood, deadlines", () => {
  it("adds 25 (not 10) when average stress is 4+", () => {
    const r = calculateRiskScore({
      checkins: [checkin(-1, { stress: 4 }), checkin(0, { stress: 5 })],
      now: BASE,
    });
    expect(r.score).toBe(25);
    expect(r.reasons).toContain("High stress over the last 7 days");
  });

  it("adds 10 when average stress is 3-4", () => {
    const r = calculateRiskScore({
      checkins: [checkin(-1, { stress: 3 }), checkin(0, { stress: 4 })],
      now: BASE,
    });
    expect(r.score).toBe(10);
    expect(r.reasons).toContain("Elevated stress over the last 7 days");
  });

  it("adds 20 when average mood is 2 or below", () => {
    const r = calculateRiskScore({
      checkins: [checkin(-1, { mood: 2 }), checkin(0, { mood: 1 })],
      now: BASE,
    });
    expect(r.score).toBe(20);
    expect(r.reasons).toContain("Low mood over the last 7 days");
  });

  it("adds 10 for 3+ deadlines on the LATEST check-in only", () => {
    const r = calculateRiskScore({
      checkins: [checkin(-1, { deadlines: 5 }), checkin(0, { deadlines: 2 })],
      now: BASE,
    });
    expect(r.score).toBe(0);
    const r2 = calculateRiskScore({
      checkins: [checkin(-1, { deadlines: 2 }), checkin(0, { deadlines: 3 })],
      now: BASE,
    });
    expect(r2.score).toBe(10);
  });
});

describe("calculateRiskScore — exam proximity", () => {
  it("adds 15 for an exam within 3 days (not 8)", () => {
    const r = calculateRiskScore({ checkins: [], nextExamDate: examIn(2), now: BASE });
    expect(r.score).toBe(15);
    expect(r.reasons).toContain("An exam is within 3 days");
  });

  it("adds 8 for an exam 4-7 days away", () => {
    const r = calculateRiskScore({ checkins: [], nextExamDate: examIn(5), now: BASE });
    expect(r.score).toBe(8);
    expect(r.reasons).toContain("An exam is within 7 days");
  });

  it("adds nothing for an exam more than 7 days away or in the past", () => {
    expect(calculateRiskScore({ checkins: [], nextExamDate: examIn(8), now: BASE }).score).toBe(0);
    expect(calculateRiskScore({ checkins: [], nextExamDate: examIn(-3), now: BASE }).score).toBe(0);
  });
});

describe("calculateRiskScore — levels and shape", () => {
  it("classifies 30 as medium and 60 as high", () => {
    const medium = calculateRiskScore({
      checkins: [checkin(0, { sleepHours: 5 })],
      now: BASE,
    }); // 30
    expect(medium.score).toBe(30);
    expect(medium.level).toBe("medium");

    const high = calculateRiskScore({
      checkins: [checkin(-1, { sleepHours: 5, stress: 4, mood: 2 }), checkin(0, { sleepHours: 5, stress: 4, mood: 2, deadlines: 3 })],
      now: BASE,
    }); // 30 + 25 + 20 + 10 + 10(trend 5,5,5? no) = 85
    expect(high.score).toBeGreaterThanOrEqual(60);
    expect(high.level).toBe("high");
  });

  it("keeps 0-29 low", () => {
    const r = calculateRiskScore({
      checkins: [checkin(0, { stress: 4, mood: 3 })],
      now: BASE,
    }); // 25
    expect(r.level).toBe("low");
  });

  it("returns calculatedAt as an ISO string", () => {
    const r = calculateRiskScore({ checkins: [], now: BASE });
    expect(r.calculatedAt).toBe(BASE.toISOString());
  });
});

describe("daysUntilExam", () => {
  it("returns 0 for today and 3 for three days out", () => {
    expect(daysUntilExam(examIn(0), BASE)).toBe(0);
    expect(daysUntilExam(examIn(3), BASE)).toBe(3);
  });
});
