import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "./httpError.js";

export interface TokenPayload {
  id: string;
}

export function signToken(payload: TokenPayload): string {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is not set. Add it to server/.env (see .env.example).");
  }
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload {
  if (!env.jwtSecret) {
    throw ApiError.unauthorized("Server is missing JWT_SECRET configuration");
  }
  try {
    return jwt.verify(token, env.jwtSecret) as TokenPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
}
