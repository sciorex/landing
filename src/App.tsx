import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy, Component } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollHandler from './components/ScrollHandler';

// Lazy-loaded route components for code splitting
const ContentLayout = lazy(() => import('./components/ContentLayout'));
const DarkroomEntry = lazy(() => import('./pages/DarkroomEntry'));
const ResearcherLanding = lazy(() => import('./pages/ResearcherLanding'));
const DeveloperLanding = lazy(() => import('./pages/DeveloperLanding'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ---------------------------------------------------------------------------
// Error Boundary
// ---------------------------------------------------------------------------
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: 24,
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 15, opacity: 0.6, marginBottom: 24 }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              borderRadius: 10,
              border: '1px solid #C49B3C',
              background: '#C49B3C',
              color: '#050505',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Component to handle language detection and redirect
// ---------------------------------------------------------------------------
function LanguageRedirect() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const detectedLang = i18n.language.startsWith('es') ? 'es' : 'en';

  // Preserve the full pathname (strip any existing locale prefix) + hash
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const hasLocalePrefix = firstSegment === 'en' || firstSegment === 'es';
  const remainingPath = hasLocalePrefix
    ? '/' + pathSegments.slice(1).join('/')
    : location.pathname;
  const target = `/${detectedLang}${remainingPath === '/' ? '' : remainingPath}/${location.hash}`;

  return <Navigate to={target} replace />;
}

// Wrapper component to sync URL locale with i18n
function LocaleWrapper({ children }: { children: ReactNode }) {
  const { locale } = useParams<{ locale: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (locale && ['en', 'es'].includes(locale) && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <ScrollHandler />
        <Suspense fallback={null}>
          <Routes>
            {/* Root redirect to detected language */}
            <Route path="/" element={<LanguageRedirect />} />

            {/* Locale-based routes */}
            <Route path="/:locale/*" element={
              <LocaleWrapper>
                <Routes>
                  {/* Darkroom entry — no Navbar/Footer */}
                  <Route path="/" element={<DarkroomEntry />} />

                  {/* Audience-specific landings — own navigation */}
                  <Route path="/researcher" element={<ResearcherLanding />} />
                  <Route path="/developer" element={<DeveloperLanding />} />

                  {/* Features page */}
                  <Route path="/features" element={
                    <ContentLayout>
                      <FeaturesPage />
                    </ContentLayout>
                  } />

                  {/* Content pages with minimal layout */}
                  <Route path="/about" element={
                    <ContentLayout>
                      <About />
                    </ContentLayout>
                  } />
                  <Route path="/contact" element={
                    <ContentLayout>
                      <Contact />
                    </ContentLayout>
                  } />
                  <Route path="/privacy" element={
                    <ContentLayout>
                      <Privacy />
                    </ContentLayout>
                  } />
                  <Route path="/terms" element={
                    <ContentLayout>
                      <Terms />
                    </ContentLayout>
                  } />
                  <Route path="/blog" element={
                    <ContentLayout>
                      <BlogPage />
                    </ContentLayout>
                  } />
                  <Route path="/blog/:slug" element={
                    <ContentLayout>
                      <BlogPost />
                    </ContentLayout>
                  } />

                  {/* 404 catch-all */}
                  <Route path="*" element={
                    <ContentLayout>
                      <NotFound />
                    </ContentLayout>
                  } />
                </Routes>
              </LocaleWrapper>
            } />

            {/* Top-level catch-all — redirect to locale-prefixed path */}
            <Route path="*" element={<LanguageRedirect />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;
