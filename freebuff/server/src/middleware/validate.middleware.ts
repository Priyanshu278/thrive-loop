import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { ApiError } from "../utils/httpError.js";

/**
 * Validates req.body against a zod schema. On failure the client gets
 * 400 { error: "<first validation message>" }.
 */
export function validate(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const first = result.error.issues[0];
      next(ApiError.badRequest(first?.message ?? "Invalid request body"));
      return;
    }
    req.body = result.data;
    next();
  };
}
