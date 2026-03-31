const { Property } = require("../../model/schema/property");
const { normalizePublicProperty } = require("./utils");
const { isValidObjectId } = require("mongoose");

const populatePublicCreator = {
  path: "createBy",
  match: { deleted: false },
  select: "firstName lastName username phoneNumber role",
};

const publicIndex = async (req, res) => {
  try {
    const query = { deleted: false };

    if (req.query.propertyType) {
      query.propertyType = { $regex: String(req.query.propertyType), $options: "i" };
    }

    const properties = await Property.find(query)
      .populate(populatePublicCreator)
      .sort({ updatedDate: -1, createdDate: -1 })
      .lean();

    let normalized = properties.map(normalizePublicProperty);

    if (req.query.verificationStatus) {
      normalized = normalized.filter((item) => item?.verification?.status === req.query.verificationStatus);
    }

    if (req.query.verified === "true") {
      normalized = normalized.filter((item) => item?.verification?.status === "verified");
    }

    res.status(200).json(normalized);
  } catch (err) {
    console.error("Failed to fetch public properties:", err);
    res.status(500).json({ error: "Failed to fetch public properties" });
  }
};

const publicByIds = async (req, res) => {
  try {
    const ids = String(req.query.ids || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!ids.length) {
      return res.status(200).json({ data: [] });
    }

    const properties = await Property.find({
      _id: { $in: ids },
      deleted: false,
    })
      .populate(populatePublicCreator)
      .lean();

    const normalized = properties.map(normalizePublicProperty);
    res.status(200).json({ data: normalized });
  } catch (err) {
    console.error("Failed to fetch public properties by ids:", err);
    res.status(500).json({ error: "Failed to fetch public properties by ids" });
  }
};

const publicView = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "no Data Found." });
    }

    const property = await Property.findOne({
      _id: req.params.id,
      deleted: false,
    })
      .populate(populatePublicCreator)
      .lean();

    if (!property) {
      return res.status(404).json({ message: "no Data Found." });
    }

    res.status(200).json({ property: normalizePublicProperty(property) });
  } catch (err) {
    console.error("Failed to fetch public property:", err);
    res.status(500).json({ error: "Failed to fetch public property" });
  }
};

const publicViewBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      return res.status(404).json({ message: "no Data Found." });
    }

    const property = await Property.findOne({
      deleted: false,
      $or: [{ publicSlug: slug }, { seoSlug: slug }],
    })
      .populate(populatePublicCreator)
      .lean();

    if (!property) {
      return res.status(404).json({ message: "no Data Found." });
    }

    res.status(200).json({ property: normalizePublicProperty(property) });
  } catch (err) {
    console.error("Failed to fetch public property by slug:", err);
    res.status(500).json({ error: "Failed to fetch public property by slug" });
  }
};

module.exports = {
  publicIndex,
  publicByIds,
  publicView,
  publicViewBySlug,
};
