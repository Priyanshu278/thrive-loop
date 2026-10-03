import type { Request, Response } from "express";
import { z } from "zod";
import { Checkin } from "../models/checkin.model.js";
import { User } from "../models/user.model.js";
import { computeRiskForUser } from "../services/riskContext.service.js";
import { maybeCreateHighRiskNudge } from "../services/nudge.service.js";
import { ApiError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../middleware/auth.middleware.js";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const createCheckinSchema = z.object({
  sleepHours: z.number().min(0, "Sleep hours cannot be negative").max(24, "Sleep hours cannot exceed 24"),
  stress: z.number().int("Stress must be a whole number").min(1, "Stress must be 1-5").max(5, "Stress must be 1-5"),
  mood: z.number().int("Mood must be a whole number").min(1, "Mood must be 1-5").max(5, "Mood must be 1-5"),
  deadlines: z.number().int("Deadlines must be a whole number").min(0, "Deadlines cannot be negative").max(20, "Deadlines cannot exceed 20"),
  date: dateSchema.optional(),
});

function todayString(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** POST /api/checkins (protected) — upsert, one per user per day. */
export const createCheckin = asyncHandler(async (req: Request, res: Response) => {
  const data = createCheckinSchema.parse(req.body);
  const date = data.date ?? todayString();
  const userId = getUserId(req);

  // Previous stored risk, for the "high 2 days in a row" nudge rule.
  const userBefore = await User.findById(userId).lean();
  if (!userBefore) throw ApiError.notFound("User not found");

  const checkin = await Checkin.findOneAndUpdate(
    { user: userId, date },
    { $set: { sleepHours: data.sleepHours, stress: data.stress, mood: data.mood, deadlines: data.deadlines } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const risk = await computeRiskForUser(userId);

  await User.findByIdAndUpdate(userId, {
    riskLevel: risk.level,
    riskUpdatedAt: new Date(),
  });

  await maybeCreateHighRiskNudge(
    userId,
    { riskLevel: userBefore.riskLevel, riskUpdatedAt: userBefore.riskUpdatedAt ?? null },
    new Date()
  );

  res.status(201).json({ checkin, risk });
});

/** GET /api/checkins (protected) */
export const listCheckins = asyncHandler(async (req: Request, res: Response) => {
  const checkins = await Checkin.find({ user: getUserId(req) })
    .sort({ date: -1 })
    .limit(30)
    .lean();
  res.json({ checkins, count: checkins.length });
});

/** GET /api/checkins/latest (protected) */
export const latestCheckin = asyncHandler(async (req: Request, res: Response) => {
  const checkin = await Checkin.findOne({ user: getUserId(req) }).sort({ date: -1 });
  if (!checkin) throw ApiError.notFound("No check-ins yet");
  res.json({ checkin });
});

/** GET /api/checkins/summary (protected) — deterministic risk result. */
export const checkinSummary = asyncHandler(async (req: Request, res: Response) => {
  const risk = await computeRiskForUser(getUserId(req));
  res.json(risk);
});
