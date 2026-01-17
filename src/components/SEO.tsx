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

  const defaultTitles: Record<string, string> = {
    en: 'Sciorex - Free AI Agent Wrapper | 100% Local & Private',
    es: 'Sciorex - Wrapper Gratuito para Agentes IA | 100% Local y Privado',
  };

  const defaultDescriptions: Record<string, string> = {
    en: 'Free, 100% local wrapper for Claude Code, Gemini CLI, OpenCode, Codex CLI, LM Studio, and Ollama. Visual workflows, ticket tracking, and multi-agent orchestration. No third-party APIs.',
    es: 'Wrapper gratuito y 100% local para Claude Code, Gemini CLI, OpenCode, Codex CLI, LM Studio y Ollama. Flujos visuales, seguimiento de tickets y orquestación multi-agente. Sin APIs de terceros.',
  };

  const pageTitle = title || defaultTitles[locale] || defaultTitles.en;
  const pageDescription = description || defaultDescriptions[locale] || defaultDescriptions.en;
  const currentUrl = `${baseUrl}/${locale}${path}`;
  const ogImage = `${baseUrl}/og-image.png`;

  useEffect(() => {
    document.title = pageTitle;

    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', 'AI agents, Claude Code, Gemini CLI, OpenCode, Codex CLI, LM Studio, Ollama, local AI, private AI, workflow automation, multi-agent, MCP, free');
    updateMetaTag('og:title', pageTitle, 'property');
    updateMetaTag('og:description', pageDescription, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:locale', locale === 'es' ? 'es_ES' : 'en_US', 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:image:width', '1200', 'property');
    updateMetaTag('og:image:height', '630', 'property');
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', pageTitle, 'name');
    updateMetaTag('twitter:description', pageDescription, 'name');
    updateMetaTag('twitter:image', ogImage, 'name');

    updateCanonicalLink(currentUrl);
    updateHrefLangLinks(path);
    updateJsonLd(pageTitle, pageDescription, currentUrl, ogImage);
  }, [pageTitle, pageDescription, currentUrl, locale, path, ogImage]);

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

  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => link.remove());

  const languages = ['en', 'es'];
  languages.forEach((lang) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = `${baseUrl}/${lang}${path}`;
    document.head.appendChild(link);
  });

  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = `${baseUrl}/en${path}`;
  document.head.appendChild(defaultLink);
}

function updateJsonLd(title: string, description: string, url: string, image: string) {
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sciorex.com/#organization',
        name: 'Sciorex',
        url: 'https://sciorex.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://sciorex.com/logo.png',
        },
        sameAs: [
          'https://www.youtube.com/@SciorexApp',
          'https://gitlab.com/sciorex',
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://sciorex.com/#software',
        name: 'Sciorex',
        description: description,
        url: url,
        image: image,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Windows, macOS, Linux',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          '100% Local & Private',
          'Multi-provider AI support (Claude, Gemini, OpenCode, Codex, LM Studio, Ollama)',
          'Visual Flow Editor',
          'Ticket & Kanban Management',
          'MCP Tool Protocol',
          'Git Worktree Integration',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://sciorex.com/#website',
        url: 'https://sciorex.com',
        name: title,
        description: description,
        publisher: {
          '@id': 'https://sciorex.com/#organization',
        },
        inLanguage: ['en', 'es'],
      },
    ],
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
