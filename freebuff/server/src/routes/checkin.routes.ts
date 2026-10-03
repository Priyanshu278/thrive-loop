import { Router } from "express";
import {
  createCheckin,
  createCheckinSchema,
  listCheckins,
  latestCheckin,
  checkinSummary,
} from "../controllers/checkin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post("/", requireAuth, validate(createCheckinSchema), createCheckin);
router.get("/", requireAuth, listCheckins);
router.get("/latest", requireAuth, latestCheckin);
router.get("/summary", requireAuth, checkinSummary);

export default router;
