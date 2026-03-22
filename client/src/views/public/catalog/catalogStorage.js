const readIds = (key) => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (error) {
    console.error(`Failed to read ${key}`, error);
    return [];
  }
};

const writeIds = (key, ids) => {
  if (typeof window === "undefined") return [];

  const next = Array.from(new Set((ids || []).filter(Boolean)));
  window.localStorage.setItem(key, JSON.stringify(next));
  return next;
};

const toggleId = (key, id, max) => {
  const current = readIds(key);
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [id, ...current];
  return writeIds(key, typeof max === "number" ? next.slice(0, max) : next);
};

const pushRecentId = (key, id, max = 12) => {
  const current = readIds(key).filter((item) => item !== id);
  return writeIds(key, [id, ...current].slice(0, max));
};

export const FAVORITES_KEY = "public_catalog_favorites";
export const COMPARE_KEY = "public_catalog_compare";
export const RECENT_KEY = "public_catalog_recent";

export const getFavoriteIds = () => readIds(FAVORITES_KEY);
export const getCompareIds = () => readIds(COMPARE_KEY);
export const getRecentlyViewedIds = () => readIds(RECENT_KEY);

export const toggleFavoriteId = (id) => toggleId(FAVORITES_KEY, id, 24);
export const toggleCompareId = (id) => toggleId(COMPARE_KEY, id, 3);
export const pushRecentlyViewedId = (id) => pushRecentId(RECENT_KEY, id, 12);

export const clearCompareIds = () => writeIds(COMPARE_KEY, []);
export const clearFavoriteIds = () => writeIds(FAVORITES_KEY, []);
export const clearRecentlyViewedIds = () => writeIds(RECENT_KEY, []);
