import type { Request, Response } from "express";
import { User, publicUser } from "../models/user.model.js";
import { ApiError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../middleware/auth.middleware.js";

/**
 * GET /api/privacy (protected)
 * Transparency endpoint: what the app stores, what it shares, and the
 * account's own data. Never includes passwordHash, JWT secrets or API keys.
 */
export const getPrivacy = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(getUserId(req));
  if (!user) throw ApiError.notFound("User not found");

  res.json({
    account: publicUser(user),
    stored: [
      "Your name and email",
      "A one-way hashed password (never the password itself)",
      "Your daily check-ins: sleep hours, stress 1-5, mood 1-5, deadlines",
      "Your exam calendar entries",
      "Your computed risk level (low/medium/high) and when it was updated",
      "Your care-circle links and supportive nudges",
    ],
    shared: [
      "Your care-circle friends only see your risk LEVEL (a single word) after they approve your invite",
      "Your friends never see raw sleep, stress, mood values or your numeric score",
      "Nothing is shared with anyone else",
    ],
    neverShared: ["Raw check-in values", "Numeric risk score", "Reasons", "Exam details"],
  });
});
