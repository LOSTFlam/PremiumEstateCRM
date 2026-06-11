import { useCallback, useEffect, useState } from "react";
import {
  getCompareIds,
  getFavoriteIds,
  getRecentlyViewedIds,
  getSavedSearches,
} from "views/public/catalog/catalogStorage";
import {
  getExtendedPreferences,
  loadAndMergePreferences,
  schedulePreferencesSync,
} from "services/userPreferences";

export const useCabinetPreferences = ({ autoSync = true } = {}) => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [recentIds, setRecentIds] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [propertyNotes, setPropertyNotes] = useState({});
  const [buyerProfile, setBuyerProfile] = useState({});
  const [notifications, setNotifications] = useState({});
  const [ready, setReady] = useState(false);

  const refreshLocal = useCallback(() => {
    setFavoriteIds(getFavoriteIds());
    setCompareIds(getCompareIds());
    setRecentIds(getRecentlyViewedIds());
    setSavedSearches(getSavedSearches());
    const extended = getExtendedPreferences();
    setPropertyNotes(extended.propertyNotes || {});
    setBuyerProfile(extended.buyerProfile || {});
    setNotifications(extended.notifications || {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      await loadAndMergePreferences();
      if (!cancelled) {
        refreshLocal();
        setReady(true);
      }
    };

    bootstrap();

    const onChange = () => {
      refreshLocal();
      if (autoSync) schedulePreferencesSync();
    };

    window.addEventListener("cabinet-preferences-changed", onChange);
    window.addEventListener("cabinet-preferences-updated", onChange);

    return () => {
      cancelled = true;
      window.removeEventListener("cabinet-preferences-changed", onChange);
      window.removeEventListener("cabinet-preferences-updated", onChange);
    };
  }, [autoSync, refreshLocal]);

  return {
    ready,
    favoriteIds,
    compareIds,
    recentIds,
    savedSearches,
    propertyNotes,
    buyerProfile,
    notifications,
    refreshLocal,
  };
};
