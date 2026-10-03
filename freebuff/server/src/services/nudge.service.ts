import { Nudge } from "../models/nudge.model.js";

/**
 * Spec rule: high risk for 2 consecutive days creates ONE soft supportive nudge.
 * The text contains no sleep, stress, mood, score or reason data.
 */
export async function maybeCreateHighRiskNudge(
  userId: string,
  previous: { riskLevel: "low" | "medium" | "high"; riskUpdatedAt?: Date | null },
  now: Date
): Promise<boolean> {
  if (previous.riskLevel !== "high") return false;
  if (!previous.riskUpdatedAt) return false;

  // The previous "high" must be from an earlier calendar day than now.
  const prevDay = new Date(previous.riskUpdatedAt);
  const isEarlierDay =
    prevDay.getFullYear() !== now.getFullYear() ||
    prevDay.getMonth() !== now.getMonth() ||
    prevDay.getDate() !== now.getDate();
  if (!isEarlierDay) return false;

  // Avoid duplicate nudges for the same episode: skip if one was sent recently.
  const recentCutoff = new Date(now.getTime() - 20 * 60 * 60 * 1000);
  const recent = await Nudge.findOne({ to: userId, createdAt: { $gte: recentCutoff } }).lean();
  if (recent) return false;

  await Nudge.create({
    to: userId,
    text: "You have had a few heavy days lately. Small steps count, and it is okay to take a break.",
  });
  return true;
}
