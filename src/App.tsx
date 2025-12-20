import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Component to handle language detection and redirect
function LanguageRedirect() {
  const { i18n } = useTranslation();
  const detectedLang = i18n.language.startsWith('es') ? 'es' : 'en';
  return <Navigate to={`/${detectedLang}/`} replace />;
}

// Wrapper component to sync URL locale with i18n
function LocaleWrapper({ children }: { children: React.ReactNode }) {
  const { locale } = useParams<{ locale: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (locale && ['en', 'es'].includes(locale) && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <>{children}</>;
}

function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Routes>
        {/* Root redirect to detected language */}
        <Route path="/" element={<LanguageRedirect />} />

        {/* Locale-based routes */}
        <Route path="/:locale/*" element={
          <LocaleWrapper>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
              </Routes>
            </main>
            <Footer />
          </LocaleWrapper>
        } />
      </Routes>
    </div>
  );
}

export default App;
