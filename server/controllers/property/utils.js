const fs = require("fs");
const path = require("path");
const { getUsdRubRate, roundAmount } = require("../currency/exchangeRate.service");

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

  const fallbackStatus = checklist.length >= 5 ? "verified" : checklist.length >= 3 ? "review" : "pending";

  return {
    status: property?.verificationStatus || fallbackStatus,
    score: Number(property?.verificationScore || Math.min(checklist.length * 20, 100)),
    checklist,
    notes: property?.verificationNotes || "",
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

const normalizePublicProperty = (property) => {
  if (!property) return null;

  const normalized = { ...property };
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

const parseAmount = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const normalized = String(value)
    .replace(/\s/g, "")
    .replace(/,/g, ".")
    .replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizePropertyPricing = async (payload = {}) => {
  const nextPayload = { ...payload };
  const priceCurrency =
    String(
      nextPayload.priceCurrency ||
        nextPayload.listingPriceCurrency ||
        "USD",
    ).toUpperCase() === "RUB"
      ? "RUB"
      : "USD";

  const providedUsd = parseAmount(nextPayload.listingPrice);
  const providedRub = parseAmount(nextPayload.listingPriceRub);

  if (providedUsd === null && providedRub === null) {
    return nextPayload;
  }

  let rate = parseAmount(nextPayload.priceExchangeRate);

  if (!rate) {
    try {
      const liveRate = await getUsdRubRate();
      rate = parseAmount(liveRate?.rate);
      if (!nextPayload.priceExchangeUpdatedAt && liveRate?.fetchedAt) {
        nextPayload.priceExchangeUpdatedAt = liveRate.fetchedAt;
      }
    } catch (error) {
      console.error("Failed to refresh exchange rate for property pricing:", error);
    }
  }

  let usdAmount = providedUsd;
  let rubAmount = providedRub;

  if (priceCurrency === "RUB") {
    rubAmount = providedRub ?? providedUsd;
    if (rubAmount !== null && rate) {
      usdAmount = roundAmount(rubAmount / rate, 2);
    }
  } else {
    usdAmount = providedUsd ?? providedRub;
    if (usdAmount !== null && rate) {
      rubAmount = roundAmount(usdAmount * rate, 0);
    }
  }

  if (usdAmount !== null) {
    nextPayload.listingPrice = usdAmount;
  }

  if (rubAmount !== null) {
    nextPayload.listingPriceRub = rubAmount;
  }

  nextPayload.priceCurrency = priceCurrency;

  if (rate) {
    nextPayload.priceExchangeRate = roundAmount(rate, 4);
  }

  if (!nextPayload.priceExchangeUpdatedAt) {
    nextPayload.priceExchangeUpdatedAt = new Date();
  }

  return nextPayload;
};

module.exports = {
  slugify,
  buildVerificationChecklist,
  buildVerificationState,
  buildPublicAgent,
  buildSeoMeta,
  normalizePublicProperty,
  getOrdinalSuffix,
  ensureUploadDir,
  buildUniqueFilename,
  normalizePropertyPricing,
};
