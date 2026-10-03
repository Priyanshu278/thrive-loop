import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface INudge {
  _id: Types.ObjectId;
  to: Types.ObjectId;
  /** Supportive text only — never contains sleep, stress, mood, scores or reasons. */
  text: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface INudgeModel extends Model<INudge> {}

const nudgeSchema = new Schema<INudge, INudgeModel>(
  {
    to: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true, maxlength: 240 },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Nudge = mongoose.model<INudge, INudgeModel>("Nudge", nudgeSchema);
