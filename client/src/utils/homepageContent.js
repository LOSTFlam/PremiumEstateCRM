import { DEFAULT_HOMEPAGE_CONTENT, HOMEPAGE_BLOCK_KEYS } from "data/defaultHomepageContent";

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const mergeDeep = (defaults, incoming = {}) => {
  if (!isPlainObject(defaults)) return incoming ?? defaults;
  const result = { ...defaults };

  Object.entries(incoming || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const defaultArray = Array.isArray(defaults[key]) ? defaults[key] : [];
      result[key] = value.map((item, index) => {
        const fallback = defaultArray[index] || {};
        return isPlainObject(item) ? mergeDeep(fallback, item) : item ?? fallback;
      });
      return;
    }

    if (isPlainObject(value) && isPlainObject(defaults[key])) {
      result[key] = mergeDeep(defaults[key], value);
      return;
    }

    if (value !== undefined && value !== null && value !== "") {
      result[key] = value;
    }
  });

  return result;
};

export const mergeHomepageContent = (incoming = {}) => ({
  visibility: mergeDeep(DEFAULT_HOMEPAGE_CONTENT.visibility, incoming.visibility || {}),
  locales: {
    ru: mergeDeep(DEFAULT_HOMEPAGE_CONTENT.locales.ru, incoming.locales?.ru || {}),
    en: mergeDeep(DEFAULT_HOMEPAGE_CONTENT.locales.en, incoming.locales?.en || {}),
  },
});

export const getHomepageLocaleContent = (content, locale = "ru") => {
  const merged = mergeHomepageContent(content || {});
  const lang = String(locale).toLowerCase().startsWith("ru") ? "ru" : "en";
  return {
    visibility: merged.visibility,
    blocks: merged.locales[lang],
    defaults: DEFAULT_HOMEPAGE_CONTENT.locales[lang],
  };
};

export const isHomepageBlockVisible = (visibility, blockKey) =>
  visibility?.[blockKey] !== false;

export { HOMEPAGE_BLOCK_KEYS, DEFAULT_HOMEPAGE_CONTENT };
