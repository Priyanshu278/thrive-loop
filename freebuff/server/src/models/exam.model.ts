import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface IExam {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  date: Date;
  type: "exam" | "quiz" | "assignment" | "other";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IExamModel extends Model<IExam> {}

const examSchema = new Schema<IExam, IExamModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    date: { type: Date, required: true },
    type: { type: String, enum: ["exam", "quiz", "assignment", "other"], default: "exam" },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export const Exam = mongoose.model<IExam, IExamModel>("Exam", examSchema);
