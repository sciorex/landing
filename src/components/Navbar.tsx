import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import { useTheme } from '../context/ThemeContext';
import { useGitHubMigration } from '../context/GitHubMigrationContext';
import { REPO_URL, TWITTER_URL, DOCS_URL, GIT_PROVIDER, GIT_PROVIDER_NAME } from '../config/urls';
import { GitHubIcon, GitLabIcon } from './GitProviderLink';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation('common');
  const { theme, toggleTheme } = useTheme();
  const { openModal, isGitHubSciorexUrl } = useGitHubMigration();

  const navLinks = [
    { name: t('nav.features'), href: '#features' },
    { name: t('nav.howItWorks'), href: '#how-it-works' },
    { name: t('nav.pricing'), href: '#pricing' },
    { name: t('nav.docs'), href: DOCS_URL, external: true },
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
        // Navigate to home page with hash
        navigate(`${homePath}#${targetId}`);
      } else {
        // Already on home page, update hash and ScrollHandler will trigger
        navigate(`#${targetId}`);
      }
      setMobileMenuOpen(false);
    }
  };


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'nav-blur border-b border-glass-border' : 'bg-transparent'
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
            <span className="text-xl font-display font-bold text-heading">
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
                  className="text-muted hover:text-primary-500 transition-colors font-medium"
                >
                  {link.name}
                </a>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-muted hover:text-primary-500 transition-colors font-medium"
                >
                  {link.name}
                </a>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isGitHubSciorexUrl(REPO_URL) ? (
              <button
                onClick={() => openModal(REPO_URL)}
                className="text-muted hover:text-primary-500 transition-colors"
                aria-label={GIT_PROVIDER_NAME}
              >
                <GitHubIcon className="w-6 h-6" />
              </button>
            ) : (
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-primary-500 transition-colors"
                aria-label={GIT_PROVIDER_NAME}
              >
                {GIT_PROVIDER === 'gitlab' ? (
                  <GitLabIcon className="w-6 h-6" />
                ) : (
                  <GitHubIcon className="w-6 h-6" />
                )}
              </a>
            )}
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass hover:bg-white/10 transition-colors text-muted hover:text-primary-500"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
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
            className="md:hidden text-heading"
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
                    className="text-muted hover:text-primary-500 transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-muted hover:text-primary-500 transition-colors font-medium py-2"
                  >
                    {link.name}
                  </a>
                )
              ))}
              <div className="pt-4 border-t border-glass-border flex items-center justify-between">
                <LanguageSelector />
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl glass hover:bg-white/10 transition-colors text-muted hover:text-primary-500"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex gap-4 pt-4 border-t border-glass-border">
                {isGitHubSciorexUrl(REPO_URL) ? (
                  <button
                    onClick={() => {
                      openModal(REPO_URL);
                      setMobileMenuOpen(false);
                    }}
                    className="text-muted hover:text-primary-500 transition-colors"
                  >
                    {GIT_PROVIDER_NAME}
                  </button>
                ) : (
                  <a
                    href={REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-primary-500 transition-colors"
                  >
                    {GIT_PROVIDER_NAME}
                  </a>
                )}
                <a
                  href={TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-primary-500 transition-colors"
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
