import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

export default function NotFound() {
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation('darkroom');
  const safeLocale = locale && ['en', 'es'].includes(locale) ? locale : 'en';

  return (
    <>
      <SEO
        title={`${t('notFound.title')} - Sciorex`}
        description={t('notFound.description')}
        path="/404"
      />
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          textAlign: 'center',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden="true"
          style={{
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: 'clamp(80px, 15vw, 140px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: 'var(--text-color)',
            opacity: 0.08,
            userSelect: 'none',
          }}
        >
          404
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--text-color)',
            marginTop: -20,
            marginBottom: 12,
          }}
        >
          {t('notFound.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 15,
            color: 'var(--text-muted)',
            maxWidth: 400,
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          {t('notFound.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link
            to={`/${safeLocale}/`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              borderRadius: 10,
              border: '1px solid var(--accent-color)',
              background: 'var(--accent-color)',
              color: '#050505',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            {t('notFound.goHome')}
          </Link>
          <Link
            to={`/${safeLocale}/blog`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              borderRadius: 10,
              border: '1px solid var(--glass-border)',
              background: 'transparent',
              color: 'var(--text-color)',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-color)';
              e.currentTarget.style.color = 'var(--accent-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)';
              e.currentTarget.style.color = 'var(--text-color)';
            }}
          >
            {t('notFound.readBlog')}
          </Link>
        </motion.div>
      </div>
    </>
  );
}
