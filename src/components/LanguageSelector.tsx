import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const location = useLocation();

  const currentLocale = locale || i18n.language || 'en';
  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    if (langCode !== currentLocale) {
      // Extract the path after the locale
      const pathParts = location.pathname.split('/').filter(Boolean);
      const pathWithoutLocale = pathParts.slice(1).join('/');
      const newPath = `/${langCode}/${pathWithoutLocale}`;

      // Preserve hash if present
      const hash = location.hash;

      // Change language and navigate
      i18n.changeLanguage(langCode);
      navigate(newPath + hash, { state: location.state });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted hover:text-primary-500 hover:bg-white/5 transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden shadow-xl border border-glass-border animate-slide-up">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${lang.code === currentLocale
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'text-muted hover:text-primary-500 hover:bg-white/5'
                }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-medium text-heading">{lang.name}</div>
                <div className="text-xs text-muted">{lang.code.toUpperCase()}</div>
              </div>
              {lang.code === currentLocale && (
                <svg
                  className="w-5 h-5 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
