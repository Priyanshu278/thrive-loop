import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { z } from "zod";
import { User, publicUser } from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";
import { ApiError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../middleware/auth.middleware.js";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("A valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

/** POST /api/auth/register */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json({
    token: signToken({ id: user._id.toString() }),
    user: publicUser(user),
  });
});

/** POST /api/auth/login */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  res.json({
    token: signToken({ id: user._id.toString() }),
    user: publicUser(user),
  });
});

/** GET /api/auth/me (protected) */
export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(getUserId(req));
  if (!user) throw ApiError.notFound("User not found");
  res.json({ user: publicUser(user) });
});
