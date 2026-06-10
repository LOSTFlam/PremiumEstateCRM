const MODERATION_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const LEGACY_APPROVED = ["approved", "verified"];
const LEGACY_PENDING = ["pending", "review"];

const normalizeModerationStatus = (status) => {
  const value = String(status || "").trim().toLowerCase();
  if (LEGACY_APPROVED.includes(value)) return MODERATION_STATUS.APPROVED;
  if (LEGACY_PENDING.includes(value)) return MODERATION_STATUS.PENDING;
  if (value === MODERATION_STATUS.DRAFT) return MODERATION_STATUS.DRAFT;
  if (value === MODERATION_STATUS.REJECTED) return MODERATION_STATUS.REJECTED;
  return MODERATION_STATUS.DRAFT;
};

const isPubliclyVisible = (property) => {
  if (!property || property.deleted) return false;
  if (property.listingStatus === "Blocked") return false;
  const status = normalizeModerationStatus(property.verificationStatus);
  return status === MODERATION_STATUS.APPROVED;
};

const stripModerationFields = (body = {}) => {
  const next = { ...body };
  [
    "verificationStatus",
    "rejectionReason",
    "verificationNotes",
    "verificationScore",
    "verificationChecklist",
    "moderationSubmittedAt",
    "moderationReviewedAt",
    "moderationReviewedBy",
    "verificationUpdatedAt",
    "verificationUpdatedBy",
  ].forEach((field) => delete next[field]);
  return next;
};

module.exports = {
  MODERATION_STATUS,
  LEGACY_APPROVED,
  normalizeModerationStatus,
  isPubliclyVisible,
  stripModerationFields,
};
