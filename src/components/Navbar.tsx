import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation('common');

  const navLinks = [
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.howItWorks'), href: '#how-it-works' },
    { name: t('nav.pricing'), href: '#pricing' },
    { name: t('nav.docs'), href: 'https://docs.sciorex.com', external: true },
    { name: t('nav.blog'), href: '#blog' },
    { name: t('nav.download'), href: '#download' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const currentLocale = locale || 'en';
      const homePath = `/${currentLocale}/`;

      if (location.pathname !== homePath) {
        // Navigate to home page first, then scroll to section
        navigate(homePath, { state: { scrollTo: targetId } });
      } else {
        // Already on home page, just scroll
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setMobileMenuOpen(false);
    }
  };

  // Handle scroll after navigation from subpage
  useEffect(() => {
    const currentLocale = locale || 'en';
    const homePath = `/${currentLocale}/`;

    if (location.pathname === homePath && location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location, locale]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'nav-blur border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={`/${locale || 'en'}/`} className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Sciorex Logo"
              className="w-10 h-10 rounded-xl transform group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-display font-bold text-white">
              Sciorex
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-100 hover:text-white transition-colors font-medium"
                >
                  {link.name}
                </a>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-dark-100 hover:text-white transition-colors font-medium"
                >
                  {link.name}
                </a>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/sciorex/sciorex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-100 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://x.com/sciorex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-100 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <LanguageSelector />
            <a
              href="#download"
              onClick={(e) => handleNavClick(e, '#download')}
              className="btn-primary text-sm px-6 py-3"
            >
              {t('nav.download')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass rounded-2xl mt-2 p-6 animate-slide-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-100 hover:text-white transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-dark-100 hover:text-white transition-colors font-medium py-2"
                  >
                    {link.name}
                  </a>
                )
              ))}
              <div className="pt-4 border-t border-white/10">
                <LanguageSelector />
              </div>
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <a
                  href="https://github.com/sciorex/sciorex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-100 hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://x.com/sciorex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark-100 hover:text-white transition-colors"
                >
                  X (Twitter)
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
