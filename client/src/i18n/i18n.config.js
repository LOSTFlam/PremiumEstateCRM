import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';

const syncDocumentLanguage = (lng) => {
  if (typeof document === 'undefined') return;

  const resolved = String(lng || 'en').toLowerCase().startsWith('ru') ? 'ru' : 'en';
  document.documentElement.lang = resolved;
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      ru: { translation: ruTranslations }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

syncDocumentLanguage(i18next.resolvedLanguage || i18next.language);
i18next.on('languageChanged', syncDocumentLanguage);

export default i18next;
