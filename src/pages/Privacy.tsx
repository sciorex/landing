import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function Privacy() {
  const { t } = useTranslation('privacy');

  return (
    <>
      <SEO
        title={`${t('title')} | Sciorex`}
        description={t('sections.introduction.content')}
        path="/privacy"
      />
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-heading mb-6">
              {t('title')}
            </h1>
            <p className="text-muted">
              {t('lastUpdated')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-2xl p-8 md:p-12"
          >
            <div className="space-y-8 text-muted">
              <section>
                <h2 className="text-xl font-display font-bold text-heading mb-4">
                  {t('sections.introduction.title')}
                </h2>
                <p>
                  {t('sections.introduction.content')}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display font-bold text-heading mb-4">
                  {t('sections.whatWeCollect.title')}
                </h2>
                <p className="mb-4">
                  <strong className="text-heading font-semibold">{t('sections.whatWeCollect.content')}</strong>
                </p>
                <p>
                  {t('sections.whatWeCollect.analytics')}{' '}
                  <a
                    href="https://plausible.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300"
                  >
                    {t('sections.whatWeCollect.plausible')}
                  </a>
                  {t('sections.whatWeCollect.analyticsDesc')}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display font-bold text-heading mb-4">
                  {t('sections.plausibleAnalytics.title')}
                </h2>
                <p className="mb-4">
                  {t('sections.plausibleAnalytics.intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {(t('sections.plausibleAnalytics.features', { returnObjects: true }) as string[]).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <p className="mt-4">
                  {t('sections.plausibleAnalytics.dataCollected')}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display font-bold text-heading mb-4">
                  {t('sections.application.title')}
                </h2>
                <p>
                  {t('sections.application.content')}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display font-bold text-heading mb-4">
                  {t('sections.thirdPartyAI.title')}
                </h2>
                <p>
                  {t('sections.thirdPartyAI.content')}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display font-bold text-heading mb-4">
                  {t('sections.changes.title')}
                </h2>
                <p>
                  {t('sections.changes.content')}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display font-bold text-heading mb-4">
                  {t('sections.contact.title')}
                </h2>
                <p>
                  {t('sections.contact.content')}{' '}
                  <a
                    href={`mailto:${t('sections.contact.email')}`}
                    className="text-primary-400 hover:text-primary-300"
                  >
                    {t('sections.contact.email')}
                  </a>
                  .
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
