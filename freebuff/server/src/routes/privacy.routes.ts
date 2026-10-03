import { Router } from "express";
import { getPrivacy } from "../controllers/privacy.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getPrivacy);

export default router;
