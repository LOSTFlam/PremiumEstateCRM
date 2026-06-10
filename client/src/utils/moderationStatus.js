export const MODERATION_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const normalizeModerationStatus = (property) => {
  const raw =
    property?.verificationStatus || property?.verification?.status || MODERATION_STATUS.DRAFT;

  if (raw === "verified") return MODERATION_STATUS.APPROVED;
  if (raw === "review") return MODERATION_STATUS.PENDING;
  return raw;
};

export const isListingPublic = (property) =>
  normalizeModerationStatus(property) === MODERATION_STATUS.APPROVED &&
  property?.listingStatus !== "Blocked";

export const moderationStatusMeta = (status, t) => {
  const map = {
    draft: {
      colorScheme: "gray",
      label: t?.("myListings.moderationDraft") || "Draft",
    },
    pending: {
      colorScheme: "orange",
      label: t?.("myListings.moderationPending") || "Under review",
    },
    approved: {
      colorScheme: "green",
      label: t?.("myListings.moderationApproved") || "Approved",
    },
    rejected: {
      colorScheme: "red",
      label: t?.("myListings.moderationRejected") || "Rejected",
    },
  };
  return map[status] || map.draft;
};
