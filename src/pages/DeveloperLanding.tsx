import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, ChevronRight, AlertTriangle, ExternalLink, Maximize2 } from 'lucide-react';
import ThemeImage from '../components/ThemeImage';
import Lightbox from '../components/Lightbox';
import SEO from '../components/SEO';
import { useTheme } from '../context/ThemeContext';
import { DOWNLOAD_BASE_URL, REPO_URL, DISCORD_URL, TWITTER_URL, DOCS_URL, config } from '../config/urls';
import { useGitHubMigration } from '../context/GitHubMigrationContext';
import { getVersionJsonUrl } from '@sciorex/shared-config';

// ---------------------------------------------------------------------------
// Design Tokens — Noir Editorial palette (scoped to this page)
// ---------------------------------------------------------------------------

type NoirPalette = {
  bgDeep: string;
  bgPanelRight: string;
  ivory: string;
  muted: string;
  gold: string;
  goldDim: string;
  goldGlow: string;
  borderSubtle: string;
  borderGold: string;
  screenshotShadow: string;
};

function getNoir(theme: 'dark' | 'light'): NoirPalette {
  if (theme === 'light') {
    return {
      bgDeep: '#f7f5f0',
      bgPanelRight: '#edeae4',
      ivory: '#1a1714',
      muted: '#5c574e',
      gold: '#9e7038',
      goldDim: 'rgba(158, 112, 56, 0.30)',
      goldGlow: 'rgba(158, 112, 56, 0.08)',
      borderSubtle: 'rgba(0, 0, 0, 0.08)',
      borderGold: 'rgba(158, 112, 56, 0.18)',
      screenshotShadow: '0 4px 40px rgba(0,0,0,0.10), 0 12px 32px rgba(0,0,0,0.06)',
    };
  }
  return {
    bgDeep: '#0a0a0e',
    bgPanelRight: '#050507',
    ivory: '#f0ece2',
    muted: '#918d85',
    gold: '#c8935a',
    goldDim: 'rgba(200, 147, 90, 0.30)',
    goldGlow: 'rgba(200, 147, 90, 0.12)',
    borderSubtle: 'rgba(255, 255, 255, 0.06)',
    borderGold: 'rgba(200, 147, 90, 0.15)',
    screenshotShadow: '0 0 80px rgba(200,147,90,0.12), 0 20px 60px rgba(0,0,0,0.6)',
  };
}

const FONT = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'Work Sans', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

// ---------------------------------------------------------------------------
// Section screenshot mappings
// ---------------------------------------------------------------------------

const SECTION_SCREENSHOTS: string[][] = [
  ['hero-dashboard.png'],
  ['chat-view.png', 'showcase-chat.png'],
  ['agentic-preview.png', 'showcase-agentic.png'],
  ['agents-view.png', 'chat-council.png'],
  ['flow-edition-view.png', 'flow-run-view.png'],
  ['showcase-flow.png', 'showcase-execution.png'],
  ['editor-view.png', 'browser-preview.png'],
  ['worktree-view.png', 'showcase-worktree.png', 'editor-git-view.png'],
  ['kanban-view.png', 'ticket-description.png', 'epics-view.png'],
  ['showcase-execution.png'],
  ['settings-clis.png'],
  ['latex-editor.png'],
  ['hero-dashboard.png'],
];

const TOTAL_SECTIONS = SECTION_SCREENSHOTS.length;

// ---------------------------------------------------------------------------
// Injected CSS for pseudo-elements
// ---------------------------------------------------------------------------

const STYLE_ID = 'developer-noir-styles';

function injectNoirStyles(gold: string) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = `
    .noir-drop-cap::first-letter {
      font-family: ${FONT.serif};
      font-size: 62px;
      font-weight: 600;
      color: ${gold};
      float: left;
      line-height: 0.78;
      margin-right: 8px;
      margin-top: 6px;
    }
    .noir-section-reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .noir-section-reveal.in-view {
      opacity: 1;
      transform: translateY(0);
    }
    .noir-number-reveal {
      opacity: 0;
      transform: translateX(-20px);
      transition: opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s;
    }
    .noir-number-reveal.in-view {
      opacity: 1;
      transform: translateX(0);
    }
  `;
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function DeveloperLanding() {
  const { locale } = useParams<{ locale: string }>();
  const { t, i18n } = useTranslation('developer');
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { openModal, isGitHubSciorexUrl } = useGitHubMigration();

  const noir = getNoir(theme);
  const safeLocale = locale && ['en', 'es'].includes(locale) ? locale : 'en';

  const [activeSection, setActiveSection] = useState(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState('');
  const [showMacNotice, setShowMacNotice] = useState(() => /Macintosh/.test(navigator.userAgent));
  const [version, setVersion] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const activeSectionRef = useRef(0);
  const currentImageIdxRef = useRef(0);

  activeSectionRef.current = activeSection;
  currentImageIdxRef.current = currentImageIdx;

  const currentFiles = SECTION_SCREENSHOTS[activeSection] || [];

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxImage(src);
    setLightboxAlt(alt);
  }, []);

  const switchLocale = (code: string) => {
    if (code !== safeLocale) {
      i18n.changeLanguage(code);
      const rest = location.pathname.split('/').filter(Boolean).slice(1).join('/');
      navigate(`/${code}/${rest}${location.hash}`);
    }
  };

  // Inject/update CSS when theme changes
  useEffect(() => {
    injectNoirStyles(noir.gold);
    return () => {
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    };
  }, [noir.gold]);

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
      } catch { /* version just won't show */ }
    })();
    return () => { controller.abort(); };
  }, []);

  // IntersectionObserver — reveal animations only
  useEffect(() => {
    const sections = sectionRefs.current.filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.noir-section-reveal, .noir-number-reveal').forEach((el) => {
              el.classList.add('in-view');
            });
          }
        });
      },
      { threshold: 0.15 },
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // Scroll-based active section tracking (stable, no flip-flop)
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const target = window.innerHeight * 0.38;
      let closestIdx = 0;
      let closestDist = Infinity;

      sectionRefs.current.forEach((sec, i) => {
        if (!sec) return;
        const rect = sec.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - target);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });

      if (closestIdx !== activeSectionRef.current) {
        setActiveSection(closestIdx);
        setCurrentImageIdx(0);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount to set initial state
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToSection = (idx: number) => {
    if (idx >= 0 && idx < TOTAL_SECTIONS) {
      if (idx === 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const idx = activeSectionRef.current;
      const imgIdx = currentImageIdxRef.current;
      const files = SECTION_SCREENSHOTS[idx] || [];

      if (e.key === 'ArrowDown' && idx < TOTAL_SECTIONS - 1) {
        e.preventDefault();
        goToSection(idx + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToSection(idx === 0 ? 0 : idx - 1);
      } else if (e.key === 'ArrowRight' && files.length > 1) {
        setCurrentImageIdx((imgIdx + 1) % files.length);
      } else if (e.key === 'ArrowLeft' && files.length > 1) {
        setCurrentImageIdx((imgIdx - 1 + files.length) % files.length);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToDownload = (e?: React.MouseEvent) => {
    e?.preventDefault();
    sectionRefs.current[12]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // i18n data
  const faqItems = t('faq', { returnObjects: true }) as { q: string; a: string }[];
  const seoFaqItems = faqItems.map((item) => ({ question: item.q, answer: item.a }));
  const mcpBlocks = t('sectionC.blocks', { returnObjects: true }) as { server: string; count: string; tools: string[] }[];
  const deployGroups = t('deployment.groups', { returnObjects: true }) as { os: string; items: { label: string; desc: string; file: string; size: string }[] }[];
  const heroStats = t('chapters.ch0.stats', { returnObjects: true }) as string[];
  const heroHighlights = t('chapters.ch0.highlights', { returnObjects: true }) as { label: string; desc: string }[];

  // Shared section style
  const sectionPad: React.CSSProperties = {
    padding: '80px 60px 80px 100px',
    position: 'relative',
    minHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderBottom: `1px solid ${noir.borderSubtle}`,
  };

  return (
    <div
      style={{
        background: noir.bgDeep,
        color: noir.muted,
        fontFamily: FONT.sans,
        fontWeight: 400,
        lineHeight: 1.7,
        overflowX: 'hidden',
        transition: 'background 0.4s ease, color 0.4s ease',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <SEO title={t('seo.title')} description={t('seo.description')} path="/developer" faqItems={seoFaqItems} />

      {/* ================================================================= */}
      {/* NAVIGATION BAR                                                     */}
      {/* ================================================================= */}

      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          background: theme === 'light' ? 'rgba(247,245,240,0.85)' : 'rgba(10,10,14,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${noir.borderGold}`,
          padding: '10px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'background 0.4s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to={`/${safeLocale}/`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT.mono, fontSize: 13, color: noir.ivory, textDecoration: 'none', letterSpacing: '0.06em', fontWeight: 600 }}>
            <img src="/logo.png" alt="" style={{ width: 22, height: 22, borderRadius: 5 }} />
            SCIOREX
          </Link>
          <Link to={`/${safeLocale}/`} style={{ fontFamily: FONT.mono, fontSize: 12, color: noir.gold, textDecoration: 'none', letterSpacing: '0.04em' }}>
            &larr; {t('nav.back')}
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', border: `1px solid ${noir.borderGold}`, borderRadius: 2 }}>
            {(['en', 'es'] as const).map((code, i) => (
              <button
                key={code}
                onClick={() => switchLocale(code)}
                style={{
                  background: safeLocale === code ? noir.gold : 'transparent',
                  border: 'none', borderLeft: i > 0 ? `1px solid ${noir.borderGold}` : 'none',
                  padding: '4px 10px', fontSize: 11, fontFamily: FONT.mono,
                  fontWeight: safeLocale === code ? 700 : 400,
                  color: safeLocale === code ? noir.bgDeep : noir.gold,
                  cursor: 'pointer', letterSpacing: '0.04em', transition: 'background 0.2s, color 0.2s',
                }}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: 34, height: 34, border: `1px solid ${noir.borderGold}`, borderRadius: '50%',
              background: 'transparent', color: noir.gold, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s, color 0.3s', flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = noir.gold; e.currentTarget.style.color = noir.bgDeep; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = noir.gold; }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={scrollToDownload}
            className="max-sm:hidden"
            style={{
              fontFamily: FONT.mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
              color: noir.bgDeep, background: noir.gold, padding: '6px 16px',
              borderRadius: 2, border: 'none', cursor: 'pointer', transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            {t('nav.download')}
          </button>
        </div>
      </nav>

      {/* ================================================================= */}
      {/* PROGRESS TRACKER (desktop only)                                    */}
      {/* ================================================================= */}

      <nav
        className="hidden lg:flex"
        aria-label="Section progress"
        style={{
          position: 'fixed', left: 0, top: 0, width: 40, height: '100vh', zIndex: 100,
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'absolute', left: '50%', top: '10%', bottom: '10%', width: 1, background: 'rgba(200,147,90,0.20)', transform: 'translateX(-50%)' }} />

        {Array.from({ length: TOTAL_SECTIONS }).map((_, i) => {
          const isActive = i === activeSection;
          const label = i === 0 ? 'Overview' : i === 12 ? t('deployment.title') : t(`chapters.ch${i}.title`);
          return (
            <div
              key={i}
              className="group"
              onClick={() => goToSection(i)}
              style={{
                position: 'relative', width: isActive ? 11 : 8, height: isActive ? 11 : 8,
                margin: '12px 0', cursor: 'pointer', pointerEvents: 'all',
                transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)', zIndex: 2,
              }}
            >
              <div
                style={{
                  position: 'absolute', inset: 0,
                  background: isActive ? noir.gold : 'transparent',
                  border: `1px solid ${isActive ? noir.gold : 'rgba(200,147,90,0.35)'}`,
                  transform: 'rotate(45deg)',
                  transition: 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                  boxShadow: isActive ? '0 0 12px rgba(200,147,90,0.4)' : 'none',
                }}
              />
              <div
                className={`${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}
                style={{
                  position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%)',
                  whiteSpace: 'nowrap', pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: FONT.mono, fontSize: 10, letterSpacing: '0.06em',
                    color: isActive ? noir.gold : noir.muted,
                    background: theme === 'light' ? 'rgba(247,245,240,0.92)' : 'rgba(10,10,14,0.92)',
                    backdropFilter: 'blur(6px)',
                    padding: '3px 8px', borderRadius: 3,
                    border: `1px solid ${isActive ? noir.borderGold : noir.borderSubtle}`,
                    transition: 'color 0.3s, border-color 0.3s',
                  }}
                >
                  {String(i).padStart(2, '0')} {label}
                </span>
              </div>
            </div>
          );
        })}
      </nav>

      {/* ================================================================= */}
      {/* MAIN LAYOUT — SPLIT PANELS                                        */}
      {/* ================================================================= */}

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>

        {/* LEFT PANEL — Scrollable editorial content */}
        <main className="w-full lg:w-[42%]" style={{ position: 'relative', zIndex: 2, minHeight: '100vh' }}>

          {/* ---- SECTION 0: HERO ---- */}
          <section
            ref={(el) => { sectionRefs.current[0] = el; }}
            data-section="0"
            className="max-lg:!min-h-0 max-lg:!p-[48px_24px]"
            style={{ ...sectionPad, minHeight: '100vh', paddingTop: 120, paddingBottom: 120 }}
          >
            <div className="noir-section-reveal in-view">
              <div style={{ fontFamily: FONT.serif, fontSize: 64, fontWeight: 400, color: noir.gold, letterSpacing: '0.3em', marginBottom: 16, lineHeight: 1 }}>
                {t('hero.title')}
              </div>
              <div style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 22, fontWeight: 400, color: noir.ivory, marginBottom: 40, letterSpacing: '0.04em', opacity: 0.85 }}>
                {t('chapters.ch0.tagline')}
              </div>
              <p style={{ fontFamily: FONT.sans, fontSize: '15.5px', color: noir.muted, lineHeight: 1.85, maxWidth: 520, marginBottom: 48 }}>
                {t('chapters.ch0.body')}
              </p>
              <div style={{ fontFamily: FONT.mono, fontSize: 12, color: noir.gold, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 40 }}>
                {heroStats.map((stat, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ margin: '0 8px', opacity: 0.35 }}>&middot;</span>}
                    {stat}
                  </span>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 32px', maxWidth: 560 }} className="max-sm:!grid-cols-1">
                {heroHighlights.map((h, i) => (
                  <div key={i} style={{ borderLeft: `2px solid ${noir.borderGold}`, paddingLeft: 12 }}>
                    <div style={{ fontFamily: FONT.mono, fontSize: 11, fontWeight: 600, color: noir.gold, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
                      {h.label}
                    </div>
                    <div style={{ fontFamily: FONT.sans, fontSize: 12.5, color: noir.muted, lineHeight: 1.5, opacity: 0.75 }}>
                      {h.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:hidden" style={{ marginTop: 28 }}>
              <div className="group" onClick={() => openLightbox('hero-dashboard.png', 'Sciorex')} style={{ position: 'relative', cursor: 'zoom-in', borderRadius: 10, overflow: 'hidden', boxShadow: `0 0 40px ${noir.goldGlow}, 0 10px 30px rgba(0,0,0,0.5)` }}>
                <ThemeImage name="hero-dashboard.png" alt="Sciorex dashboard" className="w-full block" />
                <div className="opacity-0 group-hover:opacity-70 transition-opacity duration-200" style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 6, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ece2', pointerEvents: 'none' }}>
                  <Maximize2 size={14} />
                </div>
              </div>
            </div>
          </section>

          {/* ---- SECTIONS 1–9: FEATURE CHAPTERS ---- */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
            const chKey = `chapters.ch${idx}`;
            const specs = t(`${chKey}.specs`, { returnObjects: true }) as { label: string; value: string }[];
            const screenshots = SECTION_SCREENSHOTS[idx];

            return (
              <section
                key={idx}
                ref={(el) => { sectionRefs.current[idx] = el; }}
                data-section={idx}
                className="max-lg:!min-h-0 max-lg:!p-[48px_24px]"
                style={sectionPad}
              >
                <div className="noir-number-reveal" style={{ position: 'absolute', top: 60, left: 60, fontFamily: FONT.serif, fontSize: 110, fontWeight: 300, color: noir.goldDim, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>
                  {String(idx).padStart(2, '0')}
                </div>

                <div className="noir-section-reveal" style={{ position: 'relative', zIndex: 1 }}>
                  <h2 style={{ fontFamily: FONT.serif, fontSize: 40, fontWeight: 500, color: noir.ivory, lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 28 }}>
                    {t(`${chKey}.title`)}
                  </h2>
                  <p className="noir-drop-cap" style={{ fontFamily: FONT.sans, fontSize: '15.5px', fontWeight: 400, color: noir.muted, lineHeight: 1.8, maxWidth: 560, marginBottom: 36 }}>
                    {t(`${chKey}.body`)}
                  </p>

                  <div style={{ width: '100%', maxWidth: 520 }}>
                    {specs.map((spec, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'baseline', padding: '11px 0', borderBottom: si < specs.length - 1 ? `1px solid ${noir.borderSubtle}` : 'none', gap: 16 }}>
                        <span style={{ fontFamily: FONT.mono, fontSize: 11, fontWeight: 500, color: noir.gold, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', minWidth: 90, flexShrink: 0 }}>
                          {spec.label}
                        </span>
                        <span style={{ fontFamily: FONT.sans, fontSize: '13.5px', color: noir.ivory, opacity: 0.7, lineHeight: 1.55 }}>
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:hidden" style={{ marginTop: 28 }}>
                  {screenshots.map((s) => (
                    <div key={s} className="group" onClick={() => openLightbox(s, t(`${chKey}.title`))} style={{ position: 'relative', cursor: 'zoom-in', borderRadius: 10, overflow: 'hidden', boxShadow: `0 0 40px ${noir.goldGlow}, 0 10px 30px rgba(0,0,0,0.5)` }}>
                      <ThemeImage name={s} alt={t(`${chKey}.title`)} className="w-full block" />
                      <div className="opacity-0 group-hover:opacity-70 transition-opacity duration-200" style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 6, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ece2', pointerEvents: 'none' }}>
                        <Maximize2 size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* ---- SECTION 10: MCP PROTOCOL ---- */}
          <section
            ref={(el) => { sectionRefs.current[10] = el; }}
            data-section="10"
            className="max-lg:!min-h-0 max-lg:!p-[48px_24px]"
            style={sectionPad}
          >
            <div className="noir-number-reveal" style={{ position: 'absolute', top: 60, left: 60, fontFamily: FONT.serif, fontSize: 110, fontWeight: 300, color: noir.goldDim, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>10</div>
            <div className="noir-section-reveal" style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: FONT.serif, fontSize: 40, fontWeight: 500, color: noir.ivory, lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 28 }}>
                {t('chapters.ch10.title')}
              </h2>
              <p className="noir-drop-cap" style={{ fontFamily: FONT.sans, fontSize: '15.5px', color: noir.muted, lineHeight: 1.8, maxWidth: 560, marginBottom: 36 }}>
                {t('chapters.ch10.body')}
              </p>
              <div style={{ width: '100%', maxWidth: 540, marginTop: 12 }}>
                {mcpBlocks.map((block, bi) => (
                  <div key={bi} style={{ display: 'grid', gridTemplateColumns: '100px 50px 1fr', gap: 12, padding: '10px 0', borderBottom: bi < mcpBlocks.length - 1 ? `1px solid ${noir.borderSubtle}` : 'none', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 500, color: noir.gold, letterSpacing: '0.04em' }}>
                      {block.server.split(' ')[0]}
                    </span>
                    <span style={{ fontFamily: FONT.mono, fontSize: 12, color: noir.ivory, opacity: 0.6, textAlign: 'center' }}>
                      {block.count.split(' ')[0]}
                    </span>
                    <span style={{ fontFamily: FONT.sans, fontSize: 13, color: noir.muted, lineHeight: 1.5 }}>
                      {block.tools[0]?.split(' \u2014 ')[1] || block.tools[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:hidden" style={{ marginTop: 28 }}>
              <div className="group" onClick={() => openLightbox('settings-clis.png', t('chapters.ch10.title'))} style={{ position: 'relative', cursor: 'zoom-in', borderRadius: 10, overflow: 'hidden', boxShadow: `0 0 40px ${noir.goldGlow}, 0 10px 30px rgba(0,0,0,0.5)` }}>
                <ThemeImage name="settings-clis.png" alt={t('chapters.ch10.title')} className="w-full block" />
                <div className="opacity-0 group-hover:opacity-70 transition-opacity duration-200" style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 6, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ece2', pointerEvents: 'none' }}>
                  <Maximize2 size={14} />
                </div>
              </div>
            </div>
          </section>

          {/* ---- SECTION 11: RESEARCH SUITE ---- */}
          <section
            ref={(el) => { sectionRefs.current[11] = el; }}
            data-section="11"
            className="max-lg:!min-h-0 max-lg:!p-[48px_24px]"
            style={sectionPad}
          >
            <div className="noir-number-reveal" style={{ position: 'absolute', top: 60, left: 60, fontFamily: FONT.serif, fontSize: 110, fontWeight: 300, color: noir.goldDim, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', zIndex: 0 }}>11</div>
            <div className="noir-section-reveal" style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: FONT.serif, fontSize: 40, fontWeight: 500, color: noir.ivory, lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 28 }}>
                {t('chapters.ch11.title')}
              </h2>
              <p style={{ fontFamily: FONT.sans, fontSize: 15, color: noir.muted, lineHeight: 1.8, maxWidth: 560, marginBottom: 28 }}>
                {t('chapters.ch11.body')}
              </p>
              <p style={{ fontFamily: FONT.mono, fontSize: '11.5px', color: noir.muted, opacity: 0.7, letterSpacing: '0.06em' }}>
                {t('chapters.ch11.briefSpecs')}
              </p>
            </div>
            <div className="lg:hidden" style={{ marginTop: 28 }}>
              <div className="group" onClick={() => openLightbox('latex-editor.png', t('chapters.ch11.title'))} style={{ position: 'relative', cursor: 'zoom-in', borderRadius: 10, overflow: 'hidden', boxShadow: `0 0 40px ${noir.goldGlow}, 0 10px 30px rgba(0,0,0,0.5)` }}>
                <ThemeImage name="latex-editor.png" alt={t('chapters.ch11.title')} className="w-full block" />
                <div className="opacity-0 group-hover:opacity-70 transition-opacity duration-200" style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 6, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ece2', pointerEvents: 'none' }}>
                  <Maximize2 size={14} />
                </div>
              </div>
            </div>
          </section>

          {/* ---- SECTION 12: DOWNLOAD ---- */}
          <section
            ref={(el) => { sectionRefs.current[12] = el; }}
            data-section="12"
            className="max-lg:!min-h-0 max-lg:!p-[48px_24px]"
            style={{ ...sectionPad, minHeight: 'auto', paddingTop: 100, paddingBottom: 80 }}
          >
            <div className="noir-section-reveal" style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontFamily: FONT.serif, fontSize: 40, fontWeight: 500, color: noir.ivory, lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 12 }}>
                {t('deployment.title')}
              </h2>
              <p style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 20, color: noir.muted, marginBottom: 48, letterSpacing: '0.04em' }}>
                {t('chapters.ch12.tagline')}
              </p>

              <div className="max-sm:!grid-cols-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28, marginBottom: 56, maxWidth: 560 }}>
                {deployGroups.map((group) => (
                  <div key={group.os}>
                    <h4 style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 600, color: noir.ivory, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                      {group.os}
                    </h4>
                    {group.items.map((item) => (
                      <div key={item.file}>
                        <a
                          href={`${DOWNLOAD_BASE_URL}/${item.file}`}
                          onClick={() => { if (group.os === 'MACOS') setShowMacNotice(true); }}
                          style={{
                            display: 'block', padding: '9px 0', fontFamily: FONT.mono, fontSize: 11,
                            color: noir.gold, border: `1px solid ${noir.goldDim}`, borderRadius: 4,
                            textAlign: 'center', marginBottom: 8, textDecoration: 'none',
                            letterSpacing: '0.04em', transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = noir.gold; e.currentTarget.style.color = noir.bgDeep; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = noir.gold; }}
                        >
                          {item.label}
                        </a>
                        <span style={{ fontFamily: FONT.mono, fontSize: 10, color: noir.muted, opacity: 0.5, textAlign: 'center', display: 'block', marginBottom: 12 }}>
                          {item.size}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* macOS Warning */}
              <AnimatePresence>
                {showMacNotice && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ overflow: 'hidden', maxWidth: 560 }}
                  >
                    <div style={{
                      border: `1px solid ${theme === 'light' ? 'rgba(217,119,6,0.3)' : 'rgba(245,158,11,0.2)'}`,
                      borderRadius: 4, padding: '16px 20px',
                      background: theme === 'light' ? 'rgba(255,251,235,0.8)' : 'rgba(245,158,11,0.04)',
                    }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <AlertTriangle size={18} style={{ color: theme === 'light' ? '#b45309' : '#fbbf24', flexShrink: 0, marginTop: 1 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: FONT.mono, fontSize: 12, lineHeight: 1.6 }}>
                          <p style={{ fontWeight: 700, color: theme === 'light' ? '#92400e' : '#fcd34d', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t('deployment.macNotice.title')}</p>
                          <p style={{ color: noir.muted }}>{t('deployment.macNotice.desc')}</p>
                          <code style={{ display: 'block', padding: '8px 12px', borderRadius: 2, background: theme === 'light' ? 'rgba(254,243,199,0.8)' : 'rgba(0,0,0,0.3)', color: theme === 'light' ? '#78350f' : '#fde68a', fontSize: 11, userSelect: 'all' as const }}>{t('deployment.macNotice.command')}</code>
                          <p style={{ color: noir.muted, fontSize: 11 }}>{t('deployment.macNotice.alternative')}</p>
                          <p style={{ color: noir.muted, fontSize: 11 }}>{t('deployment.macNotice.sequoia')}</p>
                          <a href="https://support.apple.com/en-us/102445" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: theme === 'light' ? '#b45309' : '#fbbf24', fontSize: 11, textDecoration: 'none' }}>
                            {t('deployment.macNotice.whyLink')} <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p style={{ fontFamily: FONT.sans, fontSize: 13, color: noir.muted, marginBottom: 20 }}>
                {t('deployment.docsNote')}{' '}
                <a href={`${DOCS_URL}/guide/getting-started`} target="_blank" rel="noopener noreferrer" style={{ color: noir.gold, textDecoration: 'none' }}>{t('deployment.docsLink')}</a>{' '}
                {t('deployment.docsMid')}{' '}
                <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" style={{ color: noir.gold, textDecoration: 'none' }}>{t('deployment.docsFullLink')}</a>.
              </p>

              <p style={{ fontFamily: FONT.mono, fontSize: 11, color: noir.muted, opacity: 0.4, letterSpacing: '0.08em' }}>
                SCIOREX {version ? `v${version}` : 'v2.0'} &middot; {new Date().getFullYear()} &middot; 100% Local &middot; No Telemetry
              </p>
            </div>
          </section>
        </main>

        {/* RIGHT PANEL — Fixed screenshot viewer (desktop only) */}
        <aside
          className="hidden lg:flex"
          style={{
            width: '58%', height: '100vh', position: 'fixed', right: 0, top: 0, zIndex: 1,
            background: noir.bgPanelRight, alignItems: 'center', justifyContent: 'center',
            borderLeft: `1px solid ${noir.borderGold}`,
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
        >
          <div style={{ width: '88%', maxWidth: 820, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            {currentFiles[currentImageIdx] && (
              <div
                className="group"
                onClick={() => openLightbox(currentFiles[currentImageIdx], activeSection >= 1 && activeSection <= 11 ? t(`chapters.ch${activeSection}.title`) : 'Sciorex')}
                style={{ position: 'relative', width: '100%', cursor: 'zoom-in', borderRadius: 12, overflow: 'hidden', boxShadow: noir.screenshotShadow, transition: 'box-shadow 0.4s ease' }}
              >
                <ThemeImage
                  name={currentFiles[currentImageIdx]}
                  alt={activeSection >= 1 && activeSection <= 11 ? t(`chapters.ch${activeSection}.title`) : 'Sciorex'}
                  className="w-full block"
                />
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 8, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ece2', pointerEvents: 'none' }}
                >
                  <Maximize2 size={16} />
                </div>
              </div>
            )}
            {currentFiles.length > 1 && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                {currentFiles.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIdx(i)}
                    aria-label={`Screenshot ${i + 1}`}
                    style={{
                      width: 8, height: 8, borderRadius: '50%', padding: 0,
                      border: `1px solid ${i === currentImageIdx ? noir.gold : noir.goldDim}`,
                      background: i === currentImageIdx ? noir.gold : 'transparent',
                      cursor: 'pointer', transition: 'all 0.25s ease',
                      boxShadow: i === currentImageIdx ? '0 0 8px rgba(200,147,90,0.35)' : 'none',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ================================================================= */}
      {/* FULL-WIDTH SECTIONS (below split layout)                          */}
      {/* ================================================================= */}

      <div style={{ position: 'relative', zIndex: 3, background: noir.bgDeep }}>

        {/* Pricing */}
        <section style={{ padding: '60px 24px 0', maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
            style={{ border: `1px solid ${noir.borderGold}`, borderRadius: 4, padding: '28px 32px', textAlign: 'center' }}
          >
            <p style={{ fontFamily: FONT.mono, fontSize: 11, color: noir.gold, letterSpacing: '0.08em', marginBottom: 8 }}>{t('pricing.label')}</p>
            <p style={{ fontFamily: FONT.serif, fontSize: 18, color: noir.ivory, marginBottom: 4 }}>{t('pricing.free')}</p>
            <p style={{ fontFamily: FONT.sans, fontSize: 13, color: noir.muted }}>
              {t('pricing.enterprise')}{' '}
              <Link to={`/${safeLocale}/contact`} style={{ color: noir.gold, textDecoration: 'none', fontWeight: 600 }}>{t('pricing.contact')} &rarr;</Link>
            </p>
          </motion.div>
        </section>

        {/* FAQ */}
        <section style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: FONT.serif, fontSize: 36, fontWeight: 500, color: noir.ivory, marginBottom: 32, letterSpacing: '-0.01em' }}>
            {t('sectionD.title')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.04 }}
                  style={{ border: `1px solid ${isOpen ? noir.gold : noir.borderSubtle}`, borderRadius: 4, overflow: 'hidden', transition: 'border-color 0.25s' }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px',
                      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                      fontFamily: FONT.mono, fontSize: 12, fontWeight: 600,
                      color: isOpen ? noir.gold : noir.ivory, letterSpacing: '0.04em', lineHeight: 1.5, transition: 'color 0.2s',
                    }}
                  >
                    <ChevronRight size={14} style={{ flexShrink: 0, color: isOpen ? noir.gold : noir.muted, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s, color 0.2s' }} />
                    {item.q}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                        <p style={{ fontFamily: FONT.sans, fontSize: 13, lineHeight: 1.75, color: noir.muted, padding: '0 16px 14px 42px' }}>{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '40px 24px', maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ border: `1px solid ${noir.borderGold}`, borderRadius: 4, padding: '40px 32px', textAlign: 'center' }}
          >
            <p style={{ fontFamily: FONT.mono, fontSize: 10, color: noir.gold, letterSpacing: '0.12em', marginBottom: 12 }}>{t('cta.label')}</p>
            <p style={{ fontFamily: FONT.serif, fontSize: 24, fontWeight: 500, color: noir.ivory, marginBottom: 8 }}>{t('cta.title')}</p>
            <p style={{ fontFamily: FONT.sans, fontSize: 14, color: noir.muted, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>{t('cta.subtitle')}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={scrollToDownload}
                style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: noir.bgDeep, background: noir.gold, padding: '10px 28px', borderRadius: 4, border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                {t('cta.download')}
              </button>
              {isGitHubSciorexUrl(REPO_URL) ? (
                <button
                  onClick={() => openModal(REPO_URL)}
                  style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: noir.ivory, background: 'none', border: `1px solid ${noir.borderGold}`, padding: '10px 28px', borderRadius: 4, cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = noir.gold; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = noir.borderGold; }}
                >
                  {t('cta.starGithub')}
                </button>
              ) : (
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', color: noir.ivory, background: 'none', border: `1px solid ${noir.borderGold}`, padding: '10px 28px', borderRadius: 4, textDecoration: 'none', transition: 'border-color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = noir.gold; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = noir.borderGold; }}
                >
                  {t('cta.viewSource')}
                </a>
              )}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '60px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ border: `1px solid ${noir.borderSubtle}`, borderRadius: 2, display: 'flex', fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.06em', overflow: 'hidden', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { text: t('footer.sciorex'), bold: true },
              { text: version ? `v${version}` : t('footer.revision') },
              { text: t('footer.copyright', { year: new Date().getFullYear() }) },
            ].map((cell, i, arr) => (
              <div key={i} style={{ padding: '10px 20px', color: cell.bold ? noir.ivory : noir.muted, fontWeight: cell.bold ? 700 : 400, borderRight: i < arr.length - 1 ? `1px solid ${noir.borderSubtle}` : undefined }}>
                {cell.text}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 24, fontFamily: FONT.mono, fontSize: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {isGitHubSciorexUrl(REPO_URL) ? (
              <button onClick={() => openModal(REPO_URL)} style={{ color: noir.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.04em', transition: 'color 0.2s', padding: 0 }} onMouseEnter={(e) => { e.currentTarget.style.color = noir.gold; }} onMouseLeave={(e) => { e.currentTarget.style.color = noir.muted; }}>
                {t('footer.github')}
              </button>
            ) : (
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" style={{ color: noir.muted, textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = noir.gold; }} onMouseLeave={(e) => { e.currentTarget.style.color = noir.muted; }}>{t('footer.github')}</a>
            )}
            {[
              { label: t('footer.discord'), href: DISCORD_URL },
              { label: t('footer.twitter'), href: TWITTER_URL },
              { label: t('footer.youtube'), href: 'https://www.youtube.com/@SciorexApp' },
            ].map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{ color: noir.muted, textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = noir.gold; }} onMouseLeave={(e) => { e.currentTarget.style.color = noir.muted; }}>{link.label}</a>
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
            ].map((link) =>
              'external' in link ? (
                <a key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" style={{ color: noir.muted, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = noir.gold; }} onMouseLeave={(e) => { e.currentTarget.style.color = noir.muted; }}>{link.label}</a>
              ) : (
                <Link key={link.label} to={link.to} style={{ color: noir.muted, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = noir.gold; }} onMouseLeave={(e) => { e.currentTarget.style.color = noir.muted; }}>{link.label}</Link>
              ),
            )}
          </div>

          <Link to={`/${safeLocale}/`} style={{ fontFamily: FONT.mono, fontSize: 11, color: noir.muted, textDecoration: 'none', letterSpacing: '0.04em', marginTop: 8 }}>
            &larr; {t('footer.returnToMain')}
          </Link>
        </footer>
      </div>

      {/* ================================================================= */}
      {/* CHAPTER NAVIGATION — FIXED BOTTOM LEFT                            */}
      {/* ================================================================= */}

      <nav
        className="max-lg:!left-4"
        style={{
          position: 'fixed', bottom: 32, left: 56, zIndex: 150,
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: FONT.mono, fontSize: 12, letterSpacing: '0.06em', color: noir.muted,
          transition: 'color 0.4s ease',
        }}
      >
        <button
          onClick={() => goToSection(activeSection === 0 ? 0 : activeSection - 1)}
          aria-label="Previous chapter"
          style={{
            width: 32, height: 32, border: `1px solid ${noir.borderGold}`, borderRadius: 4,
            background: noir.bgDeep, color: noir.gold, fontFamily: FONT.mono, fontSize: 14,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s ease',
            padding: 0, lineHeight: 1,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = noir.gold; e.currentTarget.style.color = noir.bgDeep; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = noir.bgDeep; e.currentTarget.style.color = noir.gold; }}
        >
          &#8592;
        </button>
        <span style={{ minWidth: 52, textAlign: 'center', color: noir.gold, opacity: 0.7 }}>
          {String(activeSection).padStart(2, '0')} / {String(TOTAL_SECTIONS - 1).padStart(2, '0')}
        </span>
        <button
          onClick={() => goToSection(activeSection + 1)}
          disabled={activeSection >= TOTAL_SECTIONS - 1}
          aria-label="Next chapter"
          style={{
            width: 32, height: 32, border: `1px solid ${noir.borderGold}`, borderRadius: 4,
            background: noir.bgDeep, color: noir.gold, fontFamily: FONT.mono, fontSize: 14,
            cursor: activeSection >= TOTAL_SECTIONS - 1 ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s ease', opacity: activeSection >= TOTAL_SECTIONS - 1 ? 0.25 : 1,
            padding: 0, lineHeight: 1,
          }}
          onMouseEnter={(e) => { if (activeSection < TOTAL_SECTIONS - 1) { e.currentTarget.style.background = noir.gold; e.currentTarget.style.color = noir.bgDeep; } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = noir.bgDeep; e.currentTarget.style.color = noir.gold; }}
        >
          &#8594;
        </button>
      </nav>

      <Lightbox image={lightboxImage} alt={lightboxAlt} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
