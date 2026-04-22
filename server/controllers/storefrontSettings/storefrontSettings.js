const StorefrontSettings = require("../../model/schema/storefrontSettings");

const DEFAULT_PRESETS = [
  { slug: "all-offers", type: "all", status: "all", minPrice: "", maxPrice: "", bedrooms: "all", bathrooms: "all", onlyWithPhotos: false, onlyRich: false, verificationStatus: "all", featuredCollection: "", sortBy: "latest", isActive: true },
  { slug: "houses", type: "house", status: "all", minPrice: "", maxPrice: "", bedrooms: "all", bathrooms: "all", onlyWithPhotos: false, onlyRich: false, verificationStatus: "all", featuredCollection: "", sortBy: "latest", isActive: true },
  { slug: "apartments", type: "apartment", status: "all", minPrice: "", maxPrice: "", bedrooms: "all", bathrooms: "all", onlyWithPhotos: false, onlyRich: false, verificationStatus: "all", featuredCollection: "", sortBy: "latest", isActive: true },
  { slug: "plots", type: "land", status: "all", minPrice: "", maxPrice: "", bedrooms: "all", bathrooms: "all", onlyWithPhotos: false, onlyRich: false, verificationStatus: "all", featuredCollection: "", sortBy: "latest", isActive: true },
  { slug: "commercial", type: "commercial", status: "all", minPrice: "", maxPrice: "", bedrooms: "all", bathrooms: "all", onlyWithPhotos: false, onlyRich: false, verificationStatus: "all", featuredCollection: "", sortBy: "latest", isActive: true },
  { slug: "verified", type: "all", status: "all", minPrice: "", maxPrice: "", bedrooms: "all", bathrooms: "all", onlyWithPhotos: true, onlyRich: true, verificationStatus: "all", featuredCollection: "", sortBy: "bestFilled", isActive: true },
  { slug: "family-homes", type: "house", status: "all", minPrice: "", maxPrice: "", bedrooms: "3", bathrooms: "all", onlyWithPhotos: true, onlyRich: false, verificationStatus: "all", featuredCollection: "", sortBy: "latest", isActive: true },
  { slug: "city-apartments", type: "apartment", status: "all", minPrice: "", maxPrice: "", bedrooms: "all", bathrooms: "all", onlyWithPhotos: true, onlyRich: false, verificationStatus: "all", featuredCollection: "", sortBy: "latest", isActive: true },
  { slug: "investment-plots", type: "land", status: "all", minPrice: "", maxPrice: "", bedrooms: "all", bathrooms: "all", onlyWithPhotos: true, onlyRich: false, verificationStatus: "all", featuredCollection: "", sortBy: "latest", isActive: true },
  { slug: "premium-commercial", type: "commercial", status: "all", minPrice: "", maxPrice: "", bedrooms: "all", bathrooms: "all", onlyWithPhotos: true, onlyRich: false, verificationStatus: "all", featuredCollection: "", sortBy: "bestFilled", isActive: true },
];

const normalizeBoolean = (value) => value === true || value === "true" || value === 1 || value === "1";

const normalizePreset = (preset = {}, fallback = {}) => ({
  ...fallback,
  ...preset,
  slug: String(preset.slug || fallback.slug || "").trim(),
  type: String(preset.type || fallback.type || "all"),
  status: String(preset.status || fallback.status || "all"),
  minPrice: String(preset.minPrice ?? fallback.minPrice ?? ""),
  maxPrice: String(preset.maxPrice ?? fallback.maxPrice ?? ""),
  bedrooms: String(preset.bedrooms || fallback.bedrooms || "all"),
  bathrooms: String(preset.bathrooms || fallback.bathrooms || "all"),
  onlyWithPhotos: normalizeBoolean(preset.onlyWithPhotos ?? fallback.onlyWithPhotos),
  onlyRich: normalizeBoolean(preset.onlyRich ?? fallback.onlyRich),
  verificationStatus: String(preset.verificationStatus || fallback.verificationStatus || "all"),
  featuredCollection: String(preset.featuredCollection || fallback.featuredCollection || ""),
  sortBy: String(preset.sortBy || fallback.sortBy || "latest"),
  isActive: normalizeBoolean(preset.isActive ?? fallback.isActive ?? true),
});

const mergePresets = (incomingPresets = []) => {
  const incomingMap = new Map(
    (Array.isArray(incomingPresets) ? incomingPresets : [])
      .map((preset) => normalizePreset(preset))
      .filter((preset) => preset.slug)
      .map((preset) => [preset.slug, preset]),
  );

  return DEFAULT_PRESETS.map((preset) =>
    normalizePreset(incomingMap.get(preset.slug) || {}, preset),
  );
};

const ensureSettingsDocument = async () => {
  let settings = await StorefrontSettings.findOne({ singletonKey: "default" });

  if (!settings) {
    settings = await StorefrontSettings.create({
      singletonKey: "default",
      presets: DEFAULT_PRESETS,
      updatedDate: new Date(),
    });
    return settings;
  }

  const mergedPresets = mergePresets(settings.presets);
  const currentPresets = JSON.stringify(settings.presets || []);
  const nextPresets = JSON.stringify(mergedPresets);

  if (currentPresets !== nextPresets) {
    settings.presets = mergedPresets;
    settings.updatedDate = new Date();
    await settings.save();
  }

  return settings;
};

const index = async (req, res) => {
  try {
    const settings = await ensureSettingsDocument();
    return res.status(200).json(settings);
  } catch (error) {
    // Console statement removed
    return res.status(500).json({ error: "Failed to fetch storefront settings" });
  }
};

const publicIndex = async (req, res) => {
  try {
    const settings = await ensureSettingsDocument();
    return res.status(200).json({
      presets: settings.presets,
      updatedDate: settings.updatedDate,
    });
  } catch (error) {
    // Console statement removed
    return res.status(500).json({ error: "Failed to fetch public storefront settings" });
  }
};

const edit = async (req, res) => {
  try {
    const presets = mergePresets(req.body?.presets);
    const settings = await StorefrontSettings.findOneAndUpdate(
      { singletonKey: "default" },
      {
        $set: {
          presets,
          updatedDate: new Date(),
          updatedBy: req.user?.userId || null,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json(settings);
  } catch (error) {
    // Console statement removed
    return res.status(500).json({ error: "Failed to update storefront settings" });
  }
};

module.exports = {
  index,
  publicIndex,
  edit,
};
