import { motion } from 'framer-motion';
import { Mail, MessageSquare, FileText } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const iconMap = [Mail, MessageSquare, FileText];

export default function Contact() {
  const { t } = useTranslation('contact');

  const contactOptions = (t('options', { returnObjects: true }) as Array<{ title: string; email: string; description: string }>).map(
    (option, index) => ({
      icon: iconMap[index],
      title: option.title,
      email: option.email,
      description: option.description,
    })
  );
  return (
    <>
      <SEO
        title={`${t('title')} | Sciorex`}
        description={t('subtitle')}
        path="/contact"
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
            <p className="text-xl text-muted max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className="glass rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-heading mb-2">{option.title}</h3>
                <p className="text-muted text-sm mb-4">{option.description}</p>
                <a
                  href={`mailto:${option.email}`}
                  onClick={() => analytics.trackContactClick(option.title)}
                  className="text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
                >
                  {option.email}
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl font-display font-bold text-heading mb-4">
              {t('community.title')}
            </h2>
            <p className="text-muted mb-6">
              {t('community.description')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://discord.gg/zSjPjA5j"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.trackSocialClick('Discord')}
                className="btn-primary"
              >
                {t('community.discord')}
              </a>
              <a
                href="https://github.com/sciorex/sciorex"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.trackSocialClick('GitHub')}
                className="btn-secondary"
              >
                {t('community.github')}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
