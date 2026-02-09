import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, ChevronLeft, ChevronRight, AlertTriangle, ExternalLink } from 'lucide-react';
import ThemeImage from '../components/ThemeImage';
import Lightbox from '../components/Lightbox';
import SEO from '../components/SEO';
import { useTheme } from '../context/ThemeContext';
import { DOWNLOAD_BASE_URL, REPO_URL, DISCORD_URL, TWITTER_URL, DOCS_URL, config } from '../config/urls';
import { useGitHubMigration } from '../context/GitHubMigrationContext';
import { getVersionJsonUrl } from '@sciorex/shared-config';

// ---------------------------------------------------------------------------
// Design tokens scoped to this page
// ---------------------------------------------------------------------------
function getColors(theme: 'dark' | 'light') {
  if (theme === 'dark') {
    return {
      bg: '#1A1A1F',
      text: '#E8E5DF',
      muted: '#9B9690',
      crimson: '#EF6B6B',
      gold: '#D4A84B',
      figureBorder: '#2E2D2B',
      navBg: 'rgba(26,26,31,0.92)',
      cardBg: '#222226',
      codeBg: '#2A2A30',
      sectionBg: 'rgba(26,26,31,0.5)',
    } as const;
  }
  return {
    bg: '#FAF9F6',
    text: '#1B2838',
    muted: '#4A5568',
    crimson: '#DC3545',
    gold: '#C49B3C',
    figureBorder: '#E2DDD5',
    navBg: 'rgba(250,249,246,0.92)',
    cardBg: '#fff',
    codeBg: '#f4f1eb',
    sectionBg: 'rgba(250,249,246,0.5)',
  } as const;
}

type Colors = ReturnType<typeof getColors>;

const FONTS = {
  serif: "'Crimson Pro', Georgia, serif",
  sans: "'Source Sans 3', Inter, sans-serif",
  mono: "'Fira Code', monospace",
} as const;

// ---------------------------------------------------------------------------
// Scroll helper — smooth scroll + delayed correction for layout shifts
// caused by lazy-loaded images that expand after the initial scroll.
// ---------------------------------------------------------------------------
function scrollToSection(id: string, e?: React.MouseEvent) {
  e?.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // After the smooth scroll finishes, correct for any layout shift
  const correct = () => el.scrollIntoView({ behavior: 'auto', block: 'start' });
  setTimeout(correct, 600);
  setTimeout(correct, 1200);
}

// ---------------------------------------------------------------------------
// Section metadata used by ToC + IntersectionObserver
// ---------------------------------------------------------------------------
interface SectionMeta {
  id: string;
  number: string;
  title: string;
  label: string;
}



// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Reusable academic figure with ThemeImage, border, caption, fade-in. */
function Figure({
  number,
  src,
  caption,
  colors,
  onImageClick,
  prefix,
}: {
  number: number;
  src: string;
  caption: string;
  colors: Colors;
  onImageClick?: (src: string, alt: string) => void;
  prefix?: string;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        border: `1px solid ${colors.figureBorder}`,
        padding: 4,
        margin: '2rem 0 2.5rem',
        background: colors.cardBg,
      }}
    >
      <div
        onClick={() => onImageClick?.(src, caption)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onImageClick?.(src, caption); } }}
        tabIndex={0}
        role="button"
        aria-label="Enlarge image"
        style={{ cursor: onImageClick ? 'zoom-in' : 'default', position: 'relative' }}
      >
        <ThemeImage
          name={src}
          alt={caption}
          className="w-full block"
        />
      </div>
      <figcaption
        style={{
          fontFamily: FONTS.sans,
          fontSize: '0.85rem',
          color: colors.muted,
          fontStyle: 'italic',
          padding: '0.6rem 0.5rem 0.3rem',
          lineHeight: 1.55,
        }}
      >
        <span style={{ fontWeight: 600, fontStyle: 'normal' }}>
          {prefix}&nbsp;{number}:
        </span>{' '}
        {caption}
      </figcaption>
    </motion.figure>
  );
}

/** Multi-image figure that rotates between screenshots on a timer.
 *  Pauses rotation when off-screen and locks height to prevent layout shift. */
function FigureRotator({
  number,
  images,
  caption,
  colors,
  interval = 4000,
  onImageClick,
  prefix,
}: {
  number: number;
  images: { src: string; label: string }[];
  caption: string;
  colors: Colors;
  interval?: number;
  onImageClick?: (src: string, alt: string) => void;
  prefix?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const visibleRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageAreaRef = useRef<HTMLDivElement>(null);

  // Track max image height to prevent layout shift
  const onImageLoad = useCallback(() => {
    if (imageAreaRef.current) {
      const h = imageAreaRef.current.scrollHeight;
      setMaxHeight((prev) => Math.max(prev, h));
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!visibleRef.current) return;
    timerRef.current = setInterval(() => {
      setIdx((prev) => (prev + 1) % images.length);
    }, interval);
  }, [images.length, interval]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // IntersectionObserver — only rotate when in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) startTimer();
        else stopTimer();
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => { obs.disconnect(); stopTimer(); };
  }, [startTimer, stopTimer]);

  const goTo = (dir: -1 | 1) => {
    setIdx((prev) => (prev + dir + images.length) % images.length);
    startTimer();
  };

  return (
    <motion.figure
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        border: `1px solid ${colors.figureBorder}`,
        padding: 4,
        margin: '2rem 0 2.5rem',
        background: colors.cardBg,
      }}
    >
      {/* Image tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        borderBottom: `1px solid ${colors.figureBorder}`,
        fontFamily: FONTS.mono,
        fontSize: '0.72rem',
        overflowX: 'auto',
      }}>
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => { setIdx(i); startTimer(); }}
            style={{
              padding: '0.45rem 0.8rem',
              background: i === idx
                ? (colors.bg === '#FAF9F6' ? '#FAF9F6' : '#1A1A1F')
                : 'transparent',
              color: i === idx ? colors.crimson : colors.muted,
              fontWeight: i === idx ? 600 : 400,
              border: 'none',
              borderRight: `1px solid ${colors.figureBorder}`,
              cursor: 'pointer',
              fontFamily: FONTS.mono,
              fontSize: '0.72rem',
              letterSpacing: '0.02em',
              transition: 'color 0.2s, background 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {img.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => goTo(-1)} style={{ background: 'none', border: 'none', color: colors.muted, cursor: 'pointer', padding: '0.35rem' }} aria-label="Previous">
          <ChevronLeft size={14} />
        </button>
        <button onClick={() => goTo(1)} style={{ background: 'none', border: 'none', color: colors.muted, cursor: 'pointer', padding: '0.35rem' }} aria-label="Next">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Image area — locked height prevents layout shift */}
      <div
        ref={imageAreaRef}
        onClick={() => onImageClick?.(images[idx].src, caption)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onImageClick?.(images[idx].src, caption); } }}
        tabIndex={0}
        role="button"
        aria-label="Enlarge image"
        style={{
          cursor: onImageClick ? 'zoom-in' : 'default',
          position: 'relative',
          overflow: 'hidden',
          minHeight: maxHeight > 0 ? maxHeight : undefined,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={images[idx].src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ThemeImage
              name={images[idx].src}
              alt={`${caption} — ${images[idx].label}`}
              className="w-full block"
              onLoad={onImageLoad}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <figcaption
        style={{
          fontFamily: FONTS.sans,
          fontSize: '0.85rem',
          color: colors.muted,
          fontStyle: 'italic',
          padding: '0.6rem 0.5rem 0.3rem',
          lineHeight: 1.55,
        }}
      >
        <span style={{ fontWeight: 600, fontStyle: 'normal' }}>
          {prefix}&nbsp;{number}:
        </span>{' '}
        {caption}
      </figcaption>
    </motion.figure>
  );
}

/** Section heading styled as a numbered academic section header. */
function SectionHeader({
  number,
  title,
  id,
  colors,
}: {
  number: string;
  title: string;
  id?: string;
  colors: Colors;
}) {
  return (
    <motion.h2
      id={id}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      style={{
        fontFamily: FONTS.serif,
        fontSize: '1.65rem',
        fontWeight: 700,
        color: colors.text,
        borderBottom: `1px solid ${colors.figureBorder}`,
        paddingBottom: '0.45rem',
        marginTop: '3.5rem',
        marginBottom: '1.25rem',
        scrollMarginTop: '100px',
      }}
    >
      <span style={{ color: colors.gold, marginRight: '0.55rem' }}>
        &sect;{number}
      </span>
      {title}
    </motion.h2>
  );
}

/** Sub-section heading (e.g. 2.1, 2.2). */
function SubSectionHeader({
  number,
  title,
  colors,
}: {
  number: string;
  title: string;
  colors: Colors;
}) {
  return (
    <motion.h3
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      style={{
        fontFamily: FONTS.serif,
        fontSize: '1.25rem',
        fontWeight: 600,
        color: colors.text,
        marginTop: '2.5rem',
        marginBottom: '0.75rem',
      }}
    >
      <span style={{ color: colors.gold, marginRight: '0.45rem' }}>
        &sect;{number}
      </span>
      {title}
    </motion.h3>
  );
}

/** Inline citation link styled in crimson, jumps to References. */
function Cite({ n, colors, referenceLabel }: { n: number; colors: Colors; referenceLabel?: string }) {
  return (
    <a
      href="#sec-references"
      onClick={(e) => scrollToSection('sec-references', e)}
      style={{
        color: colors.crimson,
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '0.88em',
        cursor: 'pointer',
      }}
      aria-label={`${referenceLabel ?? 'Reference'} ${n}`}
    >
      [{n}]
    </a>
  );
}

/** Body paragraph with academic styling. */
function P({ children, colors }: { children: React.ReactNode; colors: Colors }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      style={{
        fontFamily: FONTS.sans,
        fontSize: '1.05rem',
        lineHeight: 1.78,
        color: colors.text,
        marginBottom: '1.15rem',
        textAlign: 'justify',
        hyphens: 'auto',
      }}
    >
      {children}
    </motion.p>
  );
}

/** MCP tool capability card — compact, monospace styled. */
function ToolCard({
  server,
  tools,
  colors,
}: {
  server: string;
  tools: string[];
  colors: Colors;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      style={{
        background: colors.codeBg,
        border: `1px solid ${colors.figureBorder}`,
        padding: '1rem 1.2rem',
        fontFamily: FONTS.mono,
        fontSize: '0.82rem',
        lineHeight: 1.7,
      }}
    >
      <div style={{ color: colors.gold, fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.78rem', letterSpacing: '0.06em' }}>
        {server}
      </div>
      {tools.map((t) => (
        <div key={t} style={{ color: colors.text }}>
          <span style={{ color: colors.crimson }}>&#x25B8;</span>{' '}
          <span style={{ color: colors.muted }}>{t.split(' — ')[0]}</span>
          {t.includes(' — ') && <span> — {t.split(' — ')[1]}</span>}
        </div>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Table of Contents (sticky sidebar, xl+ only)
// ---------------------------------------------------------------------------
function TableOfContents({ activeId, colors, sections }: { activeId: string; colors: Colors; sections: SectionMeta[] }) {
  return (
    <nav
      aria-label="Table of Contents"
      style={{
        position: 'fixed',
        left: 40,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        maxWidth: 180,
      }}
      className="hidden xl:block"
    >
      {/* Thin connecting line */}
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: 0,
          bottom: 0,
          width: 1,
          background: colors.figureBorder,
        }}
      />

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <li key={sec.id} style={{ position: 'relative', paddingLeft: 20, marginBottom: 10 }}>
              {/* Dot on the line */}
              <span
                style={{
                  position: 'absolute',
                  left: 3,
                  top: 6,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: isActive ? colors.crimson : colors.figureBorder,
                  transition: 'background 0.25s ease',
                }}
              />
              <a
                href={`#${sec.id}`}
                onClick={(e) => scrollToSection(sec.id, e)}
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: '0.78rem',
                  lineHeight: 1.35,
                  color: isActive ? colors.crimson : colors.muted,
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: 'none',
                  transition: 'color 0.25s ease, font-weight 0.25s ease',
                  display: 'block',
                }}
              >
                {sec.number ? `${sec.number}. ` : ''}
                {sec.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
export default function ResearcherLanding() {
  const { locale } = useParams<{ locale: string }>();
  const safeLocale = locale && ['en', 'es'].includes(locale) ? locale : 'en';
  const { t, i18n } = useTranslation('researcher');
  const navigate = useNavigate();
  const location = useLocation();
  const sections = t('sections', { returnObjects: true }) as SectionMeta[];
  const faqItems = t('faq.items', { returnObjects: true }) as { q: string; a: string }[];
  const { theme, toggleTheme } = useTheme();
  const { openModal, isGitHubSciorexUrl } = useGitHubMigration();
  const colors = getColors(theme);

  const switchLocale = (code: string) => {
    if (code !== safeLocale) {
      i18n.changeLanguage(code);
      const rest = location.pathname.split('/').filter(Boolean).slice(1).join('/');
      navigate(`/${code}/${rest}${location.hash}`);
    }
  };

  // Lightbox state for maximizing screenshots on click
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');
  const [showMacNotice, setShowMacNotice] = useState(() => /Macintosh/.test(navigator.userAgent));
  const [version, setVersion] = useState('');

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxImage(src);
    setLightboxAlt(alt);
  }, []);

  // Fetch latest version
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(getVersionJsonUrl(config), { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          const ver = data.data?.version || data.version;
          if (ver) setVersion(ver);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        /* version just won't show */
      }
    })();
    return () => { controller.abort(); };
  }, []);

  // FAQ accordion state (first item open by default)
  const [openFaq, setOpenFaq] = useState<number>(0);

  // FAQ items formatted for SEO component
  const seoFaqItems = faqItems.map((item) => ({ question: item.q, answer: item.a }));

  // Inject pill bar scrollbar hiding for WebKit
  useEffect(() => {
    const id = 'researcher-pill-bar-style';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `.rp-pill-bar::-webkit-scrollbar { display: none; }`;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);

  // IntersectionObserver for ToC active section tracking
  const [activeSection, setActiveSection] = useState<string>('title-block');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerSection = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el);
    } else {
      sectionRefs.current.delete(id);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0 && visible[0].target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const obs = observerRef.current;

    const timer = setTimeout(() => {
      sectionRefs.current.forEach((el) => obs.observe(el));
    }, 200);

    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
  }, []);

  // Download links grouped by OS — labels/notes from i18n, file names kept here
  const DOWNLOAD_FILES = [
    ['Sciorex-win-x64.exe', 'Sciorex-portable.exe'],
    ['Sciorex-mac-arm64.dmg', 'Sciorex-mac-x64.dmg'],
    ['Sciorex-linux-x86_64.AppImage', 'Sciorex-linux-amd64.deb', 'Sciorex-linux-x86_64.rpm'],
  ];
  const downloadGroupsRaw = t('availability.downloads.groups', { returnObjects: true }) as { os: string; targets: { label: string; note: string }[] }[];
  const downloadGroups = downloadGroupsRaw.map((g, gi) => ({
    ...g,
    targets: g.targets.map((tgt, ti) => ({ ...tgt, file: DOWNLOAD_FILES[gi]?.[ti] ?? '' })),
  }));

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div
      style={{
        background: colors.bg,
        color: colors.text,
        minHeight: '100vh',
        scrollBehavior: 'smooth',
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
    >
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        path="/researcher"
        faqItems={seoFaqItems}
      />
      {/* ============================================================= */}
      {/* Minimal top nav bar                                           */}
      {/* ============================================================= */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: colors.navBg,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${colors.figureBorder}`,
          transition: 'background-color 0.4s ease, border-color 0.4s ease',
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            padding: '0.6rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: FONTS.sans,
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: FONTS.serif,
                fontWeight: 700,
                fontSize: '1rem',
                color: colors.text,
                letterSpacing: '0.04em',
              }}
            >
              <img src="/logo.png" alt="" style={{ width: 24, height: 24, borderRadius: 6 }} />
              {t('nav.brand')}
            </span>
            <Link
              to={`/${safeLocale}/`}
              style={{
                color: colors.muted,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.crimson)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
            >
              &larr; {t('nav.back')}
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {(['en', 'es'] as const).map((code, i) => (
                <span key={code} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <span style={{ color: colors.muted, fontSize: 13, userSelect: 'none' }}>|</span>}
                  <button
                    onClick={() => switchLocale(code)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '2px 6px',
                      fontSize: 13,
                      fontFamily: FONTS.sans,
                      fontWeight: safeLocale === code ? 700 : 400,
                      color: safeLocale === code ? colors.crimson : colors.muted,
                      cursor: 'pointer',
                      transition: 'color 0.3s ease',
                      textTransform: 'uppercase',
                    }}
                    aria-label={code === 'en' ? 'English' : 'Español'}
                  >
                    {code.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('nav.lightThemeLabel') : t('nav.darkThemeLabel')}
              style={{
                background: 'none',
                border: `1px solid ${colors.figureBorder}`,
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: colors.muted,
                transition: 'color 0.3s ease, border-color 0.3s ease',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.gold;
                e.currentTarget.style.borderColor = colors.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.muted;
                e.currentTarget.style.borderColor = colors.figureBorder;
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a
              href="#sec-availability"
              onClick={(e) => scrollToSection('sec-availability', e)}
              style={{
                color: colors.crimson,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {t('nav.download')}
            </a>
          </div>
        </div>

        {/* Section pills — visible below xl only */}
        <div
          className="rp-pill-bar flex items-center xl:hidden"
          style={{
            gap: 6,
            padding: '0 1.5rem 0.5rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {sections.filter((s) => s.label).map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => scrollToSection(sec.id, e)}
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: '0.65rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? (theme === 'dark' ? colors.bg : '#fff') : colors.muted,
                  background: isActive ? colors.crimson : 'transparent',
                  border: `1px solid ${isActive ? colors.crimson : colors.figureBorder}`,
                  borderRadius: 3,
                  padding: '2px 8px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                {sec.label}
              </a>
            );
          })}
        </div>
      </header>

      {/* ============================================================= */}
      {/* Main content                                                  */}
      {/* ============================================================= */}
      <main>
      {/* ============================================================= */}
      {/* Table of Contents sidebar (xl+ only)                          */}
      {/* ============================================================= */}
      <TableOfContents activeId={activeSection} colors={colors} sections={sections} />

      {/* ============================================================= */}
      {/* Paper body                                                    */}
      {/* ============================================================= */}
      <article
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '80px 1.5rem 120px',
        }}
      >
        {/* -------------------------------------------------------------- */}
        {/* TITLE BLOCK                                                    */}
        {/* -------------------------------------------------------------- */}
        <section
          id="title-block"
          ref={(el) => registerSection('title-block', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '2.5rem' }}
          >
            <h1
              style={{
                fontFamily: FONTS.serif,
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: colors.text,
                marginBottom: '0.6rem',
              }}
            >
              {t('titleBlock.title')}
            </h1>
            <p
              style={{
                fontFamily: FONTS.serif,
                fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
                fontWeight: 400,
                color: colors.text,
                fontStyle: 'italic',
                maxWidth: 640,
                margin: '0 auto',
                lineHeight: 1.5,
              }}
            >
              {t('titleBlock.subtitle')}
            </p>

            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: '0.92rem',
                color: colors.muted,
                marginTop: '1.5rem',
                lineHeight: 1.7,
              }}
            >
              <span style={{ fontWeight: 600, color: colors.text }}>
                {t('titleBlock.authors')}
              </span>
              <br />
              {t('titleBlock.affiliation')}
            </div>

            {/* Horizontal rule */}
            <div
              style={{
                margin: '2rem auto',
                maxWidth: 500,
                height: 1,
                background: `linear-gradient(to right, transparent, ${colors.figureBorder}, transparent)`,
              }}
            />
          </motion.div>

          {/* Abstract */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginBottom: '1.5rem' }}
          >
            <p
              style={{
                fontFamily: FONTS.sans,
                fontSize: '1.02rem',
                lineHeight: 1.78,
                color: colors.text,
                textAlign: 'justify',
                hyphens: 'auto' as const,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.serif,
                  fontWeight: 700,
                  fontSize: '1rem',
                  marginRight: '0.5rem',
                }}
              >
                {t('titleBlock.abstractLabel')}
              </span>
              {t('titleBlock.abstract')}
            </p>
          </motion.div>

          {/* Keywords */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{
              fontFamily: FONTS.sans,
              fontSize: '0.88rem',
              color: colors.muted,
              marginBottom: '2.5rem',
            }}
          >
            <span style={{ fontWeight: 600, color: colors.text }}>{t('titleBlock.keywordsLabel')}</span>{' '}
            {t('titleBlock.keywords')}
          </motion.p>

          {/* Figure 1: Hero dashboard */}
          <Figure
            number={1}
            src="hero-dashboard.png"
            caption={t('figures.1')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />
        </section>

        {/* -------------------------------------------------------------- */}
        {/* S1: INTRODUCTION                                               */}
        {/* -------------------------------------------------------------- */}
        <section
          id="sec-introduction"
          ref={(el) => registerSection('sec-introduction', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <SectionHeader number="1" title={t('introduction.title')} id="sec-introduction-h" colors={colors} />

          <P colors={colors}>
            {t('introduction.p1').split('{{cite3}}')[0]}<Cite n={3} colors={colors} referenceLabel={t('ui.reference')} />{t('introduction.p1').split('{{cite3}}')[1] ?? ''}
          </P>

          <P colors={colors}>
            {t('introduction.p2').split('{{cite1}}')[0]}<Cite n={1} colors={colors} referenceLabel={t('ui.reference')} />{t('introduction.p2').split('{{cite1}}')[1] ?? ''}
          </P>

          <P colors={colors}>
            {(() => {
              const p3 = t('introduction.p3');
              const parts = p3.split(/(\{\{cite[0-9]+\}\})/);
              return parts.map((part, i) => {
                const citeMatch = part.match(/\{\{cite(\d+)\}\}/);
                if (citeMatch) return <Cite key={i} n={parseInt(citeMatch[1])} colors={colors} referenceLabel={t('ui.reference')} />;
                return <span key={i}>{part}</span>;
              });
            })()}
          </P>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* S2: RESEARCH CAPABILITIES                                      */}
        {/* -------------------------------------------------------------- */}
        <section
          id="sec-research"
          ref={(el) => registerSection('sec-research', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <SectionHeader
            number="2"
            title={t('research.title')}
            id="sec-research-h"
            colors={colors}
          />

          <P colors={colors}>
            {t('research.intro')}
          </P>

          {/* 2.1 LaTeX Editing */}
          <SubSectionHeader number={t('research.latex.number')} title={t('research.latex.title')} colors={colors} />

          <P colors={colors}>
            {t('research.latex.p1')}
          </P>

          <Figure
            number={2}
            src="latex-editor.png"
            caption={t('figures.2')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          {/* 2.2 PDF Annotation & Management */}
          <SubSectionHeader
            number={t('research.pdf.number')}
            title={t('research.pdf.title')}
            colors={colors}
          />

          <P colors={colors}>
            {t('research.pdf.p1')}
          </P>

          <FigureRotator
            number={3}
            images={[
              { src: 'pdf-annotations.png', label: (t('figureLabels.3', { returnObjects: true }) as string[])[0] },
              { src: 'export-annotations.png', label: (t('figureLabels.3', { returnObjects: true }) as string[])[1] },
            ]}
            caption={t('figures.3')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          {/* 2.3 Literature Discovery */}
          <SubSectionHeader number={t('research.discovery.number')} title={t('research.discovery.title')} colors={colors} />

          <P colors={colors}>
            {t('research.discovery.p1')}
          </P>

          <FigureRotator
            number={4}
            images={[
              { src: 'paper-discovery.png', label: (t('figureLabels.4', { returnObjects: true }) as string[])[0] },
              { src: 'paper-discovery-citations.png', label: (t('figureLabels.4', { returnObjects: true }) as string[])[1] },
            ]}
            caption={t('figures.4')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          {/* 2.4 Reference Library */}
          <SubSectionHeader number={t('research.library.number')} title={t('research.library.title')} colors={colors} />

          <P colors={colors}>
            {t('research.library.p1')}
          </P>

          <Figure
            number={5}
            src="reference-library.png"
            caption={t('figures.5')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />
        </section>

        {/* -------------------------------------------------------------- */}
        {/* S3: DEVELOPMENT ENVIRONMENT                                    */}
        {/* -------------------------------------------------------------- */}
        <section
          id="sec-development"
          ref={(el) => registerSection('sec-development', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <SectionHeader
            number="3"
            title={t('development.title')}
            id="sec-development-h"
            colors={colors}
          />

          <P colors={colors}>
            {t('development.intro')}
          </P>

          {/* 3.1 AI-Assisted Coding */}
          <SubSectionHeader number={t('development.ai.number')} title={t('development.ai.title')} colors={colors} />

          <P colors={colors}>
            {t('development.ai.p1')}
          </P>

          <FigureRotator
            number={6}
            images={[
              { src: 'chat-view.png', label: (t('figureLabels.6', { returnObjects: true }) as string[])[0] },
              { src: 'start-chat.png', label: (t('figureLabels.6', { returnObjects: true }) as string[])[1] },
              { src: 'showcase-agentic.png', label: (t('figureLabels.6', { returnObjects: true }) as string[])[2] },
            ]}
            caption={t('figures.6')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          {/* 3.2 Council Mode */}
          <SubSectionHeader number={t('development.council.number')} title={t('development.council.title')} colors={colors} />

          <P colors={colors}>
            {t('development.council.p1')}
          </P>

          <Figure
            number={7}
            src="chat-council.png"
            caption={t('figures.7')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          {/* 3.3 Custom Agents */}
          <SubSectionHeader number={t('development.agents.number')} title={t('development.agents.title')} colors={colors} />

          <P colors={colors}>
            {t('development.agents.p1')}
          </P>

          <FigureRotator
            number={8}
            images={[
              { src: 'agents-view.png', label: (t('figureLabels.8', { returnObjects: true }) as string[])[0] },
              { src: 'showcase-config.png', label: (t('figureLabels.8', { returnObjects: true }) as string[])[1] },
              { src: 'step-config.png', label: (t('figureLabels.8', { returnObjects: true }) as string[])[2] },
            ]}
            caption={t('figures.8')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          {/* 3.4 Agent Execution */}
          <SubSectionHeader number={t('development.agentExecution.number')} title={t('development.agentExecution.title')} colors={colors} />

          <P colors={colors}>
            {t('development.agentExecution.p1')}
          </P>

          <Figure
            number={9}
            src="agent-run-view.png"
            caption={t('figures.9')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          {/* 3.5 Visual Workflows */}
          <SubSectionHeader number={t('development.workflows.number')} title={t('development.workflows.title')} colors={colors} />

          <P colors={colors}>
            {t('development.workflows.p1')}
          </P>

          <FigureRotator
            number={10}
            images={[
              { src: 'flow-view.png', label: (t('figureLabels.10', { returnObjects: true }) as string[])[0] },
              { src: 'flow-edition-view.png', label: (t('figureLabels.10', { returnObjects: true }) as string[])[1] },
              { src: 'showcase-flow.png', label: (t('figureLabels.10', { returnObjects: true }) as string[])[2] },
              { src: 'step-flow.png', label: (t('figureLabels.10', { returnObjects: true }) as string[])[3] },
            ]}
            caption={t('figures.10')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          {/* 3.6 Flow Execution Monitoring */}
          <SubSectionHeader number={t('development.flowMonitoring.number')} title={t('development.flowMonitoring.title')} colors={colors} />

          <P colors={colors}>
            {t('development.flowMonitoring.p1')}
          </P>

          <FigureRotator
            number={11}
            images={[
              { src: 'flow-run-view.png', label: (t('figureLabels.11', { returnObjects: true }) as string[])[0] },
              { src: 'showcase-execution.png', label: (t('figureLabels.11', { returnObjects: true }) as string[])[1] },
            ]}
            caption={t('figures.11')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          {/* 3.7 Integrated Editor */}
          <SubSectionHeader number={t('development.editor.number')} title={t('development.editor.title')} colors={colors} />

          <P colors={colors}>
            {t('development.editor.p1')}
          </P>

          <FigureRotator
            number={12}
            images={[
              { src: 'editor-view.png', label: (t('figureLabels.12', { returnObjects: true }) as string[])[0] },
              { src: 'agentic-preview.png', label: (t('figureLabels.12', { returnObjects: true }) as string[])[1] },
              { src: 'browser-preview.png', label: (t('figureLabels.12', { returnObjects: true }) as string[])[2] },
            ]}
            caption={t('figures.12')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          {/* 3.8 Source Control & Worktrees */}
          <SubSectionHeader number={t('development.sourceControl.number')} title={t('development.sourceControl.title')} colors={colors} />

          <P colors={colors}>
            {t('development.sourceControl.p1')}
          </P>

          <P colors={colors}>
            {t('development.sourceControl.p2')}
          </P>

          <FigureRotator
            number={13}
            images={[
              { src: 'editor-git-view.png', label: (t('figureLabels.13', { returnObjects: true }) as string[])[0] },
              { src: 'worktree-view.png', label: (t('figureLabels.13', { returnObjects: true }) as string[])[1] },
              { src: 'worktree-view-2.png', label: (t('figureLabels.13', { returnObjects: true }) as string[])[2] },
              { src: 'showcase-worktree.png', label: (t('figureLabels.13', { returnObjects: true }) as string[])[3] },
            ]}
            caption={t('figures.13')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />
        </section>

        {/* -------------------------------------------------------------- */}
        {/* S4: AI AUTONOMY & MCP                                          */}
        {/* -------------------------------------------------------------- */}
        <section
          id="sec-mcp"
          ref={(el) => registerSection('sec-mcp', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <SectionHeader
            number="4"
            title={t('mcp.title')}
            id="sec-mcp-h"
            colors={colors}
          />

          <P colors={colors}>
            {(() => {
              const p1 = t('mcp.p1');
              const parts = p1.split(/(\{\{cite[0-9]+\}\})/);
              return parts.map((part, i) => {
                const citeMatch = part.match(/\{\{cite(\d+)\}\}/);
                if (citeMatch) return <Cite key={i} n={parseInt(citeMatch[1])} colors={colors} referenceLabel={t('ui.reference')} />;
                return <span key={i}>{part}</span>;
              });
            })()}
          </P>

          <P colors={colors}>
            {t('mcp.p2')}
          </P>

          {/* MCP Tool Grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
              gap: 12,
              margin: '1.5rem 0 2rem',
            }}
          >
            {(t('mcp.tools', { returnObjects: true }) as { server: string; tools: string[] }[]).map((block) => (
              <ToolCard
                key={block.server}
                server={block.server}
                tools={block.tools}
                colors={colors}
              />
            ))}
          </motion.div>

          <P colors={colors}>
            {t('mcp.permissions')}
          </P>

          <P colors={colors}>
            {t('mcp.practical')}
          </P>

          <Figure
            number={14}
            src="showcase-chat.png"
            caption={t('figures.14')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />
        </section>

        {/* -------------------------------------------------------------- */}
        {/* S5: PROJECT MANAGEMENT                                         */}
        {/* -------------------------------------------------------------- */}
        <section
          id="sec-project"
          ref={(el) => registerSection('sec-project', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <SectionHeader
            number="5"
            title={t('project.title')}
            id="sec-project-h"
            colors={colors}
          />

          <P colors={colors}>
            {t('project.p1')}
          </P>

          <FigureRotator
            number={15}
            images={[
              { src: 'kanban-view.png', label: (t('figureLabels.15', { returnObjects: true }) as string[])[0] },
              { src: 'showcase-kanban.png', label: (t('figureLabels.15', { returnObjects: true }) as string[])[1] },
              { src: 'tickets-list.png', label: (t('figureLabels.15', { returnObjects: true }) as string[])[2] },
              { src: 'step-kanban.png', label: (t('figureLabels.15', { returnObjects: true }) as string[])[3] },
            ]}
            caption={t('figures.15')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          <P colors={colors}>
            {t('project.p2')}
          </P>

          <FigureRotator
            number={16}
            images={[
              { src: 'epics-view.png', label: (t('figureLabels.16', { returnObjects: true }) as string[])[0] },
              { src: 'ticket-description.png', label: (t('figureLabels.16', { returnObjects: true }) as string[])[1] },
            ]}
            caption={t('figures.16')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />
        </section>

        {/* -------------------------------------------------------------- */}
        {/* S6: ARCHITECTURE & PRIVACY                                     */}
        {/* -------------------------------------------------------------- */}
        <section
          id="sec-architecture"
          ref={(el) => registerSection('sec-architecture', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <SectionHeader
            number="6"
            title={t('architecture.title')}
            id="sec-architecture-h"
            colors={colors}
          />

          <P colors={colors}>
            {t('architecture.p1')}
          </P>

          <P colors={colors}>
            {t('architecture.p2')}
          </P>

          <P colors={colors}>
            {t('architecture.p3')}
          </P>

          <Figure
            number={17}
            src="settings-clis.png"
            caption={t('figures.17')}
            colors={colors}
            onImageClick={openLightbox}
            prefix={t('figurePrefix')}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              background: colors.codeBg,
              border: `1px solid ${colors.figureBorder}`,
              padding: '1.25rem 1.5rem',
              margin: '1.75rem 0',
              fontFamily: FONTS.mono,
              fontSize: '0.88rem',
              lineHeight: 1.7,
              color: colors.text,
            }}
          >
            <span style={{ fontWeight: 700 }}>{t('architecture.privacyGuarantee.heading')}</span>
            <br />
            {t('architecture.privacyGuarantee.line1')}
            <br />
            {t('architecture.privacyGuarantee.line2')}
            <br />
            {t('architecture.privacyGuarantee.line3')}
            <br />
            {t('architecture.privacyGuarantee.line4')}
          </motion.div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* S7: AVAILABILITY                                               */}
        {/* -------------------------------------------------------------- */}
        <section
          id="sec-availability"
          ref={(el) => registerSection('sec-availability', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <SectionHeader
            number="7"
            title={t('availability.title')}
            id="sec-availability-h"
            colors={colors}
          />

          <P colors={colors}>
            {t('availability.p1')}
          </P>
          <P colors={colors}>
            {t('availability.docsNote')}{' '}
            <a
              href={`${DOCS_URL}/guide/getting-started`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.crimson, textDecoration: 'none' }}
            >
              {t('availability.docsLink')}
            </a>
            {t('availability.docsMid')}{' '}
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.crimson, textDecoration: 'none' }}
            >
              {t('availability.docsFullLink')}
            </a>{' '}
            {t('availability.docsEnd')}
          </P>

          {/* OS-grouped download table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '1rem',
              margin: '1.5rem 0 2rem',
            }}
          >
            {downloadGroups.map((group) => (
              <div
                key={group.os}
                style={{
                  border: `1px solid ${colors.figureBorder}`,
                  background: colors.cardBg,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* OS header */}
                <div style={{
                  padding: '0.5rem 0.85rem',
                  borderBottom: `1px solid ${colors.figureBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontFamily: FONTS.sans,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: colors.text,
                  }}>
                    {group.os}
                  </span>
                  {version && (
                    <span style={{
                      fontFamily: FONTS.mono,
                      fontSize: '0.7rem',
                      color: colors.muted,
                    }}>
                      v{version}
                    </span>
                  )}
                </div>

                {/* Download options */}
                <div style={{ padding: '0.35rem 0' }}>
                  {group.targets.map((target) => (
                    <a
                      key={target.file}
                      href={`${DOWNLOAD_BASE_URL}/${target.file}`}
                      onClick={() => { if (group.os === 'macOS') setShowMacNotice(true); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.4rem 0.85rem',
                        fontFamily: FONTS.sans,
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        color: colors.text,
                        transition: 'background 0.15s',
                        gap: '0.5rem',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme === 'dark'
                          ? 'rgba(239,107,107,0.06)'
                          : 'rgba(220,53,69,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ fontWeight: 600 }}>{target.label}</span>
                        <span style={{ fontSize: '0.7rem', color: colors.muted }}>{target.note}</span>
                      </div>
                      <span style={{
                        color: colors.crimson,
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}>
                        {t('availability.downloads.downloadAction')}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* macOS Installation Notice — shown if macOS detected or macOS download clicked */}
          <AnimatePresence>
            {showMacNotice && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                style={{ overflow: 'hidden', margin: '0 0 2rem' }}
              >
                <div style={{
                  border: `1px solid ${theme === 'dark' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(217, 119, 6, 0.3)'}`,
                  padding: '1rem 1.25rem',
                  background: theme === 'dark' ? 'rgba(245, 158, 11, 0.04)' : 'rgba(255, 251, 235, 0.8)',
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <AlertTriangle size={16} style={{ color: theme === 'dark' ? '#fbbf24' : '#b45309', flexShrink: 0, marginTop: 2 }} />
                    <div style={{ fontFamily: FONTS.sans, fontSize: '0.82rem', lineHeight: 1.65, color: colors.muted }}>
                      <p style={{ fontWeight: 700, color: theme === 'dark' ? '#fcd34d' : '#92400e', marginBottom: '0.35rem' }}>
                        {t('availability.macNotice.title')}
                      </p>
                      <p>
                        {t('availability.macNotice.p1')}
                      </p>
                      <code style={{
                        display: 'block',
                        fontFamily: FONTS.mono,
                        fontSize: '0.78rem',
                        padding: '0.4rem 0.75rem',
                        margin: '0.5rem 0',
                        background: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(254,243,199,0.8)',
                        color: theme === 'dark' ? '#fde68a' : '#78350f',
                        userSelect: 'all' as const,
                      }}>
                        {t('availability.macNotice.command')}
                      </code>
                      <p style={{ fontSize: '0.78rem' }}>
                        {t('availability.macNotice.alternative')}
                      </p>
                      <p style={{ fontSize: '0.78rem' }}>
                        {t('availability.macNotice.sequoia')}
                      </p>
                      <a
                        href="https://support.apple.com/en-us/102445"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.78rem',
                          color: theme === 'dark' ? '#fbbf24' : '#b45309',
                          textDecoration: 'none',
                          marginTop: '0.25rem',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
                      >
                        {t('availability.macNotice.learnMore')} <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* S8: PRICING                                                    */}
        {/* -------------------------------------------------------------- */}
        <section
          id="sec-pricing"
          ref={(el) => registerSection('sec-pricing', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <SectionHeader number="8" title={t('pricing.title')} id="sec-pricing-h" colors={colors} />

          <P colors={colors}>
            {t('pricing.p1')}
            {' '}<Link to={`/${safeLocale}/contact`} style={{ color: colors.crimson }}>&rarr;</Link>
          </P>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* APPENDIX A: FAQ                                                */}
        {/* -------------------------------------------------------------- */}
        <section
          id="sec-faq"
          ref={(el) => registerSection('sec-faq', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <SectionHeader number="A" title={t('faq.title')} id="sec-faq-h" colors={colors} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1.25rem 0 2rem' }}>
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  style={{
                    border: `1px solid ${isOpen ? colors.crimson : colors.figureBorder}`,
                    background: isOpen
                      ? (theme === 'dark' ? 'rgba(239,107,107,0.04)' : 'rgba(220,53,69,0.02)')
                      : 'transparent',
                    transition: 'border-color 0.25s, background 0.25s',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: FONTS.sans,
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: isOpen ? colors.crimson : colors.text,
                      lineHeight: 1.5,
                      transition: 'color 0.2s',
                    }}
                  >
                    <ChevronRight
                      size={14}
                      style={{
                        flexShrink: 0,
                        color: isOpen ? colors.crimson : colors.muted,
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s, color 0.2s',
                      }}
                    />
                    {item.q}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        role="region"
                        id={`faq-answer-${i}`}
                        aria-labelledby={`faq-question-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{
                          fontFamily: FONTS.serif,
                          fontSize: '1.02rem',
                          lineHeight: 1.8,
                          color: colors.muted,
                          padding: '0 1rem 0.85rem 2.5rem',
                        }}>
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* CTA                                                            */}
        {/* -------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            border: `1px solid ${colors.figureBorder}`,
            background: colors.cardBg,
            padding: '2rem 2rem',
            margin: '3rem 0',
            textAlign: 'center',
          }}
        >
          <p style={{
            fontFamily: FONTS.serif,
            fontSize: '1.35rem',
            fontWeight: 600,
            color: colors.text,
            marginBottom: '0.5rem',
          }}>
            {t('cta.title')}
          </p>
          <p style={{
            fontFamily: FONTS.sans,
            fontSize: '0.9rem',
            color: colors.muted,
            marginBottom: '1.5rem',
            maxWidth: 480,
            margin: '0 auto 1.5rem',
            lineHeight: 1.6,
          }}>
            {t('cta.subtitle')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="#sec-availability"
              onClick={(e) => scrollToSection('sec-availability', e)}
              style={{
                fontFamily: FONTS.sans,
                fontSize: '0.88rem',
                fontWeight: 600,
                color: colors.bg,
                background: colors.crimson,
                padding: '0.6rem 1.75rem',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            >
              {t('cta.download')}
            </a>
            {isGitHubSciorexUrl(REPO_URL) ? (
              <button
                onClick={() => openModal(REPO_URL)}
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: colors.text,
                  background: 'none',
                  border: `1px solid ${colors.figureBorder}`,
                  padding: '0.6rem 1.75rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = colors.crimson; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = colors.figureBorder; }}
              >
                {t('cta.starGithub')}
              </button>
            ) : (
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: colors.text,
                  background: 'none',
                  border: `1px solid ${colors.figureBorder}`,
                  padding: '0.6rem 1.75rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = colors.crimson; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = colors.figureBorder; }}
              >
                {t('cta.viewSource')}
              </a>
            )}
          </div>
        </motion.div>

        {/* -------------------------------------------------------------- */}
        {/* REFERENCES                                                     */}
        {/* -------------------------------------------------------------- */}
        <section
          id="sec-references"
          ref={(el) => registerSection('sec-references', el)}
          style={{ scrollMarginTop: '100px' }}
        >
          <motion.h2
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: FONTS.serif,
              fontSize: '1.65rem',
              fontWeight: 700,
              color: colors.text,
              borderBottom: `1px solid ${colors.figureBorder}`,
              paddingBottom: '0.45rem',
              marginTop: '3.5rem',
              marginBottom: '1.5rem',
            }}
          >
            {t('references.title')}
          </motion.h2>

          <motion.ol
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontFamily: FONTS.sans,
              fontSize: '0.92rem',
              lineHeight: 1.75,
              color: colors.text,
            }}
          >
            {(t('references.items', { returnObjects: true }) as string[]).map((ref, i) => (
              <li
                key={i}
                style={{
                  paddingLeft: '2.5rem',
                  textIndent: '-2.5rem',
                  marginBottom: '0.65rem',
                }}
              >
                <span style={{ color: colors.crimson, fontWeight: 600 }}>
                  [{i + 1}]
                </span>{' '}
                {ref}
              </li>
            ))}
          </motion.ol>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Footer                                                         */}
        {/* -------------------------------------------------------------- */}
        <footer style={{ marginTop: '4rem', fontFamily: FONTS.sans, fontSize: '0.82rem', color: colors.muted }}>
          {/* Community links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {isGitHubSciorexUrl(REPO_URL) ? (
              <button
                onClick={() => openModal(REPO_URL)}
                style={{
                  color: colors.muted,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: FONTS.sans,
                  fontSize: '0.82rem',
                  padding: 0,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.crimson)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
              >
                {t('footer.github')}
              </button>
            ) : (
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" style={{ color: colors.muted, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = colors.crimson)} onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}>{t('footer.github')}</a>
            )}
            {[
              { label: t('footer.discord'), href: DISCORD_URL },
              { label: t('footer.twitter'), href: TWITTER_URL },
              { label: t('footer.youtube'), href: 'https://www.youtube.com/@SciorexApp' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: colors.muted,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.crimson)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Page links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.muted, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.crimson)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
            >
              {t('footer.docs')}
            </a>
            {[
              { label: t('footer.blog'), to: `/${safeLocale}/blog` },
              { label: t('footer.contact'), to: `/${safeLocale}/contact` },
              { label: t('footer.about'), to: `/${safeLocale}/about` },
              { label: t('footer.privacy'), to: `/${safeLocale}/privacy` },
              { label: t('footer.terms'), to: `/${safeLocale}/terms` },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                style={{
                  color: colors.muted,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.crimson)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Separator */}
          <div
            style={{
              margin: '0 auto 1.25rem',
              maxWidth: 400,
              height: 1,
              background: `linear-gradient(to right, transparent, ${colors.figureBorder}, transparent)`,
            }}
          />

          {/* Copyright */}
          <p style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>

          {/* Back to top */}
          <p style={{ textAlign: 'center' }}>
            <a
              href="#title-block"
              onClick={(e) => scrollToSection('title-block', e)}
              style={{
                color: colors.muted,
                textDecoration: 'none',
                fontSize: '0.78rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.crimson)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.muted)}
            >
              {t('footer.backToTop')}
            </a>
          </p>
        </footer>
      </article>
      </main>

      <Lightbox
        image={lightboxImage}
        alt={lightboxAlt}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
