import rateLimit from "express-rate-limit";

/** Auth endpoints: 20 attempts per 15 minutes per IP. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests - please slow down and try again later" },
});

/** AI endpoints: 10 requests per 15 minutes per IP (protects the Claude budget). */
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many AI requests - please try again in a few minutes" },
});
