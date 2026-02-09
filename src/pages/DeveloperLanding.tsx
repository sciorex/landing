import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react';
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
// Design Tokens — scoped to this page
// ---------------------------------------------------------------------------

type BlueprintPalette = {
  bg: string;
  text: string;
  muted: string;
  cyan: string;
  orange: string;
  gridLine: string;
  cardBorder: string;
  cardBg: string;
};

function getBP(theme: 'dark' | 'light'): BlueprintPalette {
  if (theme === 'light') {
    return {
      bg: '#F0F4F8',
      text: '#0A1628',
      muted: '#5A6A7A',
      cyan: '#0D9488',
      orange: '#E05520',
      gridLine: 'rgba(13, 148, 136, 0.08)',
      cardBorder: 'rgba(13, 148, 136, 0.2)',
      cardBg: 'rgba(255, 255, 255, 0.85)',
    };
  }
  return {
    bg: '#0A1628',
    text: '#E8E8E8',
    muted: '#8899AA',
    cyan: '#4ECDC4',
    orange: '#FF6B35',
    gridLine: 'rgba(78, 205, 196, 0.06)',
    cardBorder: 'rgba(78, 205, 196, 0.15)',
    cardBg: 'rgba(10, 22, 40, 0.8)',
  };
}

const FONT = {
  heading: "'DM Sans', sans-serif",
  mono: "'Fira Code', monospace",
  body: "'Inter', sans-serif",
} as const;

// FAQ_ITEMS removed — now read from translations inside component

// ---------------------------------------------------------------------------
// Scroll helper — smooth scroll + delayed correction for layout shifts
// caused by lazy-loaded images that expand after the initial scroll.
// ---------------------------------------------------------------------------
function scrollToSection(id: string, e?: React.MouseEvent) {
  e?.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const correct = () => el.scrollIntoView({ behavior: 'auto', block: 'start' });
  setTimeout(correct, 600);
  setTimeout(correct, 1200);
}

// ---------------------------------------------------------------------------
// Section metadata for sidebar nav
// ---------------------------------------------------------------------------

const BP_SECTION_IDS = [
  { id: 'bp-hero' },
  { id: 'bp-section-a' },
  { id: 'bp-section-b' },
  { id: 'bp-section-c' },
  { id: 'bp-specs' },
  { id: 'deployment' },
  { id: 'bp-pricing' },
  { id: 'bp-section-d' },
];

// ---------------------------------------------------------------------------
// CSS injected once for page-specific keyframes
// ---------------------------------------------------------------------------

const STYLE_ID = 'developer-landing-styles';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .bp-pill-bar::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Blueprint Frame — reusable screenshot container
// ---------------------------------------------------------------------------

function BlueprintFrame({
  label,
  children,
  bp,
  onFrameClick,
}: {
  label: string;
  children: ReactNode;
  bp: BlueprintPalette;
  onFrameClick?: () => void;
}) {
  const cornerSize = 12;
  const cornerStyle = (
    position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  ): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: cornerSize,
      height: cornerSize,
    };
    switch (position) {
      case 'topLeft':
        return { ...base, top: -1, left: -1, borderTop: `2px solid ${bp.cyan}`, borderLeft: `2px solid ${bp.cyan}` };
      case 'topRight':
        return { ...base, top: -1, right: -1, borderTop: `2px solid ${bp.cyan}`, borderRight: `2px solid ${bp.cyan}` };
      case 'bottomLeft':
        return { ...base, bottom: -1, left: -1, borderBottom: `2px solid ${bp.cyan}`, borderLeft: `2px solid ${bp.cyan}` };
      case 'bottomRight':
        return { ...base, bottom: -1, right: -1, borderBottom: `2px solid ${bp.cyan}`, borderRight: `2px solid ${bp.cyan}` };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ width: '100%' }}
    >
      <p style={{ fontFamily: FONT.mono, fontSize: 11, color: bp.cyan, letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase' }}>
        {label}
      </p>
      <div
        onClick={onFrameClick}
        style={{ position: 'relative', border: `1px solid ${bp.cyan}`, borderRadius: 2, overflow: 'hidden', cursor: onFrameClick ? 'zoom-in' : 'default' }}
      >
        <div style={cornerStyle('topLeft')} />
        <div style={cornerStyle('topRight')} />
        <div style={cornerStyle('bottomLeft')} />
        <div style={cornerStyle('bottomRight')} />
        {children}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Blueprint Image Rotator — multi-image with tab selector
// ---------------------------------------------------------------------------

function BlueprintRotator({
  label,
  images,
  bp,
  interval = 4000,
  onImageClick,
}: {
  label: string;
  images: { src: string; tab: string }[];
  bp: BlueprintPalette;
  interval?: number;
  onImageClick?: (src: string, alt: string) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const visibleRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
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
    const el = wrapperRef.current;
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
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ width: '100%' }}
    >
      <p style={{ fontFamily: FONT.mono, fontSize: 11, color: bp.cyan, letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase' }}>
        {label}
      </p>
      <div style={{ border: `1px solid ${bp.cyan}`, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
        {/* Registration marks */}
        <div style={{ position: 'absolute', top: -1, left: -1, width: 12, height: 12, borderTop: `2px solid ${bp.cyan}`, borderLeft: `2px solid ${bp.cyan}`, zIndex: 2 }} />
        <div style={{ position: 'absolute', top: -1, right: -1, width: 12, height: 12, borderTop: `2px solid ${bp.cyan}`, borderRight: `2px solid ${bp.cyan}`, zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: -1, left: -1, width: 12, height: 12, borderBottom: `2px solid ${bp.cyan}`, borderLeft: `2px solid ${bp.cyan}`, zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderBottom: `2px solid ${bp.cyan}`, borderRight: `2px solid ${bp.cyan}`, zIndex: 2 }} />

        {/* Tab bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${bp.cardBorder}`,
          fontFamily: FONT.mono,
          fontSize: 10,
          letterSpacing: '0.06em',
          overflowX: 'auto',
        }}>
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => { setIdx(i); startTimer(); }}
              style={{
                padding: '6px 12px',
                background: i === idx ? bp.cardBg : 'transparent',
                color: i === idx ? bp.cyan : bp.muted,
                fontWeight: i === idx ? 600 : 400,
                border: 'none',
                borderRight: `1px solid ${bp.cardBorder}`,
                cursor: 'pointer',
                fontFamily: FONT.mono,
                fontSize: 10,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'color 0.2s, background 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {img.tab}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => goTo(-1)} style={{ background: 'none', border: 'none', color: bp.muted, cursor: 'pointer', padding: '4px 6px' }} aria-label="Previous">
            <ChevronLeft size={12} />
          </button>
          <button onClick={() => goTo(1)} style={{ background: 'none', border: 'none', color: bp.muted, cursor: 'pointer', padding: '4px 6px' }} aria-label="Next">
            <ChevronRight size={12} />
          </button>
        </div>

        {/* Image area — locked height prevents layout shift */}
        <div
          ref={imageAreaRef}
          onClick={() => onImageClick?.(images[idx].src, label)}
          style={{
            cursor: onImageClick ? 'zoom-in' : 'default',
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
              <ThemeImage name={images[idx].src} alt={`${label} — ${images[idx].tab}`} className="w-full block" onLoad={onImageLoad} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Spec Card — technical specification card with screenshot or rotator
// ---------------------------------------------------------------------------

interface SpecCardProps {
  title: string;
  specs: { label: string; value: string }[];
  screenshot?: string;
  screenshots?: { src: string; tab: string }[];
  screenshotAlt: string;
  wide?: boolean;
  bp: BlueprintPalette;
  onImageClick?: (src: string, alt: string) => void;
}

function SpecCard({ title, specs, screenshot, screenshots, screenshotAlt, wide, bp, onImageClick }: SpecCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        gridColumn: wide ? '1 / -1' : undefined,
        background: bp.cardBg,
        border: `1px solid ${bp.cardBorder}`,
        borderRadius: 4,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Title */}
      <div>
        <p style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 600, color: bp.text, letterSpacing: '0.06em', marginBottom: 6 }}>
          SPEC: {title}
        </p>
        <div style={{ height: 2, width: 160, background: `linear-gradient(90deg, ${bp.cyan}, transparent)` }} />
      </div>

      {/* Key-value specs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {specs.map((s) => (
          <div key={s.label} style={{ fontFamily: FONT.mono, fontSize: 12, lineHeight: 1.6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: bp.muted, minWidth: 90 }}>{s.label}:</span>
            <span style={{ color: bp.text }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Screenshot(s) */}
      {screenshots ? (
        <BlueprintRotator
          label={`${title.toLowerCase().replace(/\s+/g, '-')} viewport`}
          images={screenshots}
          bp={bp}
          onImageClick={onImageClick}
        />
      ) : screenshot ? (
        <BlueprintFrame
          label={`${title.toLowerCase().replace(/\s+/g, '-')} viewport`}
          bp={bp}
          onFrameClick={() => onImageClick?.(screenshot, screenshotAlt)}
        >
          <ThemeImage name={screenshot} alt={screenshotAlt} className="w-full block" />
        </BlueprintFrame>
      ) : null}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section Title Block
// ---------------------------------------------------------------------------

function SectionTitleBlock({ section, title, subtitle, bp }: { section: string; title: string; subtitle: string; bp: BlueprintPalette }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ border: `1px solid ${bp.cardBorder}`, borderRadius: 2, padding: '16px 24px', marginBottom: 40, fontFamily: FONT.mono, maxWidth: 560 }}
    >
      <h2 style={{ fontSize: 14, color: bp.text, fontWeight: 600, letterSpacing: '0.04em', margin: 0 }}>
        {section}: {title}
      </h2>
      <div style={{ height: 1, background: bp.cardBorder, margin: '8px 0' }} />
      <p style={{ fontSize: 11, color: bp.muted, letterSpacing: '0.04em' }}>
        {subtitle}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// MCP Tool Block
// ---------------------------------------------------------------------------

function MCPBlock({ server, tools, bp }: { server: string; tools: string[]; bp: BlueprintPalette }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      style={{
        background: bp.cardBg,
        border: `1px solid ${bp.cardBorder}`,
        borderRadius: 2,
        padding: '14px 18px',
        fontFamily: FONT.mono,
        fontSize: 11,
        lineHeight: 1.7,
      }}
    >
      <div style={{ color: bp.orange, fontWeight: 700, marginBottom: 6, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {server}
      </div>
      {tools.map((t) => (
        <div key={t} style={{ color: bp.text }}>
          <span style={{ color: bp.cyan }}>$</span>{' '}
          <span style={{ color: bp.muted }}>{t.split(' — ')[0]}</span>
          {t.includes(' — ') && <span style={{ color: bp.text }}> — {t.split(' — ')[1]}</span>}
        </div>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Architecture Diagram Node
// ---------------------------------------------------------------------------

function ArchNode({ label, isCenter, delay, bp }: { label: string; isCenter?: boolean; delay: number; bp: BlueprintPalette }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      style={{
        border: `${isCenter ? 2 : 1}px solid ${isCenter ? bp.orange : bp.cyan}`,
        borderRadius: 6,
        padding: isCenter ? '12px 24px' : '8px 16px',
        fontFamily: FONT.mono,
        fontSize: isCenter ? 14 : 11,
        fontWeight: isCenter ? 700 : 500,
        color: isCenter ? bp.orange : bp.cyan,
        letterSpacing: '0.06em',
        background: bp.cardBg,
        whiteSpace: 'nowrap' as const,
        flexShrink: 0,
      }}
    >
      {label}
    </motion.div>
  );
}

function ArchConnector({ delay, bp }: { delay: number; bp: BlueprintPalette }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.4, delay }}
      style={{ height: 0, borderTop: `1px dashed ${bp.cyan}`, width: 40, flexShrink: 0, transformOrigin: 'left center' }}
    />
  );
}

// ---------------------------------------------------------------------------
// Blueprint Sidebar Navigation
// ---------------------------------------------------------------------------

function BlueprintNav({ activeId, bp, sections }: { activeId: string; bp: BlueprintPalette; sections: { id: string; label: string }[] }) {
  return (
    <nav
      aria-label="Section navigation"
      className="hidden xl:block"
      style={{
        position: 'fixed',
        left: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
      }}
    >
      {/* Connecting line */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 10,
          top: 0,
          bottom: 0,
          width: 1,
          background: bp.cardBorder,
        }}
      />

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <li key={sec.id} style={{ position: 'relative', marginBottom: 6 }}>
              <a
                href={`#${sec.id}`}
                onClick={(e) => scrollToSection(sec.id, e)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  textDecoration: 'none',
                  padding: '4px 0',
                }}
              >
                {/* Dot marker */}
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    border: `1.5px solid ${isActive ? bp.cyan : bp.cardBorder}`,
                    background: isActive ? bp.cyan : 'transparent',
                    flexShrink: 0,
                    marginLeft: 7,
                    transition: 'all 0.25s ease',
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT.mono,
                    fontSize: 10,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? bp.cyan : bp.muted,
                    letterSpacing: '0.06em',
                    transition: 'color 0.25s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sec.label}
                </span>
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

export default function DeveloperLanding() {
  const { locale } = useParams<{ locale: string }>();
  const { t, i18n } = useTranslation('developer');
  const navigate = useNavigate();
  const location = useLocation();
  const bpSections = t('bpSections', { returnObjects: true }) as { id: string; label: string }[];
  const faqItems = t('faq', { returnObjects: true }) as { q: string; a: string }[];
  const { theme, toggleTheme } = useTheme();
  const { openModal, isGitHubSciorexUrl } = useGitHubMigration();

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');
  const [showMacNotice, setShowMacNotice] = useState(() => /Macintosh/.test(navigator.userAgent));
  const [version, setVersion] = useState('');
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [activeSection, setActiveSection] = useState('bp-hero');

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxImage(src);
    setLightboxAlt(alt);
  }, []);

  const bp = getBP(theme);
  const safeLocale = locale && ['en', 'es'].includes(locale) ? locale : 'en';

  const switchLocale = (code: string) => {
    if (code !== safeLocale) {
      i18n.changeLanguage(code);
      const rest = location.pathname.split('/').filter(Boolean).slice(1).join('/');
      navigate(`/${code}/${rest}${location.hash}`);
    }
  };

  useEffect(() => {
    injectStyles();
    return () => {
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    };
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

  // FAQ items formatted for SEO component
  const seoFaqItems = faqItems.map((item) => ({ question: item.q, answer: item.a }));

  // Scroll state for navbar opacity
  useEffect(() => {
    const nav = document.getElementById('bp-nav');
    const onScroll = () => {
      if (!nav) return;
      if (theme === 'light') {
        nav.style.background = window.scrollY > 40 ? 'rgba(240, 244, 248, 0.92)' : 'rgba(240, 244, 248, 0.5)';
      } else {
        nav.style.background = window.scrollY > 40 ? 'rgba(10, 22, 40, 0.92)' : 'rgba(10, 22, 40, 0.5)';
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [theme]);

  // Active section tracking — uses DOM IDs directly (no refs, no sort)
  useEffect(() => {
    const TRIGGER = 140; // px from viewport top; comfortably below both mobile/desktop navs
    let ticking = false;

    const updateActive = () => {
      // Near page bottom → highlight last section
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 50) {
        setActiveSection(BP_SECTION_IDS[BP_SECTION_IDS.length - 1].id);
        return;
      }

      // Walk BP_SECTION_IDS in DOM order (constant array, guaranteed correct).
      // The last section whose top has scrolled past the trigger line wins.
      let active = BP_SECTION_IDS[0].id;
      for (const sec of BP_SECTION_IDS) {
        const el = document.getElementById(sec.id);
        if (el && el.getBoundingClientRect().top <= TRIGGER) {
          active = sec.id;
        }
      }

      setActiveSection(active);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateActive();
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = setTimeout(updateActive, 300);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer); };
  }, []);

  // Download targets grouped by OS
  const deployGroups = t('deployment.groups', { returnObjects: true }) as { os: string; items: { label: string; desc: string; file: string; size: string }[] }[];

  // SpecCard translations — Section A
  const specA = {
    aiChat: { specs: t('sectionA.aiChat.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionA.aiChat.tabs', { returnObjects: true }) as string[] },
    agenticPreview: { specs: t('sectionA.agenticPreview.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionA.agenticPreview.tabs', { returnObjects: true }) as string[] },
    agentFramework: { specs: t('sectionA.agentFramework.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionA.agentFramework.tabs', { returnObjects: true }) as string[] },
    executionHistory: { specs: t('sectionA.executionHistory.specs', { returnObjects: true }) as { label: string; value: string }[] },
    councilMode: { specs: t('sectionA.councilMode.specs', { returnObjects: true }) as { label: string; value: string }[] },
    flowEngine: { specs: t('sectionA.flowEngine.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionA.flowEngine.tabs', { returnObjects: true }) as string[] },
    executionMonitor: { specs: t('sectionA.executionMonitor.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionA.executionMonitor.tabs', { returnObjects: true }) as string[] },
    editor: { specs: t('sectionA.editor.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionA.editor.tabs', { returnObjects: true }) as string[] },
    sourceControl: { specs: t('sectionA.sourceControl.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionA.sourceControl.tabs', { returnObjects: true }) as string[] },
    cliIntegrations: { specs: t('sectionA.cliIntegrations.specs', { returnObjects: true }) as { label: string; value: string }[] },
    taskManagement: { specs: t('sectionA.taskManagement.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionA.taskManagement.tabs', { returnObjects: true }) as string[] },
    epicManagement: { specs: t('sectionA.epicManagement.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionA.epicManagement.tabs', { returnObjects: true }) as string[] },
  };

  // SpecCard translations — Section B
  const specB = {
    latexEditor: { specs: t('sectionB.latexEditor.specs', { returnObjects: true }) as { label: string; value: string }[] },
    pdfAnnotations: { specs: t('sectionB.pdfAnnotations.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionB.pdfAnnotations.tabs', { returnObjects: true }) as string[] },
    paperDiscovery: { specs: t('sectionB.paperDiscovery.specs', { returnObjects: true }) as { label: string; value: string }[], tabs: t('sectionB.paperDiscovery.tabs', { returnObjects: true }) as string[] },
  };

  // MCP blocks — Section C
  const mcpBlocks = t('sectionC.blocks', { returnObjects: true }) as { server: string; count: string; tools: string[] }[];

  // Spec sheet items
  const specItems = t('specs.items', { returnObjects: true }) as { label: string; value: string }[];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: bp.bg,
        color: bp.text,
        fontFamily: FONT.body,
        backgroundImage: `linear-gradient(${bp.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${bp.gridLine} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        overflowX: 'hidden',
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
    >
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        path="/developer"
        faqItems={seoFaqItems}
      />

      {/* ================================================================= */}
      {/* NAVIGATION                                                        */}
      {/* ================================================================= */}

      <nav
        id="bp-nav"
        aria-label="Page navigation"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: theme === 'light' ? 'rgba(240, 244, 248, 0.5)' : 'rgba(10, 22, 40, 0.5)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${bp.cardBorder}`,
          transition: 'background 0.3s ease',
        }}
      >
        {/* Primary row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to={`/${safeLocale}/`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT.mono, fontSize: 13, color: bp.text, textDecoration: 'none', letterSpacing: '0.06em', fontWeight: 600 }}>
              <img src="/logo.png" alt="" style={{ width: 22, height: 22, borderRadius: 5 }} />
              SCIOREX
            </Link>
            <Link to={`/${safeLocale}/`} style={{ fontFamily: FONT.mono, fontSize: 12, color: bp.cyan, textDecoration: 'none', letterSpacing: '0.04em' }}>
              &larr; {t('nav.back')}
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1px solid ${bp.cyan}`, borderRadius: 2 }}>
              {(['en', 'es'] as const).map((code, i) => (
                <button
                  key={code}
                  onClick={() => switchLocale(code)}
                  style={{
                    background: safeLocale === code ? bp.cyan : 'transparent',
                    border: 'none',
                    borderLeft: i > 0 ? `1px solid ${bp.cyan}` : 'none',
                    padding: '4px 10px',
                    fontSize: 12,
                    fontFamily: FONT.mono,
                    fontWeight: safeLocale === code ? 700 : 400,
                    color: safeLocale === code ? bp.bg : bp.cyan,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                  aria-label={code === 'en' ? 'English' : 'Español'}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, border: `1px solid ${bp.cyan}`, borderRadius: 2,
                background: 'transparent', color: bp.cyan, cursor: 'pointer',
                transition: 'background 0.2s ease, color 0.2s ease', flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = bp.cyan; (e.currentTarget as HTMLButtonElement).style.color = bp.bg; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = bp.cyan; }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a
              href="#deployment"
              onClick={(e) => scrollToSection('deployment', e)}
              style={{ fontFamily: FONT.mono, fontSize: 12, color: bp.bg, background: bp.cyan, padding: '6px 16px', borderRadius: 2, textDecoration: 'none', letterSpacing: '0.04em', fontWeight: 600 }}
            >
              {t('nav.download')}
            </a>
          </div>
        </div>

        {/* Section pills — visible below xl only */}
        <div
          className="bp-pill-bar flex items-center xl:hidden"
          style={{
            gap: 4,
            padding: '0 24px 8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {bpSections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => scrollToSection(sec.id, e)}
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? bp.bg : bp.muted,
                  background: isActive ? bp.cyan : 'transparent',
                  border: `1px solid ${isActive ? bp.cyan : bp.cardBorder}`,
                  borderRadius: 2,
                  padding: '3px 10px',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
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
      </nav>

      <div className="xl:hidden" style={{ height: 84 }} />
      <div className="hidden xl:block" style={{ height: 56 }} />

      <main>

      <BlueprintNav activeId={activeSection} bp={bp} sections={bpSections} />

      {/* ================================================================= */}
      {/* HERO                                                              */}
      {/* ================================================================= */}

      <section id="bp-hero" style={{ padding: '80px 24px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', scrollMarginTop: 92 }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: FONT.heading, fontSize: 'clamp(56px, 10vw, 100px)', fontWeight: 700,
            color: bp.text, letterSpacing: '0.08em',
            textShadow: theme === 'light'
              ? `0 0 60px rgba(13, 148, 136, 0.2), 0 0 120px rgba(13, 148, 136, 0.08)`
              : `0 0 60px rgba(78, 205, 196, 0.25), 0 0 120px rgba(78, 205, 196, 0.1)`,
            margin: 0, lineHeight: 1,
          }}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          style={{ fontFamily: FONT.body, fontSize: 'clamp(16px, 2.5vw, 22px)', color: bp.muted, marginTop: 16, letterSpacing: '0.04em', fontWeight: 300 }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Architecture Diagram */}
        {(() => {
          const archNodes = t('hero.archNodes', { returnObjects: true }) as string[];
          return (
            <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0, overflowX: 'auto', maxWidth: '100%', padding: '0 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'nowrap' }}>
                <ArchNode label={archNodes[0]} delay={0.6} bp={bp} />
                <ArchConnector delay={1.1} bp={bp} />
                <ArchNode label={archNodes[1]} delay={0.8} bp={bp} />
                <ArchConnector delay={1.3} bp={bp} />
                <ArchNode label={archNodes[2]} isCenter delay={1.0} bp={bp} />
                <ArchConnector delay={1.5} bp={bp} />
                <ArchNode label={archNodes[3]} delay={1.2} bp={bp} />
                <ArchConnector delay={1.7} bp={bp} />
                <ArchNode label={archNodes[4]} delay={1.4} bp={bp} />
              </div>
            </div>
          );
        })()}

        {/* Hero Dashboard Screenshot */}
        <div style={{ maxWidth: 1000, width: '100%', marginTop: 56 }}>
          <BlueprintFrame label={t('hero.frameLabel')} bp={bp} onFrameClick={() => openLightbox('hero-dashboard.png', 'Sciorex main dashboard')}>
            <ThemeImage name="hero-dashboard.png" alt="Sciorex main dashboard" className="w-full block" />
          </BlueprintFrame>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION A: AI & DEVELOPMENT SUITE                                 */}
      {/* ================================================================= */}

      <section id="bp-section-a" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto', scrollMarginTop: 92 }}>
        <SectionTitleBlock section={t('sectionA.section')} title={t('sectionA.title')} subtitle={t('sectionA.subtitle')} bp={bp} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: 24 }}>
          {/* AI Chat System */}
          <SpecCard
            title={t('sectionA.aiChat.title')}
            specs={specA.aiChat.specs}
            screenshots={[
              { src: 'chat-view.png', tab: specA.aiChat.tabs[0] },
              { src: 'start-chat.png', tab: specA.aiChat.tabs[1] },
              { src: 'showcase-chat.png', tab: specA.aiChat.tabs[2] },
            ]}
            screenshotAlt="AI Chat interface"
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* Agentic Preview */}
          <SpecCard
            title={t('sectionA.agenticPreview.title')}
            specs={specA.agenticPreview.specs}
            screenshots={[
              { src: 'agentic-preview.png', tab: specA.agenticPreview.tabs[0] },
              { src: 'showcase-agentic.png', tab: specA.agenticPreview.tabs[1] },
            ]}
            screenshotAlt="Agentic review mode"
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* Custom Agents */}
          <SpecCard
            title={t('sectionA.agentFramework.title')}
            specs={specA.agentFramework.specs}
            screenshots={[
              { src: 'agents-view.png', tab: specA.agentFramework.tabs[0] },
              { src: 'showcase-config.png', tab: specA.agentFramework.tabs[1] },
              { src: 'step-config.png', tab: specA.agentFramework.tabs[2] },
            ]}
            screenshotAlt="Agent framework interface"
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* Agent Execution History */}
          <SpecCard
            title={t('sectionA.executionHistory.title')}
            specs={specA.executionHistory.specs}
            screenshot="agent-run-view.png"
            screenshotAlt="Agent execution history"
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* Council Mode — full width */}
          <SpecCard
            title={t('sectionA.councilMode.title')}
            specs={specA.councilMode.specs}
            screenshot="chat-council.png"
            screenshotAlt="Council mode multi-LLM debate"
            wide
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* Visual Workflows */}
          <SpecCard
            title={t('sectionA.flowEngine.title')}
            specs={specA.flowEngine.specs}
            screenshots={[
              { src: 'flow-view.png', tab: specA.flowEngine.tabs[0] },
              { src: 'flow-edition-view.png', tab: specA.flowEngine.tabs[1] },
              { src: 'showcase-flow.png', tab: specA.flowEngine.tabs[2] },
              { src: 'step-flow.png', tab: specA.flowEngine.tabs[3] },
            ]}
            screenshotAlt="Visual workflow engine"
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* Flow Execution Monitoring */}
          <SpecCard
            title={t('sectionA.executionMonitor.title')}
            specs={specA.executionMonitor.specs}
            screenshots={[
              { src: 'flow-run-view.png', tab: specA.executionMonitor.tabs[0] },
              { src: 'showcase-execution.png', tab: specA.executionMonitor.tabs[1] },
            ]}
            screenshotAlt="Flow execution monitoring"
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* Code Editor */}
          <SpecCard
            title={t('sectionA.editor.title')}
            specs={specA.editor.specs}
            screenshots={[
              { src: 'editor-view.png', tab: specA.editor.tabs[0] },
              { src: 'browser-preview.png', tab: specA.editor.tabs[1] },
            ]}
            screenshotAlt="Integrated code editor"
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* Source Control */}
          <SpecCard
            title={t('sectionA.sourceControl.title')}
            specs={specA.sourceControl.specs}
            screenshots={[
              { src: 'editor-git-view.png', tab: specA.sourceControl.tabs[0] },
              { src: 'worktree-view.png', tab: specA.sourceControl.tabs[1] },
              { src: 'worktree-view-2.png', tab: specA.sourceControl.tabs[2] },
              { src: 'showcase-worktree.png', tab: specA.sourceControl.tabs[3] },
            ]}
            screenshotAlt="Git integration"
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* CLI Integrations — full width */}
          <SpecCard
            title={t('sectionA.cliIntegrations.title')}
            specs={specA.cliIntegrations.specs}
            screenshot="settings-clis.png"
            screenshotAlt="CLI integration settings"
            wide
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* Task Management */}
          <SpecCard
            title={t('sectionA.taskManagement.title')}
            specs={specA.taskManagement.specs}
            screenshots={[
              { src: 'kanban-view.png', tab: specA.taskManagement.tabs[0] },
              { src: 'showcase-kanban.png', tab: specA.taskManagement.tabs[1] },
              { src: 'tickets-list.png', tab: specA.taskManagement.tabs[2] },
              { src: 'step-kanban.png', tab: specA.taskManagement.tabs[3] },
            ]}
            screenshotAlt="Task management"
            bp={bp}
            onImageClick={openLightbox}
          />

          {/* Epics */}
          <SpecCard
            title={t('sectionA.epicManagement.title')}
            specs={specA.epicManagement.specs}
            screenshots={[
              { src: 'epics-view.png', tab: specA.epicManagement.tabs[0] },
              { src: 'ticket-description.png', tab: specA.epicManagement.tabs[1] },
            ]}
            screenshotAlt="Epic management"
            bp={bp}
            onImageClick={openLightbox}
          />
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION B: RESEARCH SUITE                                         */}
      {/* ================================================================= */}

      <section id="bp-section-b" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto', scrollMarginTop: 92 }}>
        <SectionTitleBlock section={t('sectionB.section')} title={t('sectionB.title')} subtitle={t('sectionB.subtitle')} bp={bp} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', gap: 24 }}>
          <SpecCard
            title={t('sectionB.latexEditor.title')}
            specs={specB.latexEditor.specs}
            screenshot="latex-editor.png"
            screenshotAlt="LaTeX editor"
            bp={bp}
            onImageClick={openLightbox}
          />

          <SpecCard
            title={t('sectionB.pdfAnnotations.title')}
            specs={specB.pdfAnnotations.specs}
            screenshots={[
              { src: 'pdf-annotations.png', tab: specB.pdfAnnotations.tabs[0] },
              { src: 'export-annotations.png', tab: specB.pdfAnnotations.tabs[1] },
            ]}
            screenshotAlt="PDF annotation tools"
            bp={bp}
            onImageClick={openLightbox}
          />

          <SpecCard
            title={t('sectionB.paperDiscovery.title')}
            specs={specB.paperDiscovery.specs}
            screenshots={[
              { src: 'paper-discovery.png', tab: specB.paperDiscovery.tabs[0] },
              { src: 'paper-discovery-citations.png', tab: specB.paperDiscovery.tabs[1] },
              { src: 'reference-library.png', tab: specB.paperDiscovery.tabs[2] },
            ]}
            screenshotAlt="Paper discovery"
            wide
            bp={bp}
            onImageClick={openLightbox}
          />
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION C: MCP PROTOCOL                                           */}
      {/* ================================================================= */}

      <section id="bp-section-c" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto', scrollMarginTop: 92 }}>
        <SectionTitleBlock section={t('sectionC.section')} title={t('sectionC.title')} subtitle={t('sectionC.subtitle')} bp={bp} />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: FONT.body, fontSize: 15, lineHeight: 1.75, color: bp.muted, maxWidth: 700, marginBottom: 32 }}
        >
          {t('sectionC.intro')}
        </motion.p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 12, marginBottom: 32 }}>
          {mcpBlocks.map((block) => (
            <MCPBlock key={block.server} server={`${block.server} (${block.count})`} tools={block.tools} bp={bp} />
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* SYSTEM SPECIFICATIONS STRIP                                       */}
      {/* ================================================================= */}

      <section id="bp-specs" style={{ padding: '40px 24px', maxWidth: 1100, margin: '0 auto', scrollMarginTop: 92 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}
        >
          {specItems.map((item) => (
            <div
              key={item.label}
              style={{
                border: `1px solid ${bp.cyan}`, borderRadius: 2, padding: '10px 20px',
                fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.06em',
                display: 'flex', gap: 8, alignItems: 'center',
              }}
            >
              <span style={{ color: bp.muted }}>{item.label}:</span>
              <span style={{ color: bp.text, fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* DEPLOYMENT                                                        */}
      {/* ================================================================= */}

      <section id="deployment" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto', scrollMarginTop: 92 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <p style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 600, color: bp.text, letterSpacing: '0.06em' }}>
              {t('deployment.title')}
            </p>
            {version && (
              <span style={{ fontFamily: FONT.mono, fontSize: 11, color: bp.cyan, letterSpacing: '0.06em' }}>
                v{version}
              </span>
            )}
          </div>
          <div style={{ height: 2, width: 200, background: `linear-gradient(90deg, ${bp.cyan}, transparent)`, marginBottom: 32 }} />

          {/* OS-grouped download cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
            {deployGroups.map((group) => (
              <motion.div
                key={group.os}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                style={{
                  background: bp.cardBg,
                  border: `1px solid ${bp.cardBorder}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                {/* OS header */}
                <div style={{
                  padding: '10px 16px',
                  borderBottom: `1px solid ${bp.cardBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 700, color: bp.text, letterSpacing: '0.08em' }}>
                    {group.os}
                  </span>
                  {version && (
                    <span style={{ fontFamily: FONT.mono, fontSize: 10, color: bp.muted }}>
                      v{version}
                    </span>
                  )}
                </div>

                {/* Download options */}
                <div style={{ padding: '8px 0' }}>
                  {group.items.map((item) => (
                    <a
                      key={item.file}
                      href={`${DOWNLOAD_BASE_URL}/${item.file}`}
                      onClick={() => { if (group.os === 'MACOS') setShowMacNotice(true); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 16px',
                        fontFamily: FONT.mono,
                        fontSize: 12,
                        textDecoration: 'none',
                        color: bp.text,
                        transition: 'background 0.15s ease',
                        gap: 12,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${bp.cyan}11`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <span style={{ fontWeight: 600 }}>{item.label}</span>
                        <span style={{ fontSize: 10, color: bp.muted }}>{item.desc} — {item.size}</span>
                      </div>
                      <span style={{ color: bp.cyan, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                        {t('deployment.deploy')} &rarr;
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* macOS Warning — shown if macOS detected or macOS download clicked */}
          <AnimatePresence>
            {showMacNotice && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  border: `1px solid ${theme === 'light' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(245, 158, 11, 0.2)'}`,
                  borderRadius: 2,
                  padding: '16px 20px',
                  background: theme === 'light' ? 'rgba(255, 251, 235, 0.8)' : 'rgba(245, 158, 11, 0.04)',
                }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <AlertTriangle size={18} style={{ color: theme === 'light' ? '#b45309' : '#fbbf24', flexShrink: 0, marginTop: 1 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: FONT.mono, fontSize: 12, lineHeight: 1.6 }}>
                      <p style={{ fontWeight: 700, color: theme === 'light' ? '#92400e' : '#fcd34d', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {t('deployment.macNotice.title')}
                      </p>
                      <p style={{ color: bp.muted }}>
                        {t('deployment.macNotice.desc')}
                      </p>
                      <code style={{
                        display: 'block',
                        padding: '8px 12px',
                        borderRadius: 2,
                        background: theme === 'light' ? 'rgba(254, 243, 199, 0.8)' : 'rgba(0, 0, 0, 0.3)',
                        color: theme === 'light' ? '#78350f' : '#fde68a',
                        fontSize: 11,
                        userSelect: 'all' as const,
                      }}>
                        {t('deployment.macNotice.command')}
                      </code>
                      <p style={{ color: bp.muted, fontSize: 11 }}>
                        {t('deployment.macNotice.alternative')}
                      </p>
                      <p style={{ color: bp.muted, fontSize: 11 }}>
                        {t('deployment.macNotice.sequoia')}
                      </p>
                      <a
                        href="https://support.apple.com/en-us/102445"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          color: theme === 'light' ? '#b45309' : '#fbbf24',
                          fontSize: 11, textDecoration: 'none',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
                      >
                        {t('deployment.macNotice.whyLink')} <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ fontFamily: FONT.body, fontSize: 13, color: bp.muted, textAlign: 'center', marginTop: 20 }}
        >
          {t('deployment.docsNote')}{' '}
          <a href={`${DOCS_URL}/guide/getting-started`} target="_blank" rel="noopener noreferrer" style={{ color: bp.cyan, textDecoration: 'none' }}>
            {t('deployment.docsLink')}
          </a>{' '}
          {t('deployment.docsMid')}{' '}
          <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" style={{ color: bp.cyan, textDecoration: 'none' }}>
            {t('deployment.docsFullLink')}
          </a>.
        </motion.p>
      </section>

      {/* ================================================================= */}
      {/* PRICING / ENTERPRISE INTEREST                                     */}
      {/* ================================================================= */}

      <section id="bp-pricing" style={{ padding: '60px 24px 0', maxWidth: 900, margin: '0 auto', scrollMarginTop: 92 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            border: `1px solid ${bp.cardBorder}`,
            borderRadius: 2,
            padding: '24px 28px',
            background: bp.cardBg,
            textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: FONT.mono, fontSize: 11, color: bp.cyan, letterSpacing: '0.08em', marginBottom: 8 }}>
            {t('pricing.label')}
          </p>
          <p style={{ fontFamily: FONT.body, fontSize: 15, lineHeight: 1.7, color: bp.text, marginBottom: 4 }}>
            {t('pricing.free')}
          </p>
          <p style={{ fontFamily: FONT.body, fontSize: 13, lineHeight: 1.7, color: bp.muted }}>
            {t('pricing.enterprise')}{' '}
            <Link
              to={`/${safeLocale}/contact`}
              style={{ color: bp.cyan, textDecoration: 'none', fontWeight: 600 }}
            >
              {t('pricing.contact')} &rarr;
            </Link>
          </p>
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* FAQ                                                               */}
      {/* ================================================================= */}

      <section id="bp-section-d" style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto', scrollMarginTop: 92 }}>
        <SectionTitleBlock section={t('sectionD.section')} title={t('sectionD.title')} subtitle={t('sectionD.subtitle')} bp={bp} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqItems.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                style={{
                  background: bp.cardBg,
                  border: `1px solid ${isOpen ? bp.cyan : bp.cardBorder}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'border-color 0.25s',
                }}
              >
                <button
                  id={`faq-question-${i}`}
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: FONT.mono,
                    fontSize: 12,
                    fontWeight: 600,
                    color: isOpen ? bp.cyan : bp.text,
                    letterSpacing: '0.04em',
                    lineHeight: 1.5,
                    transition: 'color 0.2s',
                  }}
                >
                  <ChevronRight
                    size={14}
                    style={{
                      flexShrink: 0,
                      color: isOpen ? bp.cyan : bp.muted,
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s, color 0.2s',
                    }}
                  />
                  {item.q}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        fontFamily: FONT.body,
                        fontSize: 13,
                        lineHeight: 1.75,
                        color: bp.muted,
                        padding: '0 16px 14px 42px',
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

      {/* ================================================================= */}
      {/* FINAL CTA                                                         */}
      {/* ================================================================= */}

      <section style={{ padding: '60px 24px 40px', maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            border: `1px solid ${bp.cyan}33`,
            borderRadius: 2,
            padding: '40px 32px',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${bp.cardBg}, ${bp.bg})`,
          }}
        >
          <p style={{ fontFamily: FONT.mono, fontSize: 10, color: bp.cyan, letterSpacing: '0.12em', marginBottom: 12 }}>
            {t('cta.label')}
          </p>
          <p style={{ fontFamily: FONT.heading, fontSize: 24, fontWeight: 700, color: bp.text, marginBottom: 8 }}>
            {t('cta.title')}
          </p>
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: bp.muted, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
            {t('cta.subtitle')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="#deployment"
              onClick={(e) => scrollToSection('deployment', e)}
              style={{
                fontFamily: FONT.mono,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: bp.bg,
                background: bp.cyan,
                padding: '10px 28px',
                borderRadius: 2,
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
                  fontFamily: FONT.mono,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: bp.text,
                  background: 'none',
                  border: `1px solid ${bp.cardBorder}`,
                  padding: '10px 28px',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = bp.cyan; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = bp.cardBorder; }}
              >
                {t('cta.starGithub')}
              </button>
            ) : (
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: bp.text,
                  background: 'none',
                  border: `1px solid ${bp.cardBorder}`,
                  padding: '10px 28px',
                  borderRadius: 2,
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = bp.cyan; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = bp.cardBorder; }}
              >
                {t('cta.viewSource')}
              </a>
            )}
          </div>
        </motion.div>
      </section>

      </main>

      {/* ================================================================= */}
      {/* FOOTER                                                            */}
      {/* ================================================================= */}

      <footer style={{ padding: '60px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ border: `1px solid ${bp.cardBorder}`, borderRadius: 2, display: 'flex', fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.06em', overflow: 'hidden' }}
        >
          {[
            { text: t('footer.sciorex'), bold: true },
            { text: version ? `v${version}` : t('footer.revision') },
            { text: t('footer.copyright', { year: new Date().getFullYear() }) },
            { text: t('footer.mcpTools') },
          ].map((cell, i) => (
            <div key={i} style={{ padding: '10px 20px', color: cell.bold ? bp.text : bp.muted, fontWeight: cell.bold ? 700 : 400, borderRight: i < 3 ? `1px solid ${bp.cardBorder}` : undefined }}>
              {cell.text}
            </div>
          ))}
        </motion.div>

        <div style={{ display: 'flex', gap: 24, fontFamily: FONT.mono, fontSize: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {isGitHubSciorexUrl(REPO_URL) ? (
            <button
              onClick={() => openModal(REPO_URL)}
              style={{ color: bp.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.04em', transition: 'color 0.2s ease', padding: 0 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = bp.cyan; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = bp.muted; }}
            >
              {t('footer.github')}
            </button>
          ) : (
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" style={{ color: bp.muted, textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s ease' }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = bp.cyan; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = bp.muted; }}>{t('footer.github')}</a>
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
              style={{ color: bp.muted, textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = bp.cyan; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = bp.muted; }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 24, fontFamily: FONT.mono, fontSize: 11, letterSpacing: '0.04em', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: t('footer.docs'), to: DOCS_URL, external: true },
            { label: t('footer.blog'), to: `/${safeLocale}/blog` },
            { label: t('footer.contact'), to: `/${safeLocale}/contact` },
            { label: t('footer.about'), to: `/${safeLocale}/about` },
            { label: t('footer.privacy'), to: `/${safeLocale}/privacy` },
            { label: t('footer.terms'), to: `/${safeLocale}/terms` },
          ].map((link) => (
            'external' in link ? (
              <a
                key={link.label}
                href={link.to}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: bp.muted, textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = bp.cyan; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = bp.muted; }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                style={{ color: bp.muted, textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = bp.cyan; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = bp.muted; }}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        <Link
          to={`/${safeLocale}/`}
          style={{ fontFamily: FONT.mono, fontSize: 11, color: bp.muted, textDecoration: 'none', letterSpacing: '0.04em', marginTop: 8 }}
        >
          &larr; {t('footer.returnToMain')}
        </Link>
      </footer>

      <Lightbox image={lightboxImage} alt={lightboxAlt} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
