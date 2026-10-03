import type { Request, Response } from "express";
import { z } from "zod";
import { User, publicUser } from "../models/user.model.js";
import { ApiError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../middleware/auth.middleware.js";

export const updateMeSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").max(80).optional(),
  onboardingCompleted: z.boolean().optional(),
});

/** PATCH /api/users/me (protected) */
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const data = updateMeSchema.parse(req.body);

  const user = await User.findByIdAndUpdate(getUserId(req), data, {
    new: true,
    runValidators: true,
  });
  if (!user) throw ApiError.notFound("User not found");

  res.json({ user: publicUser(user) });
});
