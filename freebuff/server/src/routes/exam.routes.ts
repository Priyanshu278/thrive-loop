import { Router } from "express";
import {
  createExam,
  createExamSchema,
  listExams,
  updateExam,
  updateExamSchema,
  deleteExam,
} from "../controllers/exam.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post("/", requireAuth, validate(createExamSchema), createExam);
router.get("/", requireAuth, listExams);
router.patch("/:id", requireAuth, validate(updateExamSchema), updateExam);
router.delete("/:id", requireAuth, deleteExam);

export default router;
