import { Router } from "express";
import { updateMe, updateMeSchema } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.patch("/me", requireAuth, validate(updateMeSchema), updateMe);

export default router;
