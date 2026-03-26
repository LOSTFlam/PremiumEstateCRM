import { useTranslation } from 'react-i18next';

/**
 * Safe translation hook with fallback values
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback value if translation is not available
 * @returns {string} Translated value or fallback
 */
export const useSafeTranslation = () => {
  const { t, i18n } = useTranslation();
  
  const safeT = (key, fallback = '') => {
    try {
      return t?.(key) || fallback;
    } catch (error) {
      return fallback;
    }
  };
  
  return { t: safeT, i18n };
};

export default useSafeTranslation;
