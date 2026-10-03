import type { ErrorRequestHandler, Request, RequestHandler, Response } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/httpError.js";

/** Every unmatched /api route returns JSON, never an empty body or HTML. */
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

/** Central error handler: every API error becomes { error: string }. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const first = Object.values(err.errors)[0];
    res.status(400).json({ error: first?.message ?? "Invalid data" });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: "Invalid id format" });
    return;
  }

  // JWT middleware sends sentinel errors for missing tokens.
  if (err instanceof Error && err.message === "unauthorized:no-token") {
    res.status(401).json({ error: "Missing Authorization header" });
    return;
  }

  console.error("[freebuff-api] unhandled error:", err);
  res.status(500).json({ error: "Something went wrong" });
};

export type { Request, Response };
