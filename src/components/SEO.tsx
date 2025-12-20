import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

export default function SEO({ title, description, path = '' }: SEOProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language || 'en';
  const baseUrl = 'https://sciorex.com';

  // Default titles and descriptions per locale
  const defaultTitles: Record<string, string> = {
    en: 'Sciorex - The King of Knowledge | AI Agent Orchestration Platform',
    es: 'Sciorex - El Rey del Conocimiento | Plataforma de Orquestación de Agentes IA',
  };

  const defaultDescriptions: Record<string, string> = {
    en: 'Create AI agents, chain them into workflows, and let them handle your coding, research, and documentation tasks. 100% local & private. Free for personal use.',
    es: 'Crea agentes de IA, encadénalos en flujos de trabajo y deja que se encarguen de tus tareas de programación, investigación y documentación. 100% local y privado. Gratis para uso personal.',
  };

  const pageTitle = title || defaultTitles[locale] || defaultTitles.en;
  const pageDescription = description || defaultDescriptions[locale] || defaultDescriptions.en;
  const currentUrl = `${baseUrl}/${locale}${path}`;

  useEffect(() => {
    // Update title
    document.title = pageTitle;

    // Update meta tags
    updateMetaTag('description', pageDescription);
    updateMetaTag('og:title', pageTitle, 'property');
    updateMetaTag('og:description', pageDescription, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:locale', locale === 'es' ? 'es_ES' : 'en_US', 'property');
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', pageTitle, 'name');
    updateMetaTag('twitter:description', pageDescription, 'name');

    // Update canonical link
    updateCanonicalLink(currentUrl);

    // Update hreflang links
    updateHrefLangLinks(path);
  }, [pageTitle, pageDescription, currentUrl, locale, path]);

  return null;
}

function updateMetaTag(key: string, content: string, attribute: 'name' | 'property' = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

function updateHrefLangLinks(path: string) {
  const baseUrl = 'https://sciorex.com';

  // Remove existing hreflang links
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => link.remove());

  // Add new hreflang links
  const languages = ['en', 'es'];
  languages.forEach((lang) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = `${baseUrl}/${lang}${path}`;
    document.head.appendChild(link);
  });

  // Add x-default
  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = `${baseUrl}/en${path}`;
  document.head.appendChild(defaultLink);
}
