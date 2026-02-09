import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Sun, Moon, MessageSquare, Zap, LayoutDashboard,
  FileText, Shield, Sparkles,
  Download as DownloadIcon, Monitor, Terminal,
  ChevronDown, ExternalLink, CheckCircle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { DOWNLOAD_BASE_URL, DOCS_URL, config } from '../config/urls';
import { getVersionJsonUrl } from '@sciorex/shared-config';
import SEO from '../components/SEO';

// ---------------------------------------------------------------------------
// Theme-aware color palettes
// ---------------------------------------------------------------------------

function getColors(theme: 'dark' | 'light') {
  if (theme === 'light') {
    return {
      bg: '#FAF9F6',
      title: '#1B2838',
      subtitle: '#5A6474',
      amber: '#C49B3C',
      iconStroke: '#8B6914',
      iconAccent: '#1B2838',
      cardBorder: 'rgba(0,0,0,0.08)',
      cardBorderHover: 'rgba(0,0,0,0.16)',
      cardBg: 'rgba(0,0,0,0.02)',
      iconBoxBg: 'rgba(0,0,0,0.04)',
      iconBoxBorder: 'rgba(0,0,0,0.06)',
      orColor: 'rgba(0,0,0,0.35)',
      skipColor: '#5A6474',
      hintColor: '#5A6474',
      spotlightColor: 'rgba(0,0,0,0.02)',
      vignetteColor: 'rgba(255,255,255,0.4)',
      titleShadow: '0 0 40px rgba(27,40,56,0.08), 0 0 80px rgba(27,40,56,0.04)',
      logoFilter: 'drop-shadow(0 0 40px rgba(0,0,0,0.08)) drop-shadow(0 0 80px rgba(0,0,0,0.04))',
      researcherHover: 'linear-gradient(170deg, rgba(196,155,60,0.06) 0%, rgba(220,53,69,0.03) 100%)',
      developerHover: 'linear-gradient(170deg, rgba(196,155,60,0.06) 0%, rgba(92,124,250,0.05) 100%)',
      featureIconBg: 'rgba(196,155,60,0.08)',
      featureIconBorder: 'rgba(196,155,60,0.12)',
    };
  }
  return {
    bg: '#050505',
    title: '#FFFEF5',
    subtitle: '#C0C0C0',
    amber: '#F5E6CC',
    iconStroke: '#F5E6CC',
    iconAccent: '#FFFEF5',
    cardBorder: 'rgba(255,255,254,0.06)',
    cardBorderHover: 'rgba(255,255,254,0.14)',
    cardBg: 'rgba(255,255,254,0.02)',
    iconBoxBg: 'rgba(245,230,204,0.05)',
    iconBoxBorder: 'rgba(245,230,204,0.08)',
    orColor: 'rgba(255,255,254,0.35)',
    skipColor: '#C0C0C0',
    hintColor: '#C0C0C0',
    spotlightColor: 'rgba(245,230,204,0.03)',
    vignetteColor: 'rgba(0,0,0,0.6)',
    titleShadow: '0 0 40px rgba(245,230,204,0.25), 0 0 80px rgba(245,230,204,0.1)',
    logoFilter: 'brightness(1.15) drop-shadow(0 0 40px rgba(245,230,204,0.25)) drop-shadow(0 0 80px rgba(245,230,204,0.1))',
    researcherHover: 'linear-gradient(170deg, rgba(245,230,204,0.04) 0%, rgba(139,0,0,0.03) 100%)',
    developerHover: 'linear-gradient(170deg, rgba(245,230,204,0.04) 0%, rgba(92,124,250,0.04) 100%)',
    featureIconBg: 'rgba(245,230,204,0.06)',
    featureIconBorder: 'rgba(245,230,204,0.10)',
  };
}

const TITLE_LETTERS = 'SCIOREX'.split('');

// Timing gates (seconds) for the animation phases
const PHASE = {
  logoStart: 0.3,
  titleStart: 1.0,
  letterStagger: 0.1,
  subtitleStart: 2.0,
  lineStart: 2.8,
  cardsStart: 3.8,
  hintStart: 5.2,
} as const;

// ---------------------------------------------------------------------------
// Features overview data
// ---------------------------------------------------------------------------

const FEATURE_ICONS = [MessageSquare, Zap, LayoutDashboard, FileText, Shield, Sparkles];

// ---------------------------------------------------------------------------
// SVG Icons (theme-aware)
// ---------------------------------------------------------------------------

function ResearcherIcon({ colors }: { colors: ReturnType<typeof getColors> }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 10C20 10 15 7 8 7C6 7 4 7.5 4 7.5V30.5C4 30.5 6 30 8 30C15 30 20 33 20 33"
        stroke={colors.iconStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 10C20 10 25 7 32 7C34 7 36 7.5 36 7.5V30.5C36 30.5 34 30 32 30C25 30 20 33 20 33"
        stroke={colors.iconStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="29"
        cy="17"
        r="5"
        stroke={colors.iconAccent}
        strokeWidth="1.5"
        opacity="0.7"
      />
      <line
        x1="33"
        y1="21"
        x2="36"
        y2="24"
        stroke={colors.iconAccent}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function DeveloperIcon({ colors }: { colors: ReturnType<typeof getColors> }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 12L6 20L12 28"
        stroke={colors.iconStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 12L34 20L28 28"
        stroke={colors.iconStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="23"
        y1="10"
        x2="17"
        y2="30"
        stroke={colors.iconAccent}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CursorSpotlight({
  mouseX,
  mouseY,
  color,
}: {
  mouseX: number;
  mouseY: number;
  color: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 1,
        background: `radial-gradient(200px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 80%)`,
      }}
    />
  );
}

function Vignette({ color }: { color: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 1,
        background: `radial-gradient(ellipse at center, transparent 50%, ${color} 100%)`,
      }}
    />
  );
}

function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 1,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Choice Card
// ---------------------------------------------------------------------------

interface ChoiceCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  hoverGradient: string;
  onClick: () => void;
  delay: number;
  colors: ReturnType<typeof getColors>;
}

function ChoiceCard({
  icon,
  title,
  subtitle,
  hoverGradient,
  onClick,
  delay,
  colors,
}: ChoiceCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center justify-center gap-6 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
      style={{
        width: '100%',
        maxWidth: 340,
        minHeight: 300,
        borderRadius: 18,
        border: `1px solid ${hovered ? colors.cardBorderHover : colors.cardBorder}`,
        background: hovered ? hoverGradient : colors.cardBg,
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 0.6s ease',
        padding: '44px 36px',
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          background: colors.iconBoxBg,
          border: `1px solid ${colors.iconBoxBorder}`,
        }}
      >
        {icon}
      </div>

      <span
        style={{
          fontFamily: "'Outfit', system-ui, sans-serif",
          fontSize: 24,
          fontWeight: 600,
          color: colors.title,
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </span>

      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 15,
          fontWeight: 400,
          lineHeight: 1.65,
          color: colors.subtitle,
          textAlign: 'center',
          maxWidth: 260,
        }}
      >
        {subtitle}
      </span>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function DarkroomEntry() {
  const { locale } = useParams<{ locale: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const colors = getColors(theme);
  const { t, i18n } = useTranslation(['darkroom', 'common']);
  const location = useLocation();
  const features = t('darkroom:features', { returnObjects: true }) as Array<{ title: string; desc: string }>;

  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const rafRef = useRef(0);
  const [version, setVersion] = useState<string>('');
  const [macNoticeOpen, setMacNoticeOpen] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, clientY } = e;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({ x: clientX, y: clientY });
      });
    },
    [],
  );

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch(getVersionJsonUrl(config));
        if (response.ok) {
          const data = await response.json();
          const ver = data.data?.version || data.version;
          if (ver) setVersion(ver);
        }
      } catch {
        // Silently fail
      }
    };
    fetchVersion();
  }, []);

  const safeLocale = locale && ['en', 'es'].includes(locale) ? locale : 'en';

  const switchLocale = (code: string) => {
    if (code !== safeLocale) {
      i18n.changeLanguage(code);
      const rest = location.pathname.split('/').filter(Boolean).slice(1).join('/');
      navigate(`/${code}/${rest}${location.hash}`);
    }
  };

  const goResearcher = useCallback(
    () => navigate(`/${safeLocale}/researcher`),
    [navigate, safeLocale],
  );
  const goDeveloper = useCallback(
    () => navigate(`/${safeLocale}/developer`),
    [navigate, safeLocale],
  );
  const scrollToFeatures = useCallback(() => {
    document.getElementById('features-overview')?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  const scrollToDownload = useCallback(() => {
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <SEO title={t('seo.title')} description={t('seo.description')} path="/" />
      <div
        onMouseMove={handleMouseMove}
        className="relative select-none"
        style={{
        width: '100vw',
        overflowX: 'hidden',
        backgroundColor: colors.bg,
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: 'background-color 0.6s ease',
      }}
    >
      {/* ---------- Overlays ---------- */}
      <CursorSpotlight mouseX={mousePos.x} mouseY={mousePos.y} color={colors.spotlightColor} />
      <Vignette color={colors.vignetteColor} />
      <FilmGrain />

      {/* ---------- Language + Theme Toggle ---------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: PHASE.cardsStart + 0.4 }}
        className="fixed top-6 right-6 z-20"
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 12,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            padding: '4px 6px',
            transition: 'all 0.4s ease',
          }}
        >
          {(['en', 'es'] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => switchLocale(code)}
              className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                fontSize: 12,
                fontWeight: safeLocale === code ? 700 : 400,
                color: safeLocale === code ? colors.amber : colors.subtitle,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
              aria-label={code === 'en' ? 'English' : 'Español'}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.4s ease',
            color: colors.subtitle,
          }}
          aria-label={t('themeToggle')}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={scrollToDownload}
          className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.4s ease',
            color: colors.subtitle,
          }}
          aria-label={t('common:download.title')}
        >
          <DownloadIcon className="w-4 h-4" />
        </button>
      </motion.div>

      {/* ================================================================= */}
      {/* HERO SECTION — first viewport                                     */}
      {/* ================================================================= */}
      <div
        className="relative z-10 flex flex-col items-center justify-center"
        style={{ minHeight: '100vh', padding: '60px 24px 40px' }}
      >
        <div
          className="flex flex-col items-center justify-center gap-0"
          style={{ maxWidth: 900 }}
        >
          {/* ---- Logo ---- */}
          <motion.img
            src="/logo.png"
            alt=""
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{
              duration: 1.2,
              delay: PHASE.logoStart,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              marginBottom: 32,
              filter: colors.logoFilter,
            }}
          />

          {/* ---- Phase 1: Title ---- */}
          <h1 className="flex items-center justify-center" aria-label="Sciorex">
            {TITLE_LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: PHASE.titleStart + i * PHASE.letterStagger,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  fontSize: 'clamp(56px, 10vw, 96px)',
                  fontWeight: 700,
                  color: colors.title,
                  letterSpacing: '0.06em',
                  textShadow: colors.titleShadow,
                  display: 'inline-block',
                  transition: 'color 0.6s ease, text-shadow 0.6s ease',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          {/* ---- Phase 2: Subtitle ---- */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: PHASE.subtitleStart,
              ease: 'easeOut',
            }}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 300,
              color: colors.subtitle,
              marginTop: 12,
              letterSpacing: '0.02em',
              transition: 'color 0.6s ease',
            }}
          >
            {t('subtitle')}
          </motion.p>

          {/* ---- Phase 3: Horizontal Line ---- */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.8,
              delay: PHASE.lineStart,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              width: 200,
              height: 1,
              backgroundColor: colors.amber,
              opacity: 0.35,
              marginTop: 32,
              marginBottom: 48,
              transformOrigin: 'center',
            }}
          />

          {/* ---- Phase 4: Choice Cards ---- */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <ChoiceCard
              icon={<ResearcherIcon colors={colors} />}
              title={t('researcher.title')}
              subtitle={t('researcher.subtitle')}
              hoverGradient={colors.researcherHover}
              onClick={goResearcher}
              delay={PHASE.cardsStart}
              colors={colors}
            />

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: PHASE.cardsStart + 0.3 }}
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 400,
                color: colors.orColor,
                letterSpacing: '0.08em',
                textTransform: 'lowercase' as const,
                userSelect: 'none',
              }}
            >
              {t('or')}
            </motion.span>

            <ChoiceCard
              icon={<DeveloperIcon colors={colors} />}
              title={t('developer.title')}
              subtitle={t('developer.subtitle')}
              hoverGradient={colors.developerHover}
              onClick={goDeveloper}
              delay={PHASE.cardsStart + 0.2}
              colors={colors}
            />
          </div>

          {/* ---- View all features link ---- */}
          <motion.button
            type="button"
            onClick={scrollToFeatures}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: PHASE.cardsStart + 0.6 }}
            className="mt-10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 bg-transparent border-none"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: colors.skipColor,
              opacity: 0.55,
              letterSpacing: '0.02em',
              transition: 'opacity 0.4s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.55';
            }}
          >
            {t('viewAllFeatures')}&nbsp;&darr;
          </motion.button>

          {/* ---- Phase 5: Scroll hint ---- */}
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{
              duration: 3,
              delay: PHASE.hintStart,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              marginTop: 48,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 300,
              color: colors.hintColor,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              whiteSpace: 'nowrap',
            }}
          >
            {t('chooseYourPath')}
          </motion.span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* FEATURES OVERVIEW — below the fold                                */}
      {/* ================================================================= */}
      <section
        id="features-overview"
        className="relative z-10"
        style={{ padding: '80px 24px 60px', maxWidth: 960, margin: '0 auto' }}
      >
        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            width: 120,
            height: 1,
            backgroundColor: colors.amber,
            opacity: 0.25,
            margin: '0 auto 48px',
            transformOrigin: 'center',
          }}
        />

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2
            style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 700,
              color: colors.title,
              letterSpacing: '0.02em',
              marginBottom: 16,
            }}
          >
            {t('featuresTitle')}
          </h2>
          <p
            style={{
              fontSize: 16,
              fontWeight: 300,
              color: colors.subtitle,
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            {t('featuresSubtitle')}
          </p>
        </motion.div>

        {/* Feature grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 56,
          }}
        >
          {features.map((feat, i) => {
            const FeatureIcon = FEATURE_ICONS[i];
            return (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                padding: '28px 24px',
                borderRadius: 14,
                border: `1px solid ${colors.cardBorder}`,
                background: colors.cardBg,
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = colors.cardBorderHover;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = colors.cardBorder;
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 11,
                  background: colors.featureIconBg,
                  border: `1px solid ${colors.featureIconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <FeatureIcon
                  style={{ width: 20, height: 20, color: colors.amber }}
                />
              </div>

              <h3
                style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  fontSize: 17,
                  fontWeight: 600,
                  color: colors.title,
                  marginBottom: 8,
                  letterSpacing: '0.01em',
                }}
              >
                {feat.title}
              </h3>

              <p
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: colors.subtitle,
                  lineHeight: 1.6,
                }}
              >
                {feat.desc}
              </p>
            </motion.div>
            );
          })}
        </div>

        {/* See all features link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <Link
            to={`/${safeLocale}/features`}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 400,
              color: colors.amber,
              textDecoration: 'none',
              letterSpacing: '0.02em',
              opacity: 0.75,
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75'; }}
          >
            {t('viewAllFeatures')} &rarr;
          </Link>
        </motion.div>

        {/* Audience CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: colors.subtitle,
              opacity: 0.7,
              letterSpacing: '0.02em',
            }}
          >
            {t('diveDeeper')}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={goResearcher}
              className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
              style={{
                padding: '10px 28px',
                borderRadius: 10,
                border: `1px solid ${colors.cardBorder}`,
                background: 'transparent',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: colors.title,
                transition: 'all 0.3s ease',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = colors.amber;
                (e.currentTarget as HTMLButtonElement).style.color = colors.amber;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = colors.cardBorder;
                (e.currentTarget as HTMLButtonElement).style.color = colors.title;
              }}
            >
              {t('exploreResearchers')}
            </button>
            <button
              type="button"
              onClick={goDeveloper}
              className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
              style={{
                padding: '10px 28px',
                borderRadius: 10,
                border: `1px solid ${colors.cardBorder}`,
                background: 'transparent',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: colors.title,
                transition: 'all 0.3s ease',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = colors.amber;
                (e.currentTarget as HTMLButtonElement).style.color = colors.amber;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = colors.cardBorder;
                (e.currentTarget as HTMLButtonElement).style.color = colors.title;
              }}
            >
              {t('exploreDevelopers')}
            </button>
          </div>
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* DOWNLOAD SECTION                                                   */}
      {/* ================================================================= */}
      <section
        id="download"
        className="relative z-10"
        style={{ padding: '60px 24px 80px', maxWidth: 960, margin: '0 auto' }}
      >
        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            width: 120,
            height: 1,
            backgroundColor: colors.amber,
            opacity: 0.25,
            margin: '0 auto 48px',
            transformOrigin: 'center',
          }}
        />

        {/* Heading + Version */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2
            style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 700,
              color: colors.title,
              letterSpacing: '0.02em',
              marginBottom: 12,
            }}
          >
            {t('common:download.title')} {t('common:download.titleHighlight')}
            {version && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: colors.amber,
                  marginLeft: 12,
                  verticalAlign: 'middle',
                  padding: '2px 10px',
                  borderRadius: 6,
                  border: `1px solid ${colors.cardBorder}`,
                  background: colors.cardBg,
                }}
              >
                v{version}
              </span>
            )}
          </h2>
          <p
            style={{
              fontSize: 16,
              fontWeight: 300,
              color: colors.subtitle,
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            {t('common:download.subtitle')}
          </p>
        </motion.div>

        {/* OS Download Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 32,
          }}
        >
          {[
            {
              os: t('common:download.windows'),
              icon: Monitor,
              options: [
                { name: t('common:download.installer'), desc: t('common:download.recommended'), file: 'Sciorex-win-x64.exe', url: `${DOWNLOAD_BASE_URL}/Sciorex-win-x64.exe` },
                { name: t('common:download.portable'), desc: t('common:download.noInstall'), file: 'Sciorex-portable.exe', url: `${DOWNLOAD_BASE_URL}/Sciorex-portable.exe` },
              ],
            },
            {
              os: t('common:download.mac'),
              icon: Terminal,
              options: [
                { name: t('common:download.appleSilicon'), desc: t('common:download.m1m2m3'), file: 'Sciorex-mac-arm64.dmg', url: `${DOWNLOAD_BASE_URL}/Sciorex-mac-arm64.dmg` },
                { name: t('common:download.intel'), desc: t('common:download.intelMacs'), file: 'Sciorex-mac-x64.dmg', url: `${DOWNLOAD_BASE_URL}/Sciorex-mac-x64.dmg` },
              ],
            },
            {
              os: t('common:download.linux'),
              icon: Terminal,
              options: [
                { name: t('common:download.appImage'), desc: t('common:download.universal'), file: 'Sciorex-linux-x86_64.AppImage', url: `${DOWNLOAD_BASE_URL}/Sciorex-linux-x86_64.AppImage` },
                { name: t('common:download.debian'), desc: t('common:download.aptCompatible'), file: 'Sciorex-linux-amd64.deb', url: `${DOWNLOAD_BASE_URL}/Sciorex-linux-amd64.deb` },
                { name: t('common:download.fedora'), desc: t('common:download.dnfCompatible'), file: 'Sciorex-linux-x86_64.rpm', url: `${DOWNLOAD_BASE_URL}/Sciorex-linux-x86_64.rpm` },
              ],
            },
          ].map((group) => (
            <div
              key={group.os}
              style={{
                borderRadius: 14,
                border: `1px solid ${colors.cardBorder}`,
                background: colors.cardBg,
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = colors.cardBorderHover; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = colors.cardBorder; }}
            >
              {/* OS Header */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: `1px solid ${colors.cardBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <group.icon style={{ width: 18, height: 18, color: colors.amber }} />
                <span
                  style={{
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    color: colors.title,
                  }}
                >
                  {group.os}
                </span>
                {version && (
                  <span style={{ fontSize: 11, color: colors.subtitle, opacity: 0.6 }}>
                    v{version}
                  </span>
                )}
              </div>

              {/* Download Options */}
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.options.map((opt) => (
                  <a
                    key={opt.name}
                    href={opt.url}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: `1px solid ${colors.cardBorder}`,
                      background: 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = colors.amber;
                      (e.currentTarget as HTMLAnchorElement).style.background = colors.featureIconBg;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = colors.cardBorder;
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <DownloadIcon style={{ width: 14, height: 14, color: colors.amber }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: colors.title }}>{opt.name}</div>
                        <div style={{ fontSize: 11, color: colors.subtitle, opacity: 0.7 }}>{opt.desc}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: colors.subtitle, opacity: 0.5, fontFamily: 'monospace' }}>
                      {opt.file}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 32,
          }}
        >
          {[
            t('common:download.features.free'),
            t('common:download.features.allFeatures'),
            t('common:download.features.noAccount'),
            t('common:download.features.localPrivate'),
          ].map((badge) => (
            <span
              key={badge}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: colors.subtitle,
              }}
            >
              <CheckCircle style={{ width: 14, height: 14, color: colors.amber }} />
              {badge}
            </span>
          ))}
        </motion.div>

        {/* macOS Notice (collapsible) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            marginBottom: 32,
            borderRadius: 12,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.cardBg,
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            onClick={() => setMacNoticeOpen(!macNoticeOpen)}
            className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: colors.amber,
              transition: 'opacity 0.3s ease',
            }}
          >
            <ChevronDown
              style={{
                width: 14,
                height: 14,
                transform: macNoticeOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
            {t('common:download.macNotice.title')}
          </button>
          {macNoticeOpen && (
            <div
              style={{
                padding: '0 16px 16px',
                fontSize: 13,
                lineHeight: 1.65,
                color: colors.subtitle,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <p style={{ margin: 0 }}>{t('common:download.macNotice.description')}</p>
              <code
                style={{
                  display: 'block',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: colors.featureIconBg,
                  fontSize: 12,
                  fontFamily: 'monospace',
                  color: colors.amber,
                  userSelect: 'all',
                }}
              >
                {t('common:download.macNotice.command')}
              </code>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>{t('common:download.macNotice.alternative')}</p>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>{t('common:download.macNotice.sequoia')}</p>
              <a
                href={t('common:download.macNotice.whyUrl')}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  color: colors.amber,
                  textDecoration: 'none',
                  opacity: 0.8,
                }}
              >
                {t('common:download.macNotice.whyLink')}
                <ExternalLink style={{ width: 11, height: 11 }} />
              </a>
            </div>
          )}
        </motion.div>

        {/* Setup Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontSize: 13, color: colors.subtitle, opacity: 0.7 }}>
            {t('common:download.requirements')}{' '}
            <a
              href={`${DOCS_URL}/guide/getting-started`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.amber, textDecoration: 'none' }}
            >
              {t('common:download.setupGuide')} &rarr;
            </a>
          </p>
        </motion.div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer
        className="relative z-10 flex flex-wrap items-center justify-center gap-6 pb-6 pt-8"
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: '0.02em',
        }}
      >
        {[
          { label: t('footer.blog'), to: `/${safeLocale}/blog` },
          { label: t('footer.features'), to: `/${safeLocale}/features` },
          { label: t('footer.docs'), to: `/${safeLocale}/docs`, external: true },
          { label: t('footer.contact'), to: `/${safeLocale}/contact` },
          { label: t('footer.about'), to: `/${safeLocale}/about` },
          { label: t('footer.privacy'), to: `/${safeLocale}/privacy` },
          { label: t('footer.terms'), to: `/${safeLocale}/terms` },
        ].map((link) => (
          'external' in link ? (
            <a
              key={link.label}
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: colors.subtitle,
                textDecoration: 'none',
                opacity: 0.45,
                transition: 'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.45'; }}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              to={link.to}
              style={{
                color: colors.subtitle,
                textDecoration: 'none',
                opacity: 0.45,
                transition: 'opacity 0.3s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.45'; }}
            >
              {link.label}
            </Link>
          )
        ))}
      </footer>
    </div>
    </>
  );
}
