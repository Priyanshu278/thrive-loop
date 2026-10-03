import type { Request, Response } from "express";
import { z } from "zod";
import { Exam } from "../models/exam.model.js";
import { ApiError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../middleware/auth.middleware.js";

const isoDate = z
  .string()
  .min(1, "Exam date is required")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Exam date must be a valid date");

export const createExamSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  date: isoDate,
  type: z.enum(["exam", "quiz", "assignment", "other"]).default("exam"),
  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const updateExamSchema = createExamSchema.partial();

/** POST /api/exams (protected) */
export const createExam = asyncHandler(async (req: Request, res: Response) => {
  const data = createExamSchema.parse(req.body);
  const exam = await Exam.create({ ...data, date: new Date(data.date), user: getUserId(req) });
  res.status(201).json({ exam });
});

/** GET /api/exams (protected) — soonest first. */
export const listExams = asyncHandler(async (req: Request, res: Response) => {
  const exams = await Exam.find({ user: getUserId(req) }).sort({ date: 1 }).limit(100);
  res.json({ exams, count: exams.length });
});

/** PATCH /api/exams/:id (protected, own exams only) */
export const updateExam = asyncHandler(async (req: Request, res: Response) => {
  const data = updateExamSchema.parse(req.body);
  const patch = data.date ? { ...data, date: new Date(data.date) } : data;

  const exam = await Exam.findOneAndUpdate({ _id: req.params.id, user: getUserId(req) }, patch, {
    new: true,
    runValidators: true,
  });
  if (!exam) throw ApiError.notFound("Exam not found");
  res.json({ exam });
});

/** DELETE /api/exams/:id (protected, own exams only) */
export const deleteExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await Exam.findOneAndDelete({ _id: req.params.id, user: getUserId(req) });
  if (!exam) throw ApiError.notFound("Exam not found");
  res.json({ ok: true });
});
