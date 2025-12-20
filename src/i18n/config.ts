import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from '../locales/en/common.json';
import enHero from '../locales/en/hero.json';
import enFeatures from '../locales/en/features.json';
import enPricing from '../locales/en/pricing.json';
import enFooter from '../locales/en/footer.json';
import enAbout from '../locales/en/about.json';
import enContact from '../locales/en/contact.json';
import enPrivacy from '../locales/en/privacy.json';
import enTerms from '../locales/en/terms.json';

// Import Spanish translations
import esCommon from '../locales/es/common.json';
import esHero from '../locales/es/hero.json';
import esFeatures from '../locales/es/features.json';
import esPricing from '../locales/es/pricing.json';
import esFooter from '../locales/es/footer.json';
import esAbout from '../locales/es/about.json';
import esContact from '../locales/es/contact.json';
import esPrivacy from '../locales/es/privacy.json';
import esTerms from '../locales/es/terms.json';

const resources = {
  en: {
    common: enCommon,
    hero: enHero,
    features: enFeatures,
    pricing: enPricing,
    footer: enFooter,
    about: enAbout,
    contact: enContact,
    privacy: enPrivacy,
    terms: enTerms,
  },
  es: {
    common: esCommon,
    hero: esHero,
    features: esFeatures,
    pricing: esPricing,
    footer: esFooter,
    about: esAbout,
    contact: esContact,
    privacy: esPrivacy,
    terms: esTerms,
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
