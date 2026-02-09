import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { blogPosts, type BlogPost } from '../data/blog';
import SEO from '../components/SEO';

// Group posts: series grouped by nameKey, standalone posts separate
function groupPosts(posts: BlogPost[]) {
    const seriesMap = new Map<string, BlogPost[]>();
    const standalone: BlogPost[] = [];

    for (const post of posts) {
        if (post.series) {
            const key = post.series.nameKey;
            if (!seriesMap.has(key)) seriesMap.set(key, []);
            seriesMap.get(key)!.push(post);
        } else {
            standalone.push(post);
        }
    }

    // Sort each series by part number
    for (const parts of seriesMap.values()) {
        parts.sort((a, b) => (a.series?.part ?? 0) - (b.series?.part ?? 0));
    }

    return { series: Array.from(seriesMap.entries()), standalone };
}

export default function BlogPage() {
    const { t } = useTranslation('common');
    const { locale } = useParams<{ locale: string }>();
    const { series, standalone } = groupPosts(blogPosts);

    return (
        <div className="pt-32 pb-20 px-4">
            <SEO
                title={`${t('nav.blog')} | Sciorex`}
                description={t('blog.emptyDescription')}
                path="/blog"
            />

            <div className="max-w-5xl mx-auto">
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

                {/* ---- Series cards ---- */}
                {series.map(([nameKey, parts]) => (
                    <motion.div
                        key={nameKey}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-12"
                    >
                        <div className="glass-dark rounded-2xl overflow-hidden">
                            {/* Series header */}
                            <div
                                style={{
                                    padding: '28px 32px 20px',
                                    borderBottom: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                }}
                            >
                                <BookOpen
                                    style={{ width: 20, height: 20, color: 'var(--accent-color)', flexShrink: 0 }}
                                />
                                <div>
                                    <h2
                                        className="font-display font-bold"
                                        style={{ fontSize: 22, marginBottom: 4 }}
                                    >
                                        {t(nameKey)}
                                    </h2>
                                    <p className="text-muted" style={{ fontSize: 13 }}>
                                        {parts.length} parts &middot;{' '}
                                        {new Date(parts[0].date).toLocaleDateString(
                                            locale === 'es' ? 'es-ES' : 'en-US',
                                            { month: 'long', year: 'numeric' }
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Part rows */}
                            {parts.map((part, pi) => (
                                <Link
                                    key={part.slug}
                                    to={`/${locale}/blog/${part.slug}`}
                                    className="group block"
                                    style={{
                                        padding: '20px 32px',
                                        borderBottom: pi < parts.length - 1
                                            ? '1px solid var(--glass-border)'
                                            : undefined,
                                        display: 'flex',
                                        gap: 20,
                                        alignItems: 'flex-start',
                                        textDecoration: 'none',
                                        transition: 'background 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--glass-bg-dark)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    {/* Part number */}
                                    <span
                                        style={{
                                            fontFamily: "'Outfit', system-ui, sans-serif",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: 'var(--accent-color)',
                                            minWidth: 56,
                                            letterSpacing: '0.04em',
                                            paddingTop: 2,
                                            flexShrink: 0,
                                        }}
                                    >
                                        Part {part.series?.part}
                                    </span>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3
                                            className="font-display font-bold group-hover:text-primary-400 transition-colors"
                                            style={{ fontSize: 17, marginBottom: 4, lineHeight: 1.4 }}
                                        >
                                            {t(part.titleKey)}
                                        </h3>
                                        <p
                                            className="text-muted"
                                            style={{
                                                fontSize: 14,
                                                lineHeight: 1.5,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {t(part.excerptKey)}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight
                                        className="text-muted group-hover:text-primary-400 transition-colors"
                                        style={{
                                            width: 16,
                                            height: 16,
                                            flexShrink: 0,
                                            marginTop: 4,
                                            transition: 'transform 0.2s ease',
                                        }}
                                    />
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {/* ---- Standalone posts ---- */}
                {standalone.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {standalone.map((post, index) => (
                            <motion.div
                                key={post.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
                            >
                                <Link
                                    to={`/${locale}/blog/${post.slug}`}
                                    className="group block h-full glass-dark p-8 rounded-2xl hover:border-primary-500/50 transition-all duration-300 card-hover"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center gap-4 text-xs text-muted mb-6 font-medium uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(post.date).toLocaleDateString(
                                                    locale === 'es' ? 'es-ES' : 'en-US',
                                                    { month: 'short', day: 'numeric', year: 'numeric' }
                                                )}
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
                )}
            </div>
        </div>
    );
}
