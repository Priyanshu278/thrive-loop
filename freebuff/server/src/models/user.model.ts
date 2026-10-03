import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  onboardingCompleted: boolean;
  /** Deterministic risk level computed by the server — safe to share as a word. */
  riskLevel: "low" | "medium" | "high";
  riskUpdatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email is not valid"],
    },
    // select:false so it never leaves the database unless explicitly requested.
    passwordHash: { type: String, required: true, select: false },
    onboardingCompleted: { type: Boolean, default: false },
    riskLevel: { type: String, enum: ["low", "medium", "high"], default: "low" },
    riskUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);

/** Public shape of a user — never includes passwordHash. */
export function publicUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    onboardingCompleted: user.onboardingCompleted,
    riskLevel: user.riskLevel,
    riskUpdatedAt: user.riskUpdatedAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
