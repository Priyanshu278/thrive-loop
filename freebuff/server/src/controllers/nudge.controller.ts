import type { Request, Response } from "express";
import { Nudge } from "../models/nudge.model.js";
import { ApiError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../middleware/auth.middleware.js";

/** GET /api/nudges (protected) — only the recipient's own nudges. */
export const listNudges = asyncHandler(async (req: Request, res: Response) => {
  const nudges = await Nudge.find({ to: getUserId(req) })
    .sort({ createdAt: -1 })
    .limit(50)
    .select("text seen createdAt");
  res.json({ nudges, unseenCount: nudges.filter((n) => !n.seen).length });
});

/** POST /api/nudges/:id/read (protected) */
export const markNudgeRead = asyncHandler(async (req: Request, res: Response) => {
  const nudge = await Nudge.findOneAndUpdate(
    { _id: req.params.id, to: getUserId(req) },
    { seen: true },
    { new: true }
  ).select("text seen createdAt");
  if (!nudge) throw ApiError.notFound("Nudge not found");
  res.json({ nudge });
});
