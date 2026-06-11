const fs = require("fs");
const path = require("path");
const { getStockImageForProperty } = require("../../utils/propertyStockImages");

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

const buildVerificationChecklist = (property) => {
  const checklist = [];

  if (property?.propertyAddress) checklist.push("address");
  if (property?.listingPrice) checklist.push("price");
  if (property?.marketingDescription || property?.propertyDescription) checklist.push("description");
  if (Array.isArray(property?.propertyPhotos) && property.propertyPhotos.length > 0) checklist.push("photos");
  if (Array.isArray(property?.propertyDocuments) && property.propertyDocuments.length > 0) checklist.push("documents");
  if (property?.createBy || property?.listingAgentOrTeam) checklist.push("agent");

  return checklist;
};

const buildVerificationState = (property) => {
  const checklist = Array.isArray(property?.verificationChecklist) && property.verificationChecklist.length
    ? property.verificationChecklist
    : buildVerificationChecklist(property);

  const rawStatus = property?.verificationStatus || "draft";
  const normalizedStatus =
    rawStatus === "verified"
      ? "approved"
      : rawStatus === "review"
        ? "pending"
        : rawStatus;

  return {
    status: normalizedStatus,
    score: Number(property?.verificationScore || Math.min(checklist.length * 20, 100)),
    checklist,
    notes: property?.verificationNotes || "",
    rejectionReason: property?.rejectionReason || "",
    submittedAt: property?.moderationSubmittedAt || null,
    reviewedAt: property?.moderationReviewedAt || null,
    updatedAt: property?.verificationUpdatedAt || property?.updatedDate || property?.createdDate || null,
  };
};

const buildPublicAgent = (property) => {
  const agentUser = property?.createBy;
  const fullName = [agentUser?.firstName, agentUser?.lastName].filter(Boolean).join(" ").trim();
  const label = property?.listingAgentOrTeam || fullName || "Property consultant";

  return {
    _id: agentUser?._id || null,
    fullName: fullName || label,
    firstName: agentUser?.firstName || "",
    lastName: agentUser?.lastName || "",
    label,
    email: agentUser?.username || "",
    phoneNumber: agentUser?.phoneNumber ? String(agentUser.phoneNumber) : "",
    responseTimeText: "Usually responds within 15 minutes",
  };
};

const buildSeoMeta = (property) => {
  const fallbackName = property?.name || property?.propertyAddress || "Listing";
  const fallbackDescription =
    property?.seoDescription ||
    property?.marketingDescription ||
    property?.propertyDescription ||
    `${fallbackName} available for viewing online.`;

  return {
    title: property?.seoTitle || `${fallbackName} | ${property?.propertyType || "Real Estate"}`,
    description: fallbackDescription,
    keywords:
      property?.seoKeywords ||
      [property?.propertyType, property?.propertyAddress, property?.listingStatus]
        .filter(Boolean)
        .join(", "),
    slug: property?.publicSlug || slugify(fallbackName || property?._id),
  };
};

const isExternalImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("data:") || url.startsWith("blob:")) return false;
  if (url.startsWith("/")) return false;
  return /^https?:\/\//i.test(url);
};

const normalizeMediaList = (items, propertyType, mediaKind = "photo") => {
  if (!Array.isArray(items)) return items;
  const type = mediaKind === "floorPlan" ? "floorPlan" : propertyType;

  return items.map((item, index) => {
    const img = item?.img;
    if (!isExternalImageUrl(img)) return item;

    return {
      ...item,
      img: getStockImageForProperty(type, `${img}-${index}`),
    };
  });
};

const normalizeSquareFootage = (value) => {
  if (value === null || value === undefined || value === "") return value;
  const cleaned = String(value).replace(/\s*[mм][²2]\s*/gi, "").trim();
  if (!cleaned) return value;
  return `${cleaned} m²`;
};

const normalizePropertyMedia = (property) => {
  if (!property) return property;

  return {
    ...property,
    propertyPhotos: normalizeMediaList(
      property.propertyPhotos,
      property.propertyType,
      "photo",
    ),
    floorPlans: normalizeMediaList(
      property.floorPlans,
      property.propertyType,
      "floorPlan",
    ),
  };
};

const normalizePublicProperty = (property) => {
  if (!property) return null;

  const normalized = normalizePropertyMedia({ ...property });
  if (normalized.squareFootage !== undefined && normalized.squareFootage !== null) {
    normalized.squareFootage = normalizeSquareFootage(normalized.squareFootage);
  }
  normalized.agent = buildPublicAgent(property);
  normalized.verification = buildVerificationState(property);
  normalized.seo = buildSeoMeta(property);

  delete normalized.deleted;
  delete normalized.__v;
  delete normalized.createBy;
  delete normalized.verificationUpdatedBy;

  return normalized;
};

const getOrdinalSuffix = (number) => {
  const suffix = ["th", "st", "nd", "rd"][number % 10] || "th";
  return number % 100 === 11 || number % 100 === 12 || number % 100 === 13 ? "th" : suffix;
};

const ensureUploadDir = (uploadDir) => {
  fs.mkdirSync(uploadDir, { recursive: true });
};

const buildUniqueFilename = (uploadDir, originalname) => {
  const filePath = path.join(uploadDir, originalname);

  if (!fs.existsSync(filePath)) {
    return originalname;
  }

  const timestamp = Date.now() + Math.floor(Math.random() * 90);
  const [name, ext] = originalname.split(".");
  return `${name}-${timestamp}.${ext}`;
};

module.exports = {
  slugify,
  buildVerificationChecklist,
  buildVerificationState,
  buildPublicAgent,
  buildSeoMeta,
  normalizePropertyMedia,
  normalizePublicProperty,
  getOrdinalSuffix,
  ensureUploadDir,
  buildUniqueFilename,
};
