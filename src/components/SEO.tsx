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
    en: 'Sciorex - AI Research Platform & Vibe Kanban | LaTeX Editor, PDF Annotations | Free',
    es: 'Sciorex - Plataforma de Investigación IA y Vibe Kanban | Editor LaTeX, Anotaciones PDF | Gratis',
  };

  const defaultDescriptions: Record<string, string> = {
    en: 'Free AI-powered research platform with LaTeX editor, live PDF preview, annotations, reference library, and paper discovery. Plus vibe kanban for AI coding agents with Claude Code, Gemini CLI, parallel execution, and git worktrees. 100% local, no data collection.',
    es: 'Plataforma de investigación con IA gratuita con editor LaTeX, vista previa PDF en vivo, anotaciones, biblioteca de referencias y descubrimiento de artículos. Además vibe kanban para agentes de código IA con Claude Code, Gemini CLI, ejecución paralela y git worktrees. 100% local, sin recopilación de datos.',
  };

  const pageTitle = title || defaultTitles[locale] || defaultTitles.en;
  const pageDescription = description || defaultDescriptions[locale] || defaultDescriptions.en;
  const currentUrl = `${baseUrl}/${locale}${path}`;
  const ogImage = `${baseUrl}/og-image.png`;

  useEffect(() => {
    document.title = pageTitle;

    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', 'LaTeX editor, PDF annotations, reference library, paper discovery, research platform, academic writing, SyncTeX, BibTeX, citation management, Zotero alternative, Mendeley alternative, Overleaf alternative, vibe kanban, vibe coding, AI agent orchestration, Claude Code, Gemini CLI, parallel agents, git worktrees, Cursor alternative, Windsurf alternative, free research tools, PhD tools, academic software');
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
          width: 512,
          height: 512,
        },
        description: 'Sciorex is the original vibe kanban platform - the #1 free AI agent orchestration tool for vibe coding.',
        foundingDate: '2025',
        sameAs: [
          'https://www.youtube.com/@SciorexApp',
          'https://gitlab.com/sciorex',
          'https://x.com/sciorex',
          'https://discord.gg/zSjPjA5j',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: 'https://sciorex.com/contact',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://sciorex.com/#software',
        name: 'Sciorex',
        alternateName: ['Sciorex Vibe Kanban', 'Sciorex AI Agent Orchestrator'],
        description: 'Sciorex is the #1 free AI-powered research platform and vibe kanban tool. Features LaTeX editor with live PDF preview and SyncTeX, PDF annotations, reference library, paper discovery, plus AI agent orchestration with Claude Code, Gemini CLI, and parallel execution via git worktrees.',
        url: url,
        image: image,
        applicationCategory: 'DeveloperApplication',
        applicationSubCategory: 'AI Development Tools',
        operatingSystem: ['Windows 10+', 'macOS 11+', 'Linux'],
        softwareVersion: '1.0',
        releaseNotes: 'https://gitlab.com/sciorex/sciorex/-/releases',
        downloadUrl: 'https://sciorex.com/#download',
        installUrl: 'https://docs.sciorex.com/getting-started',
        screenshot: 'https://sciorex.com/screenshots/dark/kanban-view.png',
        softwareHelp: {
          '@type': 'CreativeWork',
          url: 'https://docs.sciorex.com',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          priceValidUntil: '2030-12-31',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '1',
          reviewCount: '1',
        },
        featureList: [
          'LaTeX Editor - Live PDF preview with bidirectional SyncTeX navigation',
          'PDF Annotations - Highlight, underline, margin notes with Markdown export',
          'Reference Library - Save papers, organize with collections and tags, export to BibTeX',
          'Paper Discovery - Find similar papers, explore citation networks',
          'Select & Ask AI - Select any text and ask AI to explain, improve, or translate',
          '30+ Professional Templates - NeurIPS, CVPR, Nature, PhD Thesis, Academic CV',
          'Vibe Kanban - Visual task management for AI coding agents',
          'Parallel Agent Execution - Run multiple AI agents with git worktrees',
          'Multi-CLI Support - Claude Code, Gemini CLI, OpenCode, Codex CLI, LM Studio, Ollama',
          'Visual Flow Editor - Node-based multi-agent workflow designer',
          '100% Local & Private - Zero data collection, no telemetry',
          'Free Forever - No subscriptions, no premium tiers',
        ],
        keywords: 'LaTeX editor, PDF annotations, reference library, research platform, Overleaf alternative, Zotero alternative, vibe kanban, AI agent orchestration, Claude Code, Gemini CLI, Cursor alternative, Windsurf alternative, academic writing, PhD tools',
        isAccessibleForFree: true,
        creator: {
          '@id': 'https://sciorex.com/#organization',
        },
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
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://docs.sciorex.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://sciorex.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is vibe kanban?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Vibe kanban is a workflow methodology where AI coding agents execute tasks in parallel while humans focus on planning, reviewing, and strategic oversight. Sciorex invented and is the original implementation of vibe kanban for software development.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Sciorex free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Sciorex is completely free for personal and professional use. There are no subscriptions, no premium tiers, and no hidden costs. It is free forever.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Sciorex private and local?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Sciorex is 100% local and private. Your code and data never leave your machine. There is zero data collection, no telemetry, and no third-party APIs.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the ralph loop?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The ralph loop (Ralph Wiggum loop) is an iterative AI development technique where agents continuously work on tasks with progress persisting in git history rather than context windows. Sciorex fully supports this methodology.',
            },
          },
          {
            '@type': 'Question',
            name: 'How is Sciorex different from Cursor or Windsurf?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Cursor and Windsurf are paid standalone IDEs ($15-20/month). Sciorex is a free wrapper that orchestrates your existing AI CLIs (Claude Code, Gemini CLI, etc.) with vibe kanban, parallel agents via git worktrees, and visual workflows. Sciorex is 100% local with no data collection.',
            },
          },
          {
            '@type': 'Question',
            name: 'What AI CLIs does Sciorex support?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sciorex supports Claude Code, Gemini CLI, OpenCode, Codex CLI, and local models via LM Studio and Ollama. You can use any AI provider and switch between them without losing your workflows.',
            },
          },
        ],
      },
      {
        '@type': 'Product',
        '@id': 'https://sciorex.com/#product',
        name: 'Sciorex',
        description: 'The #1 free vibe kanban platform for AI coding agents',
        brand: {
          '@id': 'https://sciorex.com/#organization',
        },
        category: 'Software > Developer Tools > AI Development',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '1',
        },
      },
      {
        '@type': 'HowTo',
        '@id': 'https://sciorex.com/#howto',
        name: 'How to use Sciorex for Vibe Coding',
        description: 'Get started with vibe kanban and AI agent orchestration in three simple steps',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Create Your Agents',
            text: 'Define specialized AI agents with custom prompts, tool permissions, and MCP configurations. Connect Claude Code, Gemini CLI, or local models.',
            position: 1,
          },
          {
            '@type': 'HowToStep',
            name: 'Design Your Workflow',
            text: 'Use the visual flow editor to connect agents with conditions, loops, and parallel execution. Each agent can work in its own git worktree.',
            position: 2,
          },
          {
            '@type': 'HowToStep',
            name: 'Track with Vibe Kanban',
            text: 'Organize work with the vibe kanban board. Track agent tasks, review code changes, and maintain full visibility over your AI-assisted development.',
            position: 3,
          },
        ],
      },
    ],
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
