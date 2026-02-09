import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare, Workflow, LayoutDashboard, FileText,
  Highlighter, BookOpen, Search, Puzzle, ClipboardList, Shield,
  GitBranch, PanelLeftClose, Code2, Terminal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SEO from '../components/SEO';

const ICON_MAP: Record<string, LucideIcon> = {
  MessageSquare,
  Workflow,
  LayoutDashboard,
  FileText,
  Highlighter,
  BookOpen,
  Search,
  Puzzle,
  ClipboardList,
  Shield,
  GitBranch,
  PanelLeftClose,
  Code2,
  Terminal,
};

interface FeatureSection {
  icon: string;
  title: string;
  items: string[];
}

export default function FeaturesPage() {
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation('features');
  const safeLocale = locale && ['en', 'es'].includes(locale) ? locale : 'en';

  const sections = t('page.sections', { returnObjects: true }) as FeatureSection[];

  return (
    <>
      <SEO
        title={t('page.seo.title')}
        description={t('page.seo.description')}
        path="/features"
      />
      <div style={{ paddingTop: 80, paddingBottom: 64 }}>
        {/* Header */}
        <header style={{ textAlign: 'center', padding: '0 24px', marginBottom: 56 }}>
          <h1
            style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: 'clamp(32px, 5vw, 44px)',
              fontWeight: 700,
              color: 'var(--text-color)',
              letterSpacing: '0.02em',
              marginBottom: 12,
            }}
          >
            {t('page.title')}
          </h1>
          <p
            style={{
              fontSize: 16,
              color: 'var(--text-muted)',
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            {t('page.subtitle')}
          </p>
        </header>

        {/* Sections */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          {sections.map((section, idx) => {
            const Icon = ICON_MAP[section.icon] || Shield;
            return (
              <section
                key={idx}
                style={{
                  marginBottom: 48,
                  paddingBottom: 48,
                  borderBottom: idx < sections.length - 1 ? '1px solid var(--glass-border)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'var(--accent-color-alpha, rgba(196,155,60,0.1))',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: 20, height: 20, color: 'var(--accent-color)' }} />
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Outfit', system-ui, sans-serif",
                      fontSize: 22,
                      fontWeight: 600,
                      color: 'var(--text-color)',
                      letterSpacing: '0.01em',
                      margin: 0,
                    }}
                  >
                    {section.title}
                  </h2>
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {section.items.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: 'var(--text-muted)',
                        paddingLeft: 20,
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          color: 'var(--accent-color)',
                          fontSize: 14,
                        }}
                      >
                        &bull;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', padding: '0 24px', marginTop: 16 }}>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              marginBottom: 16,
            }}
          >
            {t('page.downloadCtaSubtitle')}
          </p>
          <Link
            to={`/${safeLocale}/#download`}
            style={{
              display: 'inline-block',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--accent-color)',
              textDecoration: 'none',
              padding: '10px 28px',
              borderRadius: 10,
              border: '1px solid var(--accent-color)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-color)';
              e.currentTarget.style.color = '#050505';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--accent-color)';
            }}
          >
            {t('page.downloadCta')} &darr;
          </Link>
        </div>
      </div>
    </>
  );
}
