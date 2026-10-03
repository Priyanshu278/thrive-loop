import { Router } from "express";
import {
  inviteToCareCircle,
  listCareCircle,
  respondToCareInvite,
  removeCareLink,
  inviteSchema,
  respondSchema,
} from "../controllers/careCircle.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post("/", requireAuth, validate(respondSchema), respondToCareInvite);
router.get("/", requireAuth, listCareCircle);
router.post("/invite", requireAuth, validate(inviteSchema), inviteToCareCircle);
router.delete("/:id", requireAuth, removeCareLink);

export default router;
