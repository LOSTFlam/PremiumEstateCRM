import { getApi, putApi } from "services/api";
import {
  COMPARE_KEY,
  FAVORITES_KEY,
  RECENT_KEY,
  SAVED_SEARCHES_KEY,
  getCompareIds,
  getFavoriteIds,
  getRecentlyViewedIds,
  getSavedSearches,
} from "views/public/catalog/catalogStorage";

const LEGACY_FAVORITES_KEY = "favorites";
let syncTimer = null;

const defaultBuyerProfile = () => ({
  budgetMin: null,
  budgetMax: null,
  preferredCity: "",
  propertyTypes: [],
  bedroomsMin: null,
  contactMethod: "phone",
  about: "",
});

const defaultNotifications = () => ({
  emailUpdates: true,
  newListings: true,
  priceChanges: false,
});

let extendedCache = {
  propertyNotes: {},
  buyerProfile: defaultBuyerProfile(),
  notifications: defaultNotifications(),
};

const isAuthenticated = () => {
  try {
    return Boolean(localStorage.getItem("user") || sessionStorage.getItem("user"));
  } catch {
    return false;
  }
};

const writeIds = (key, ids) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    key,
    JSON.stringify(Array.from(new Set((ids || []).filter(Boolean))))
  );
};

const mergeIdLists = (localIds, remoteIds, max) => {
  const merged = Array.from(new Set([...(remoteIds || []), ...(localIds || [])].map(String)));
  return merged.slice(0, max);
};

const mergeRecent = (localIds, remoteItems) => {
  const remote = (remoteItems || []).map((item) => ({
    propertyId: String(item?.propertyId || ""),
    viewedAt: item?.viewedAt || new Date().toISOString(),
  }));

  const map = new Map();
  remote.forEach((item) => {
    if (item.propertyId) map.set(item.propertyId, item);
  });

  (localIds || []).forEach((id, index) => {
    const propertyId = String(id);
    if (!propertyId || map.has(propertyId)) return;
    map.set(propertyId, {
      propertyId,
      viewedAt: new Date(Date.now() - index * 1000).toISOString(),
    });
  });

  return Array.from(map.values()).slice(0, 12);
};

const mergePropertyNotes = (localNotes, remoteNotes) => ({
  ...(remoteNotes || {}),
  ...(localNotes || {}),
});

const mergeSavedSearches = (local, remote) => {
  const seen = new Set();
  const merged = [];

  [...(remote || []), ...(local || [])].forEach((item) => {
    const key = item?.id || JSON.stringify(item?.filters || {});
    if (!key || seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  });

  return merged.slice(0, 12);
};

export const migrateLegacyStorage = () => {
  if (typeof window === "undefined") return;

  try {
    const legacyRaw = window.localStorage.getItem(LEGACY_FAVORITES_KEY);
    if (!legacyRaw) return;

    const legacy = JSON.parse(legacyRaw);
    if (!Array.isArray(legacy) || legacy.length === 0) return;

    const current = getFavoriteIds();
    writeIds(FAVORITES_KEY, [...legacy, ...current]);
    window.localStorage.removeItem(LEGACY_FAVORITES_KEY);
  } catch {
    // ignore migration errors
  }
};

export const getExtendedPreferences = () => ({ ...extendedCache });

export const setExtendedPreferences = (partial = {}) => {
  extendedCache = {
    propertyNotes: partial.propertyNotes ?? extendedCache.propertyNotes,
    buyerProfile: { ...extendedCache.buyerProfile, ...(partial.buyerProfile || {}) },
    notifications: { ...extendedCache.notifications, ...(partial.notifications || {}) },
  };
  return extendedCache;
};

export const collectLocalPreferences = () => ({
  favoritePropertyIds: getFavoriteIds(),
  comparePropertyIds: getCompareIds(),
  recentlyViewed: getRecentlyViewedIds().map((propertyId, index) => ({
    propertyId,
    viewedAt: new Date(Date.now() - index * 1000).toISOString(),
  })),
  savedSearches: getSavedSearches(),
  propertyNotes: extendedCache.propertyNotes,
  buyerProfile: extendedCache.buyerProfile,
  notifications: extendedCache.notifications,
});

export const applyPreferencesToLocal = (preferences = {}) => {
  if (typeof window === "undefined") return;

  writeIds(FAVORITES_KEY, preferences.favoritePropertyIds || []);
  writeIds(COMPARE_KEY, preferences.comparePropertyIds || []);

  const recentIds = (preferences.recentlyViewed || [])
    .map((item) => item?.propertyId)
    .filter(Boolean);
  writeIds(RECENT_KEY, recentIds);

  window.localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(preferences.savedSearches || []));

  setExtendedPreferences({
    propertyNotes: preferences.propertyNotes || {},
    buyerProfile: { ...defaultBuyerProfile(), ...(preferences.buyerProfile || {}) },
    notifications: { ...defaultNotifications(), ...(preferences.notifications || {}) },
  });

  window.dispatchEvent(new CustomEvent("cabinet-preferences-updated"));
};

export const syncPreferencesToServer = async () => {
  if (!isAuthenticated()) return null;

  try {
    const payload = collectLocalPreferences();
    const response = await putApi("api/user/preferences", payload);
    const preferences = response?.data?.preferences || payload;
    setExtendedPreferences(preferences);
    return preferences;
  } catch {
    return null;
  }
};

export const schedulePreferencesSync = () => {
  if (!isAuthenticated()) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncPreferencesToServer();
  }, 700);
};

export const saveExtendedPreferences = async (partial = {}) => {
  setExtendedPreferences(partial);
  return syncPreferencesToServer();
};

export const loadAndMergePreferences = async () => {
  if (!isAuthenticated()) return null;

  migrateLegacyStorage();

  try {
    const data = await getApi("api/user/preferences", { silent: true });
    const remote = data?.preferences || {};
    const local = collectLocalPreferences();

    const merged = {
      favoritePropertyIds: mergeIdLists(local.favoritePropertyIds, remote.favoritePropertyIds, 24),
      comparePropertyIds: mergeIdLists(local.comparePropertyIds, remote.comparePropertyIds, 3),
      recentlyViewed: mergeRecent(
        local.recentlyViewed.map((item) => item.propertyId),
        remote.recentlyViewed
      ),
      savedSearches: mergeSavedSearches(local.savedSearches, remote.savedSearches),
      propertyNotes: mergePropertyNotes(local.propertyNotes, remote.propertyNotes),
      buyerProfile: { ...defaultBuyerProfile(), ...(remote.buyerProfile || {}) },
      notifications: { ...defaultNotifications(), ...(remote.notifications || {}) },
    };

    applyPreferencesToLocal(merged);
    await putApi("api/user/preferences", merged);
    return merged;
  } catch {
    return collectLocalPreferences();
  }
};
