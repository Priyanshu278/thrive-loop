import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

/** Requires a valid "Authorization: Bearer <token>" header. */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    next(new Error("unauthorized:no-token"));
    return;
  }
  try {
    const payload = verifyToken(token);
    (req as AuthenticatedRequest).userId = payload.id;
    next();
  } catch (err) {
    next(err);
  }
}

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

/** Type-safe accessor for the authenticated user id. */
export function getUserId(req: Request): string {
  const id = (req as AuthenticatedRequest).userId;
  if (!id) throw new Error("requireAuth middleware is missing on this route");
  return id;
}
