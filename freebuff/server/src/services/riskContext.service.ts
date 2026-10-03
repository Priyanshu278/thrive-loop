import { Checkin } from "../models/checkin.model.js";
import { Exam } from "../models/exam.model.js";
import {
  calculateRiskScore,
  type RiskResult,
} from "./riskScore.service.js";

/** Loads the user's data and computes their current deterministic risk. */
export async function computeRiskForUser(userId: string): Promise<RiskResult> {
  const checkins = await Checkin.find({ user: userId }).sort({ date: 1 }).lean();
  const nextExam = await Exam.findOne({ user: userId, date: { $gte: new Date() } })
    .sort({ date: 1 })
    .lean();

  return calculateRiskScore({
    checkins: checkins.map((c) => ({
      date: c.date,
      sleepHours: c.sleepHours,
      stress: c.stress,
      mood: c.mood,
      deadlines: c.deadlines,
    })),
    nextExamDate: nextExam?.date ?? null,
  });
}

export function daysUntilNextExam(userId: string): Promise<number | null> {
  return (async () => {
    const nextExam = await Exam.findOne({ user: userId, date: { $gte: new Date() } })
      .sort({ date: 1 })
      .lean();
    if (!nextExam) return null;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const examDay = new Date(nextExam.date);
    examDay.setHours(0, 0, 0, 0);
    return Math.round((examDay.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000));
  })();
}
