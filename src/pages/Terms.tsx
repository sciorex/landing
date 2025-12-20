import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Terms() {
  const { t } = useTranslation('terms');
  const { locale } = useParams<{ locale: string }>();

  return (
    <>
      <SEO
        title={`${t('title')} | Sciorex`}
        description={t('sections.acceptance.content')}
        path="/terms"
      />
      <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            {t('title')}
          </h1>
          <p className="text-dark-100">
            {t('lastUpdated')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl p-8 md:p-12"
        >
          <div className="space-y-8 text-dark-100">
            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('sections.acceptance.title')}
              </h2>
              <p>
                {t('sections.acceptance.content')}{' '}
                <a href={`/${locale || 'en'}/privacy`} className="text-primary-400 hover:text-primary-300">
                  {t('sections.acceptance.privacyPolicy')}
                </a>
                {t('sections.acceptance.disclaimer')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('sections.license.title')}
              </h2>
              <p className="mb-4">
                {t('sections.license.intro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {(t('sections.license.rights', { returnObjects: true }) as string[]).map((right, index) => (
                  <li key={index}>{right}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('sections.restrictions.title')}
              </h2>
              <p className="mb-4">{t('sections.restrictions.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {(t('sections.restrictions.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('sections.yourContent.title')}
              </h2>
              <p className="mb-4">
                <strong className="text-white">{t('sections.yourContent.ownership')}</strong> {t('sections.yourContent.ownershipDesc')}
              </p>
              <p>
                <strong className="text-white">{t('sections.yourContent.aiOutput')}</strong> {t('sections.yourContent.aiOutputDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('sections.dataPrivacy.title')}
              </h2>
              <p className="mb-4">
                <strong className="text-white">{t('sections.dataPrivacy.noCollection')}</strong> {t('sections.dataPrivacy.noCollectionDesc')}
              </p>
              <p>
                <strong className="text-white">{t('sections.dataPrivacy.noTraining')}</strong> {t('sections.dataPrivacy.noTrainingDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('sections.thirdParty.title')}
              </h2>
              <p>
                {t('sections.thirdParty.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('sections.aiDisclaimer.title')}
              </h2>
              <p className="mb-4">
                {t('sections.aiDisclaimer.intro')}
              </p>
              <p>
                <strong className="text-white">{t('sections.aiDisclaimer.responsibility')}</strong> {t('sections.aiDisclaimer.responsibilityDesc')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('sections.noWarranty.title')}
              </h2>
              <p>
                {t('sections.noWarranty.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('sections.liability.title')}
              </h2>
              <p>
                {t('sections.liability.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                {t('sections.changes.title')}
              </h2>
              <p>
                {t('sections.changes.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
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
