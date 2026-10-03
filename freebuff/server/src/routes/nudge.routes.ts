import { Router } from "express";
import { listNudges, markNudgeRead } from "../controllers/nudge.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, listNudges);
router.post("/:id/read", requireAuth, markNudgeRead);

export default router;
