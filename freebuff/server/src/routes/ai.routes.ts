import { Router } from "express";
import { aiSupport } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { aiLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

// Rate-limited to protect the Claude API budget.
router.post("/support", requireAuth, aiLimiter, aiSupport);

export default router;
