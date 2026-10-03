import type { Request, Response } from "express";
import { getAiSupport } from "../services/aiSupport.service.js";
import { computeRiskForUser, daysUntilNextExam } from "../services/riskContext.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../middleware/auth.middleware.js";

/**
 * POST /api/ai/support (protected, rate-limited)
 *
 * The client never sends risk data; the server computes it from the user's
 * own check-ins and exams, then sends only the permitted context to Claude:
 * risk level, top 2 reason labels and days until the next exam.
 * No names and no raw check-in values ever leave the server.
 */
export const aiSupport = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const risk = await computeRiskForUser(userId);

  const days = await daysUntilNextExam(userId);
  const support = await getAiSupport({
    level: risk.level,
    reasons: risk.reasons,
    daysUntilNextExam: days,
  });

  res.json(support);
});
