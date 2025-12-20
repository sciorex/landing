import { motion } from 'framer-motion';
import { Crown, Target, Users, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const valueIcons = [Crown, Target, Users, Sparkles];

export default function About() {
  const { t } = useTranslation('about');

  const values = (t('values', { returnObjects: true }) as Array<{ title: string; description: string }>).map(
    (value, index) => ({
      icon: valueIcons[index],
      title: value.title,
      description: value.description,
    })
  );
  return (
    <>
      <SEO
        title={`${t('title')} | Sciorex`}
        description={t('subtitle')}
        path="/about"
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
          <p className="text-xl text-dark-100">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-invert prose-lg max-w-none mb-16"
        >
          <div className="glass rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-display font-bold text-white mb-4">{t('mission.heading')}</h2>
            <p className="text-dark-100 mb-6">
              {t('mission.paragraph1')}
            </p>
            <p className="text-dark-100 mb-6">
              {t('mission.paragraph2')}
            </p>
            <p className="text-dark-100">
              {t('mission.paragraph3')}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">
            {t('valuesTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-dark-100 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      </div>
    </>
  );
}
