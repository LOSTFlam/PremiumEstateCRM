const normalizeLanguage = (language = "ru") =>
  String(language).toLowerCase().startsWith("ru") ? "ru" : "en";

export const PRIMARY_STOREFRONT_SLUGS = [
  "all-offers",
  "houses",
  "apartments",
  "plots",
  "commercial",
];

export const COLLECTION_STOREFRONT_SLUGS = [
  "verified",
  "family-homes",
  "city-apartments",
  "investment-plots",
  "premium-commercial",
];

export const DEFAULT_STOREFRONT_PRESETS = [
  {
    slug: "all-offers",
    type: "all",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    bathrooms: "all",
    onlyWithPhotos: false,
    onlyRich: false,
    verificationStatus: "all",
    featuredCollection: "",
    sortBy: "latest",
    isActive: true,
  },
  {
    slug: "houses",
    type: "house",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    bathrooms: "all",
    onlyWithPhotos: false,
    onlyRich: false,
    verificationStatus: "all",
    featuredCollection: "",
    sortBy: "latest",
    isActive: true,
  },
  {
    slug: "apartments",
    type: "apartment",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    bathrooms: "all",
    onlyWithPhotos: false,
    onlyRich: false,
    verificationStatus: "all",
    featuredCollection: "",
    sortBy: "latest",
    isActive: true,
  },
  {
    slug: "plots",
    type: "land",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    bathrooms: "all",
    onlyWithPhotos: false,
    onlyRich: false,
    verificationStatus: "all",
    featuredCollection: "",
    sortBy: "latest",
    isActive: true,
  },
  {
    slug: "commercial",
    type: "commercial",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    bathrooms: "all",
    onlyWithPhotos: false,
    onlyRich: false,
    verificationStatus: "all",
    featuredCollection: "",
    sortBy: "latest",
    isActive: true,
  },
  {
    slug: "verified",
    type: "all",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    bathrooms: "all",
    onlyWithPhotos: true,
    onlyRich: true,
    verificationStatus: "all",
    featuredCollection: "",
    sortBy: "bestFilled",
    isActive: true,
  },
  {
    slug: "family-homes",
    type: "house",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "3",
    bathrooms: "all",
    onlyWithPhotos: true,
    onlyRich: false,
    verificationStatus: "all",
    featuredCollection: "",
    sortBy: "latest",
    isActive: true,
  },
  {
    slug: "city-apartments",
    type: "apartment",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    bathrooms: "all",
    onlyWithPhotos: true,
    onlyRich: false,
    verificationStatus: "all",
    featuredCollection: "",
    sortBy: "latest",
    isActive: true,
  },
  {
    slug: "investment-plots",
    type: "land",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    bathrooms: "all",
    onlyWithPhotos: true,
    onlyRich: false,
    verificationStatus: "all",
    featuredCollection: "",
    sortBy: "latest",
    isActive: true,
  },
  {
    slug: "premium-commercial",
    type: "commercial",
    status: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "all",
    bathrooms: "all",
    onlyWithPhotos: true,
    onlyRich: false,
    verificationStatus: "all",
    featuredCollection: "",
    sortBy: "bestFilled",
    isActive: true,
  },
];

const PRESET_META = {
  "all-offers": {
    route: "/offers",
    badge: { ru: "Вся витрина", en: "Full storefront" },
    title: {
      ru: "Все предложения агентства в одной витрине",
      en: "All agency listings in one storefront",
    },
    description: {
      ru: "Главная коллекция без сужения спроса: дома, квартиры, участки и коммерческая недвижимость в одной системе фильтров.",
      en: "The master collection without narrowing intent: houses, apartments, land, and commercial property in one filter system.",
    },
    adminLabel: { ru: "Все предложения", en: "All offers" },
  },
  houses: {
    route: "/offers/houses",
    badge: { ru: "Частные резиденции", en: "Private residences" },
    title: { ru: "Дома, виллы и таунхаусы", en: "Houses, villas, and townhouses" },
    description: {
      ru: "Дома и виллы: отдельная страница с фильтрами по спальням и санузлам.",
      en: "A dedicated page for houses and villas with CRM-controlled defaults for bedrooms, bathrooms, and other filters.",
    },
    adminLabel: { ru: "Дома", en: "Houses" },
  },
  apartments: {
    route: "/offers/apartments",
    badge: { ru: "Городская витрина", en: "Urban inventory" },
    title: { ru: "Квартиры и резиденции", en: "Apartments and residences" },
    description: {
      ru: "Квартиры для жизни, аренды и инвестиций — на отдельной странице.",
      en: "Urban inventory for living, rental income, and investment, collected into a dedicated page.",
    },
    adminLabel: { ru: "Квартиры", en: "Apartments" },
  },
  plots: {
    route: "/offers/plots",
    badge: { ru: "Земельный спрос", en: "Land demand" },
    title: {
      ru: "Участки под строительство и девелопмент",
      en: "Plots for development and construction",
    },
    description: {
      ru: "Участки с отдельными фильтрами и удобным просмотром.",
      en: "Land offers with their own filter defaults and a separate browsing scenario.",
    },
    adminLabel: { ru: "Участки", en: "Plots" },
  },
  commercial: {
    route: "/offers/commercial",
    badge: { ru: "Коммерческий блок", en: "Commercial block" },
    title: { ru: "Коммерческая недвижимость", en: "Commercial real estate" },
    description: {
      ru: "Офисы и коммерческие площади — отдельная витрина с фильтрами.",
      en: "Offices, showrooms, and business spaces with their own page and configurable filter defaults.",
    },
    adminLabel: { ru: "Коммерция", en: "Commercial" },
  },
  verified: {
    route: "/collections/verified",
    adminLabel: { ru: "Проверенная витрина", en: "Verified storefront" },
  },
  "family-homes": {
    route: "/collections/family-homes",
    adminLabel: { ru: "Семейные дома", en: "Family homes" },
  },
  "city-apartments": {
    route: "/collections/city-apartments",
    adminLabel: { ru: "Городские квартиры", en: "City apartments" },
  },
  "investment-plots": {
    route: "/collections/investment-plots",
    adminLabel: { ru: "Участки и девелопмент", en: "Land and development" },
  },
  "premium-commercial": {
    route: "/collections/premium-commercial",
    adminLabel: { ru: "Премиальная коммерция", en: "Premium commercial" },
  },
};

const normalizeBoolean = (value) =>
  value === true || value === "true" || value === 1 || value === "1";

export const normalizeStorefrontPreset = (preset = {}, fallback = {}) => ({
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

export const mergeStorefrontPresets = (incoming = []) => {
  const incomingMap = new Map(
    (Array.isArray(incoming) ? incoming : [])
      .map((preset) => normalizeStorefrontPreset(preset))
      .filter((preset) => preset.slug)
      .map((preset) => [preset.slug, preset])
  );

  return DEFAULT_STOREFRONT_PRESETS.map((preset) =>
    normalizeStorefrontPreset(incomingMap.get(preset.slug) || {}, preset)
  );
};

export const getStorefrontPresetBySlug = (presets = [], slug = "") => {
  const targetSlug = String(slug || "").trim();
  const source = Array.isArray(presets) && presets.length ? presets : DEFAULT_STOREFRONT_PRESETS;
  return (
    source.find((preset) => preset.slug === targetSlug) ||
    DEFAULT_STOREFRONT_PRESETS.find((preset) => preset.slug === targetSlug) ||
    null
  );
};

export const getStorefrontPresetMeta = (slug, language = "ru") => {
  const lang = normalizeLanguage(language);
  const meta = PRESET_META[String(slug || "").trim()];
  if (!meta) return null;

  return {
    slug,
    route: meta.route,
    badge: meta.badge?.[lang] || "",
    title: meta.title?.[lang] || "",
    description: meta.description?.[lang] || "",
    adminLabel: meta.adminLabel?.[lang] || slug,
  };
};

export const resolveStorefrontPresetSlug = ({ forcedType = null, collectionSlug = "" } = {}) => {
  if (collectionSlug) return collectionSlug;
  if (forcedType === "house") return "houses";
  if (forcedType === "apartment") return "apartments";
  if (forcedType === "land") return "plots";
  if (forcedType === "commercial") return "commercial";
  return "all-offers";
};
