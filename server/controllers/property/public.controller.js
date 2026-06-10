const { Property } = require("../../model/schema/property");
const { LEGACY_APPROVED } = require("../../constants/moderation");
const { normalizePublicProperty } = require("./utils");
const { isValidObjectId } = require("mongoose");

const populatePublicCreator = {
  path: "createBy",
  match: { deleted: false },
  select: "firstName lastName username phoneNumber role",
};

const publicIndex = async (req, res) => {
  try {
    // $ne:true also covers legacy documents that miss the "deleted" flag
    const query = {
      deleted: { $ne: true },
      verificationStatus: { $in: LEGACY_APPROVED },
      listingStatus: { $ne: "Blocked" },
    };

    if (req.query.propertyType) {
      query.propertyType = { $regex: String(req.query.propertyType), $options: "i" };
    }

    const properties = await Property.find(query)
      .populate({
        ...populatePublicCreator,
        select: "firstName lastName username phoneNumber role isBlocked",
      })
      .sort({ updatedDate: -1, createdDate: -1 })
      .lean();

    let normalized = properties
      .filter((item) => item?.createBy && !item.createBy.isBlocked)
      .map(normalizePublicProperty);

    if (req.query.verificationStatus) {
      normalized = normalized.filter((item) => item?.verification?.status === req.query.verificationStatus);
    }

    if (req.query.verified === "true") {
      normalized = normalized.filter((item) => item?.verification?.status === "verified");
    }

    res.status(200).json(normalized);
  } catch (err) {
    // Console statement removed
    res.status(500).json({ error: "Failed to fetch public properties" });
  }
};

const publicView = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "no Data Found." });
    }

    const property = await Property.findOne({
      _id: req.params.id,
      deleted: { $ne: true },
      verificationStatus: { $in: LEGACY_APPROVED },
      listingStatus: { $ne: "Blocked" },
    })
      .populate({
        ...populatePublicCreator,
        select: "firstName lastName username phoneNumber role isBlocked",
      })
      .lean();

    if (!property || !property.createBy || property.createBy.isBlocked) {
      return res.status(404).json({ message: "no Data Found." });
    }

    res.status(200).json({ property: normalizePublicProperty(property) });
  } catch (err) {
    // Console statement removed
    res.status(500).json({ error: "Failed to fetch public property" });
  }
};

const publicByIds = async (req, res) => {
  try {
    const rawIds = String(req.query.ids || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const objectIds = rawIds.filter((id) => isValidObjectId(id));
    if (!objectIds.length) {
      return res.status(200).json([]);
    }

    const properties = await Property.find({
      _id: { $in: objectIds },
      deleted: { $ne: true },
      verificationStatus: { $in: LEGACY_APPROVED },
      listingStatus: { $ne: "Blocked" },
    })
      .populate({
        ...populatePublicCreator,
        select: "firstName lastName username phoneNumber role isBlocked",
      })
      .lean();

    const normalized = properties
      .filter((item) => item?.createBy && !item.createBy.isBlocked)
      .map(normalizePublicProperty);

    res.status(200).json(normalized);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch public properties by ids" });
  }
};

const publicViewBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      return res.status(404).json({ message: "no Data Found." });
    }

    const property = await Property.findOne({
      deleted: { $ne: true },
      verificationStatus: { $in: LEGACY_APPROVED },
      listingStatus: { $ne: "Blocked" },
      $or: [{ publicSlug: slug }, { seoSlug: slug }],
    })
      .populate({
        ...populatePublicCreator,
        select: "firstName lastName username phoneNumber role isBlocked",
      })
      .lean();

    if (!property || !property.createBy || property.createBy.isBlocked) {
      return res.status(404).json({ message: "no Data Found." });
    }

    res.status(200).json({ property: normalizePublicProperty(property) });
  } catch (err) {
    // Console statement removed
    res.status(500).json({ error: "Failed to fetch public property by slug" });
  }
};

module.exports = {
  publicIndex,
  publicByIds,
  publicView,
  publicViewBySlug,
};
