import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { REPO_URL, DISCORD_URL, TWITTER_URL } from '../config/urls';

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useParams<{ locale: string }>();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation('darkroom');
  const safeLocale = locale && ['en', 'es'].includes(locale) ? locale : 'en';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ---- Header ---- */}
      <header
        className="nav-blur"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 56,
          borderBottom: '1px solid var(--glass-border)',
        }}
      >
        <Link
          to={`/${safeLocale}/`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: 'var(--text-color)',
          }}
        >
          <img
            src="/logo.png"
            alt="Sciorex"
            style={{ width: 28, height: 28, borderRadius: 7 }}
          />
          <span
            style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            Sciorex
          </span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={t('themeToggle')}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: '1px solid var(--glass-border)',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            transition: 'all 0.3s ease',
          }}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* ---- Content ---- */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* ---- Footer ---- */}
      <footer
        style={{
          padding: '32px 24px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          borderTop: '1px solid var(--glass-border)',
        }}
      >
        {/* Page links */}
        <nav aria-label="Footer navigation" style={{ display: 'flex', gap: 24, fontSize: 13, letterSpacing: '0.02em' }}>
          {[
            { label: t('footer.blog'), to: `/${safeLocale}/blog` },
            { label: t('footer.features'), to: `/${safeLocale}/features` },
            { label: t('footer.about'), to: `/${safeLocale}/about` },
            { label: t('footer.privacy'), to: `/${safeLocale}/privacy` },
            { label: t('footer.terms'), to: `/${safeLocale}/terms` },
            { label: t('footer.contact'), to: `/${safeLocale}/contact` },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-color)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social links */}
        <div style={{ display: 'flex', gap: 24, fontSize: 12, letterSpacing: '0.02em' }}>
          {[
            { label: 'GitHub', href: REPO_URL },
            { label: 'Discord', href: DISCORD_URL },
            { label: 'Twitter', href: TWITTER_URL },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                opacity: 0.65,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.65'; }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p
          style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            opacity: 0.5,
            letterSpacing: '0.02em',
          }}
        >
          &copy; 2025-{new Date().getFullYear()} Sciorex
        </p>
      </footer>
    </div>
  );
}
