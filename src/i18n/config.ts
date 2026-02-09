import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from '../locales/en/common.json';
import enFeatures from '../locales/en/features.json';
import enAbout from '../locales/en/about.json';
import enContact from '../locales/en/contact.json';
import enPrivacy from '../locales/en/privacy.json';
import enTerms from '../locales/en/terms.json';
import enDarkroom from '../locales/en/darkroom.json';
import enResearcher from '../locales/en/researcher.json';
import enDeveloper from '../locales/en/developer.json';

// Import Spanish translations
import esCommon from '../locales/es/common.json';
import esFeatures from '../locales/es/features.json';
import esAbout from '../locales/es/about.json';
import esContact from '../locales/es/contact.json';
import esPrivacy from '../locales/es/privacy.json';
import esTerms from '../locales/es/terms.json';
import esDarkroom from '../locales/es/darkroom.json';
import esResearcher from '../locales/es/researcher.json';
import esDeveloper from '../locales/es/developer.json';

const resources = {
  en: {
    common: enCommon,
    features: enFeatures,
    about: enAbout,
    contact: enContact,
    privacy: enPrivacy,
    terms: enTerms,
    darkroom: enDarkroom,
    researcher: enResearcher,
    developer: enDeveloper,
  },
  es: {
    common: esCommon,
    features: esFeatures,
    about: esAbout,
    contact: esContact,
    privacy: esPrivacy,
    terms: esTerms,
    darkroom: esDarkroom,
    researcher: esResearcher,
    developer: esDeveloper,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupFromPathIndex: 0,
    },
  });

export default i18n;
