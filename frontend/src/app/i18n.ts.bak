import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationTR from './locales/tr/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  tr: { translation: translationTR },
  en: { translation: translationEN },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'tr',
      interpolation: { escapeValue: false },
      supportedLngs: ['tr', 'en'],
      detection: { order: ['localStorage', 'navigator'] },
    });
}

export default i18n;
