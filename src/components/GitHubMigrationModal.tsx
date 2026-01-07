import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

interface GitHubMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalUrl: string;
}

export default function GitHubMigrationModal({ isOpen, onClose, originalUrl }: GitHubMigrationModalProps) {
  const { t } = useTranslation('common');
  const { locale } = useParams<{ locale: string }>();

  // Convert GitHub URL to GitLab equivalent
  const gitlabUrl = originalUrl.replace('github.com', 'gitlab.com');

  const handleGoToGitLab = () => {
    window.open(gitlabUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleContinueToGitHub = () => {
    window.open(originalUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="glass-dark rounded-2xl border border-primary-500/20 overflow-hidden">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label={t('githubMigration.close')}
                >
                  <X className="w-5 h-5 text-muted" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-display font-bold">
                    {t('githubMigration.title')}
                  </h3>
                </div>

                <p className="text-muted leading-relaxed">
                  {t('githubMigration.description')}
                </p>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 space-y-3">
                <button
                  onClick={handleGoToGitLab}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all group"
                >
                  {t('githubMigration.goToGitLab')}
                  <ExternalLink className="w-4 h-4" />
                </button>

                <Link
                  to={`/${locale}/blog/why-we-moved-sciorex-off-github`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 glass hover:bg-white/10 text-white font-medium rounded-xl transition-all group"
                >
                  {t('githubMigration.readMore')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={handleContinueToGitHub}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-muted hover:text-white font-medium rounded-xl transition-all"
                >
                  {t('githubMigration.continueAnyway')}
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
