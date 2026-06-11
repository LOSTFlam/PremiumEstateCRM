const mongoose = require("mongoose");
const HomepageContent = require("../../model/schema/homepageContent");

const DEFAULT_VISIBILITY = {
  hero: true,
  features: true,
  market: true,
  collections: true,
  services: true,
  locations: true,
  catalog: true,
};

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const mergeVisibility = (incoming = {}) =>
  Object.keys(DEFAULT_VISIBILITY).reduce((acc, key) => {
    acc[key] = incoming[key] !== false;
    return acc;
  }, {});

const normalizeHeroPropertyId = (value) => {
  if (!value) return null;
  const id = String(value).trim();
  return mongoose.Types.ObjectId.isValid(id) ? id : null;
};

const normalizeContent = (incoming = {}) => ({
  visibility: mergeVisibility(incoming.visibility),
  locales: {
    ru: isPlainObject(incoming.locales?.ru) ? incoming.locales.ru : {},
    en: isPlainObject(incoming.locales?.en) ? incoming.locales.en : {},
  },
  heroPropertyId: normalizeHeroPropertyId(incoming.heroPropertyId),
});

const ensureDocument = async () => {
  let document = await HomepageContent.findOne({ singletonKey: "default" });

  if (!document) {
    document = await HomepageContent.create({
      singletonKey: "default",
      visibility: DEFAULT_VISIBILITY,
      locales: { ru: {}, en: {} },
      updatedDate: new Date(),
    });
  }

  return document;
};

const index = async (req, res) => {
  try {
    const document = await ensureDocument();
    return res.status(200).json(document);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch homepage content" });
  }
};

const publicIndex = async (req, res) => {
  try {
    const document = await ensureDocument();
    return res.status(200).json({
      visibility: mergeVisibility(document.visibility),
      locales: document.locales || { ru: {}, en: {} },
      heroPropertyId: document.heroPropertyId || null,
      updatedDate: document.updatedDate,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch public homepage content" });
  }
};

const edit = async (req, res) => {
  try {
    const normalized = normalizeContent(req.body || {});
    const document = await HomepageContent.findOneAndUpdate(
      { singletonKey: "default" },
      {
        $set: {
          visibility: normalized.visibility,
          locales: normalized.locales,
          heroPropertyId: normalized.heroPropertyId,
          updatedDate: new Date(),
          updatedBy: req.user?.userId || null,
        },
      },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json(document);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update homepage content" });
  }
};

module.exports = {
  index,
  publicIndex,
  edit,
};
