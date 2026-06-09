import { useTranslation } from "react-i18next";

/**
 * Safe translation function that works even before i18n is fully initialized
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback value
 * @returns {string} Translated value or fallback
 */
export const useSafeT = () => {
  const { t, i18n, ready } = useTranslation();

  const safeT = (key, fallback = "") => {
    if (!ready || !i18n?.isInitialized) {
      return fallback || key.split(".").pop();
    }
    try {
      return t(key, fallback) || fallback;
    } catch (error) {
      return fallback || key.split(".").pop();
    }
  };

  return { t: safeT, i18n, ready };
};

export default useSafeT;
