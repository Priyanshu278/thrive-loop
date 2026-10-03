/**
 * Deterministic risk scoring for Freebuff.
 *
 * This is a wellbeing/risk-awareness feature — NOT a medical diagnosis.
 * The same rules run server-side; nothing here interprets or diagnoses.
 *
 * Rules (each category applies at most once — the strongest matching
 * threshold wins, weaker thresholds in the same category never stack):
 *
 *  - Average sleep over the last 7 recorded days:
 *      < 6 hours            -> +30
 *      otherwise < 7 hours  -> +15
 *  - Latest 3 recorded sleep values strictly decreasing (oldest -> newest):
 *      +10
 *  - Average stress over the last 7 recorded days:
 *      >= 4                 -> +25
 *      otherwise >= 3       -> +10
 *  - Average mood over the last 7 recorded days:
 *      <= 2                 -> +20
 *  - Deadlines on the latest check-in:
 *      >= 3                 -> +10
 *  - Next upcoming exam:
 *      within 3 days        -> +15
 *      otherwise within 7   -> +8
 *
 * Levels: 0-29 low, 30-59 medium, 60+ high.
 */

export type RiskLevel = "low" | "medium" | "high";

export interface RiskCheckinInput {
  /** YYYY-MM-DD */
  date: string;
  sleepHours: number;
  stress: number;
  mood: number;
  deadlines: number;
}

export interface RiskInput {
  checkins: RiskCheckinInput[];
  /** Next upcoming exam date, if any (already filtered to today or later). */
  nextExamDate?: Date | null;
  /** Override "now" for tests. */
  now?: Date;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  reasons: string[];
  calculatedAt: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Sorts a copy of the check-ins oldest -> newest by calendar date. */
export function sortByDateAsc(checkins: RiskCheckinInput[]): RiskCheckinInput[] {
  return [...checkins].sort((a, b) => a.date.localeCompare(b.date));
}

/** Whole days between local midnight of `now` and the exam day. */
export function daysUntilExam(exam: Date, now: Date): number {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const examDay = new Date(exam.getFullYear(), exam.getMonth(), exam.getDate());
  return Math.round((examDay.getTime() - startOfToday.getTime()) / DAY_MS);
}

export function calculateRiskScore(input: RiskInput): RiskResult {
  const now = input.now ?? new Date();
  const reasons: string[] = [];
  let score = 0;

  const sorted = sortByDateAsc(input.checkins);
  const last7 = sorted.slice(-7);
  const last3 = sorted.slice(-3);
  const latest = sorted.at(-1);

  // --- Sleep ---
  if (last7.length > 0) {
    const avgSleep = average(last7.map((c) => c.sleepHours));
    if (avgSleep < 6) {
      score += 30;
      reasons.push("Average sleep over the last 7 days is below 6 hours");
    } else if (avgSleep < 7) {
      score += 15;
      reasons.push("Average sleep over the last 7 days is below 7 hours");
    }
  }

  if (last3.length === 3) {
    const [a, b, c] = last3.map((x) => x.sleepHours);
    if (b < a && c < b) {
      score += 10;
      reasons.push("Sleep has been falling over the last 3 days");
    }
  }

  // --- Stress ---
  if (last7.length > 0) {
    const avgStress = average(last7.map((c) => c.stress));
    if (avgStress >= 4) {
      score += 25;
      reasons.push("High stress over the last 7 days");
    } else if (avgStress >= 3) {
      score += 10;
      reasons.push("Elevated stress over the last 7 days");
    }
  }

  // --- Mood ---
  if (last7.length > 0) {
    const avgMood = average(last7.map((c) => c.mood));
    if (avgMood <= 2) {
      score += 20;
      reasons.push("Low mood over the last 7 days");
    }
  }

  // --- Deadlines (from the most recent check-in) ---
  if (latest && latest.deadlines >= 3) {
    score += 10;
    reasons.push("3 or more deadlines this week");
  }

  // --- Exam proximity ---
  if (input.nextExamDate) {
    const days = daysUntilExam(input.nextExamDate, now);
    if (days >= 0 && days <= 3) {
      score += 15;
      reasons.push("An exam is within 3 days");
    } else if (days > 3 && days <= 7) {
      score += 8;
      reasons.push("An exam is within 7 days");
    }
  }

  const level: RiskLevel = score >= 60 ? "high" : score >= 30 ? "medium" : "low";

  return {
    score,
    level,
    reasons,
    calculatedAt: now.toISOString(),
  };
}
