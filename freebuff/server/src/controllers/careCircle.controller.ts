import type { Request, Response } from "express";
import { z } from "zod";
import { CareLink, MAX_CARE_LINKS } from "../models/careLink.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getUserId } from "../middleware/auth.middleware.js";

export const inviteSchema = z.object({
  email: z.string().trim().email("A valid email is required"),
});

export const respondSchema = z.object({
  careLinkId: z.string().min(1, "careLinkId is required"),
  action: z.enum(["approve", "decline"], { message: "action must be approve or decline" }),
});

/**
 * PRIVACY RULE (enforced here): Care Circle responses contain relationship
 * and support-status information only. Raw sleep, stress, mood values and
 * the numeric risk score are NEVER included. The only permitted status is
 * the coarse risk-level word of the *owner*, visible to approved friends.
 */

/** POST /api/care-circle/invite (protected) */
export const inviteToCareCircle = asyncHandler(async (req: Request, res: Response) => {
  const { email } = inviteSchema.parse(req.body);
  const userId = getUserId(req);

  const friend = await User.findOne({ email: email.toLowerCase() }).lean();
  if (!friend) throw ApiError.notFound("No user found with that email");
  if (friend._id.toString() === userId) {
    throw ApiError.badRequest("You cannot invite yourself");
  }

  const existing = await CareLink.findOne({
    $or: [
      { owner: userId, friend: friend._id },
      { owner: friend._id, friend: userId },
    ],
  }).lean();
  if (existing) throw ApiError.conflict("A care link between you two already exists");

  const approvedCount = await CareLink.countDocuments({ owner: userId, status: "approved" });
  if (approvedCount >= MAX_CARE_LINKS) {
    throw ApiError.badRequest(`Your care circle is full (maximum ${MAX_CARE_LINKS} friends)`);
  }

  const link = await CareLink.create({ owner: userId, friend: friend._id, status: "pending" });

  res.status(201).json({
    careLink: { id: link._id.toString(), status: link.status },
    friend: { id: friend._id.toString(), name: friend.name },
  });
});

/** GET /api/care-circle (protected) */
export const listCareCircle = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const links = await CareLink.find({ $or: [{ owner: userId }, { friend: userId }] })
    .populate<{ owner: { _id: unknown; name: string; riskLevel: "low" | "medium" | "high"; riskUpdatedAt?: Date } }>("owner", "name riskLevel riskUpdatedAt")
    .populate<{ friend: { _id: unknown; name: string; riskLevel: "low" | "medium" | "high"; riskUpdatedAt?: Date } }>("friend", "name riskLevel riskUpdatedAt")
    .sort({ createdAt: -1 })
    .lean();

  const approved: unknown[] = [];
  const incomingInvites: unknown[] = [];
  const outgoingInvites: unknown[] = [];

  for (const link of links) {
    const ownerId = String((link.owner as unknown as { _id: unknown })._id ?? link.owner);
    const friendId = String((link.friend as unknown as { _id: unknown })._id ?? link.friend);
    const isOwner = ownerId === userId;

    if (link.status === "approved") {
      // Approved friends of the owner may see the owner's risk-level WORD only.
      const supportStatus =
        isOwner
          ? undefined
          : {
              riskLevel: link.owner.riskLevel,
              updatedAt: link.owner.riskUpdatedAt ?? null,
            };
      approved.push({
        id: link._id.toString(),
        friend: { id: friendId, name: (link.friend as unknown as { name: string }).name },
        owner: { id: ownerId, name: (link.owner as unknown as { name: string }).name },
        supportStatus: supportStatus ?? null,
      });
    } else if (isOwner) {
      outgoingInvites.push({
        id: link._id.toString(),
        to: { id: friendId, name: (link.friend as unknown as { name: string }).name },
      });
    } else {
      incomingInvites.push({
        id: link._id.toString(),
        from: { id: ownerId, name: (link.owner as unknown as { name: string }).name },
      });
    }
  }

  res.json({ approved, incomingInvites, outgoingInvites });
});

/** POST /api/care-circle (protected) — the invited friend approves or declines. */
export const respondToCareInvite = asyncHandler(async (req: Request, res: Response) => {
  const { careLinkId, action } = respondSchema.parse(req.body);
  const userId = getUserId(req);

  const link = await CareLink.findById(careLinkId);
  if (!link) throw ApiError.notFound("Care link not found");
  if (link.friend.toString() !== userId) {
    throw ApiError.forbidden("Only the invited friend can respond to this invite");
  }

  if (action === "decline") {
    await link.deleteOne();
    res.json({ ok: true, status: "declined" });
    return;
  }

  const approvedCount = await CareLink.countDocuments({ owner: link.owner, status: "approved" });
  if (approvedCount >= MAX_CARE_LINKS) {
    throw ApiError.badRequest(`Their care circle is full (maximum ${MAX_CARE_LINKS} friends)`);
  }

  link.status = "approved";
  await link.save();

  res.json({
    careLink: { id: link._id.toString(), status: link.status },
    // Support status the approver will now see — risk-level word only.
    supportStatus: null,
  });
});

/** DELETE /api/care-circle/:id (protected) — either side may remove the link. */
export const removeCareLink = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const link = await CareLink.findById(req.params.id);
  if (!link) throw ApiError.notFound("Care link not found");

  const isParticipant = link.owner.toString() === userId || link.friend.toString() === userId;
  if (!isParticipant) throw ApiError.forbidden("You are not part of this care link");

  await link.deleteOne();
  res.json({ ok: true });
});
