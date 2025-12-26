import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blog';
import SEO from '../components/SEO';

export default function BlogPage() {
    const { t } = useTranslation('common');
    const { locale } = useParams<{ locale: string }>();

    return (
        <div className="pt-32 pb-20 px-4">
            <SEO
                title={`${t('nav.blog')} | Sciorex`}
                description={t('blog.emptyDescription')}
            />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-400 mb-4">
                        {t('blog.badge')}
                    </span>
                    <h1 className="text-5xl sm:text-6xl font-display font-bold mb-6">
                        {t('blog.title')}
                        <span className="text-gradient"> {t('blog.titleHighlight')}</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {blogPosts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link
                                to={`/${locale}/blog/${post.slug}`}
                                className="group block h-full glass-dark p-8 rounded-2xl hover:border-primary-500/50 transition-all duration-300 card-hover"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-4 text-xs text-muted mb-6 font-medium uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(post.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-primary-500/30" />
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            5 min read
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-display font-bold mb-4 group-hover:text-primary-400 transition-colors">
                                        {t(post.titleKey)}
                                    </h2>

                                    <p className="text-muted mb-8 flex-grow leading-relaxed">
                                        {t(post.excerptKey)}
                                    </p>

                                    <div className="inline-flex items-center gap-2 text-primary-400 font-semibold group-hover:gap-3 transition-all">
                                        {t('blog.readMore')}
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
