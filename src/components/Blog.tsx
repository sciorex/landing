import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const blogPosts: never[] = [];

export default function Blog() {
  const { t } = useTranslation('common');

  return (
    <section id="blog" className="section relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 mb-4">
            {t('blog.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold">
            {t('blog.title')}
            <span className="text-gradient"> {t('blog.titleHighlight')}</span>
          </h2>
        </motion.div>

        {/* Empty State */}
        {blogPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="w-20 h-20 rounded-2xl bg-dark-700 flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-dark-300" />
            </div>
            <h3 className="text-xl font-display font-semibold text-white mb-2">
              {t('blog.emptyTitle')}
            </h3>
            <p className="text-dark-200 text-center max-w-md">
              {t('blog.emptyDescription')}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
