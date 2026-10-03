import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface ICareLink {
  _id: Types.ObjectId;
  /** The person who sent the invite (shares their support status, not raw data). */
  owner: Types.ObjectId;
  /** The person invited to provide support. */
  friend: Types.ObjectId;
  status: "pending" | "approved";
  createdAt: Date;
  updatedAt: Date;
}

interface ICareLinkModel extends Model<ICareLink> {}

const careLinkSchema = new Schema<ICareLink, ICareLinkModel>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    friend: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
  },
  { timestamps: true }
);

careLinkSchema.index({ owner: 1, friend: 1 }, { unique: true });

export const CareLink = mongoose.model<ICareLink, ICareLinkModel>("CareLink", careLinkSchema);

/** A user may have at most this many approved care-circle links (as owner). */
export const MAX_CARE_LINKS = 3;
