import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  faqItems?: Array<{ question: string; answer: string }>;
  article?: {
    datePublished: string;
    dateModified?: string;
  };
}

export default function SEO({ title, description, path = '', faqItems, article }: SEOProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language || 'en';
  const baseUrl = 'https://sciorex.com';

  const defaultTitles: Record<string, string> = {
    en: 'Sciorex - AI Research Platform & Vibe Kanban | LaTeX Editor, PDF Annotations | Free',
    es: 'Sciorex - Plataforma de Investigación IA y Vibe Kanban | Editor LaTeX, Anotaciones PDF | Gratis',
  };

  const defaultDescriptions: Record<string, string> = {
    en: 'Free AI-powered command center where AI agents do the heavy lifting. For developers, researchers, writers, students, teams, and more. LaTeX editor, PDF annotations, reference library, vibe kanban, 59 MCP tools. 100% local, no data collection.',
    es: 'Centro de mando de IA gratuito donde los agentes de IA hacen el trabajo pesado. Para desarrolladores, investigadores, escritores, estudiantes, equipos y más. Editor LaTeX, anotaciones PDF, biblioteca de referencias, vibe kanban, 59 herramientas MCP. 100% local, sin recopilación de datos.',
  };

  const pageTitle = title || defaultTitles[locale] || defaultTitles.en;
  const pageDescription = description || defaultDescriptions[locale] || defaultDescriptions.en;
  const currentUrl = `${baseUrl}/${locale}${path}`;
  const ogImage = `${baseUrl}/logo.png`;

  useEffect(() => {
    document.title = pageTitle;

    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', 'LaTeX editor, PDF annotations, reference library, paper discovery, research platform, academic writing, SyncTeX, BibTeX, citation management, Zotero alternative, Mendeley alternative, Overleaf alternative, vibe kanban, vibe coding, AI agent orchestration, Claude Code, Gemini CLI, parallel agents, git worktrees, Cursor alternative, Windsurf alternative, free research tools, PhD tools, academic software');
    updateMetaTag('og:title', pageTitle, 'property');
    updateMetaTag('og:description', pageDescription, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', article ? 'article' : 'website', 'property');
    updateMetaTag('og:locale', locale === 'es' ? 'es_ES' : 'en_US', 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:image:width', '512', 'property');
    updateMetaTag('og:image:height', '512', 'property');
    updateMetaTag('twitter:card', 'summary', 'name');
    updateMetaTag('twitter:site', '@sciorex', 'name');
    updateMetaTag('twitter:creator', '@sciorex', 'name');
    updateMetaTag('twitter:title', pageTitle, 'name');
    updateMetaTag('twitter:description', pageDescription, 'name');
    updateMetaTag('twitter:image', ogImage, 'name');

    if (article) {
      updateMetaTag('article:published_time', article.datePublished, 'property');
      if (article.dateModified) {
        updateMetaTag('article:modified_time', article.dateModified, 'property');
      }
      updateMetaTag('article:author', 'Sciorex', 'property');
    }

    updateCanonicalLink(currentUrl);
    updateHrefLangLinks(path);
    updateJsonLd(pageTitle, pageDescription, currentUrl, ogImage, locale, faqItems, article);
  }, [pageTitle, pageDescription, currentUrl, locale, path, ogImage, faqItems, article]);

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

function updateJsonLd(
  title: string,
  description: string,
  url: string,
  _image: string,
  locale: string,
  faqItems?: Array<{ question: string; answer: string }>,
  article?: { datePublished: string; dateModified?: string },
) {
  // Remove any dynamically-added JSON-LD (keep the static one from index.html
  // which already has Organization, SoftwareApplication, WebSite, HowTo, FAQPage)
  document.querySelectorAll('script[type="application/ld+json"][data-dynamic]').forEach((el) => el.remove());

  // Only emit page-specific schemas here. The static index.html @graph already
  // contains the product-level schemas (Organization, SoftwareApplication,
  // WebSite, HowTo, FAQPage). Duplicating them causes conflicting structured data.
  const graph: Record<string, unknown>[] = [];

  // Add FAQPage schema for landing pages with their own FAQ sections
  if (faqItems && faqItems.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  // Add BlogPosting schema for blog articles
  if (article) {
    graph.push({
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      url: url,
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      inLanguage: locale,
      author: {
        '@id': 'https://sciorex.com/#organization',
      },
      publisher: {
        '@id': 'https://sciorex.com/#organization',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
    });
  }

  // Only inject if we have page-specific schemas to add
  if (graph.length > 0) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': graph,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic', 'true');
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}
