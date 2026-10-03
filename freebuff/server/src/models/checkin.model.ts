import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface ICheckin {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  /** Calendar day in YYYY-MM-DD (server timezone). */
  date: string;
  sleepHours: number;
  stress: number;
  mood: number;
  deadlines: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ICheckinModel extends Model<ICheckin> {}

const checkinSchema = new Schema<ICheckin, ICheckinModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
    sleepHours: { type: Number, required: true, min: 0, max: 24 },
    stress: { type: Number, required: true, min: 1, max: 5 },
    mood: { type: Number, required: true, min: 1, max: 5 },
    deadlines: { type: Number, required: true, min: 0, max: 20 },
  },
  { timestamps: true }
);

// One check-in per user per day.
checkinSchema.index({ user: 1, date: 1 }, { unique: true });

export const Checkin = mongoose.model<ICheckin, ICheckinModel>("Checkin", checkinSchema);
