import { motion } from 'framer-motion';
import { ArrowRight, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { REPO_URL, GIT_PROVIDER } from '../config/urls';
import { GitHubIcon, GitLabIcon } from './GitProviderLink';

export default function CTA() {
  const { t } = useTranslation('common');

  return (
    <section className="section relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-6">
                <Crown className="w-4 h-4" />
                {t('cta.badge')}
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
                {t('cta.title')}
                <br />
                {t('cta.titleLine2')}
              </h2>

              <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                {t('cta.subtitle')}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#download"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-900 font-semibold rounded-xl hover:bg-white/90 transition-all hover:shadow-lg group"
                >
                  {t('cta.downloadNow')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  {GIT_PROVIDER === 'gitlab' ? (
                    <GitLabIcon className="w-5 h-5" />
                  ) : (
                    <GitHubIcon className="w-5 h-5" />
                  )}
                  {t('cta.starGithub')}
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
