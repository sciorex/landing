import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUp, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { blogPosts } from '../data/blog';
import SEO from '../components/SEO';
import { useGitHubMigration } from '../context/GitHubMigrationContext';

// Get all posts in the same series, sorted by part number
function getSeriesParts(nameKey: string) {
    return blogPosts
        .filter((p) => p.series?.nameKey === nameKey)
        .sort((a, b) => (a.series?.part ?? 0) - (b.series?.part ?? 0));
}

export default function BlogPost() {
    const { slug, locale } = useParams<{ slug: string; locale: string }>();
    const { t } = useTranslation('common');
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const { openModal, isGitHubSciorexUrl } = useGitHubMigration();

    const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
    const post = blogPosts[currentIndex];

    // Series context
    const isSeries = !!post?.series;
    const seriesParts = isSeries ? getSeriesParts(post.series!.nameKey) : [];
    const seriesIndex = isSeries ? seriesParts.findIndex((p) => p.slug === slug) : -1;
    const prevInSeries = seriesIndex > 0 ? seriesParts[seriesIndex - 1] : null;
    const nextInSeries = seriesIndex < seriesParts.length - 1 ? seriesParts[seriesIndex + 1] : null;

    // For standalone posts, use global prev/next
    const prevPost = !isSeries && currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
    const nextPost = !isSeries && currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

    // Scroll-to-top visibility
    const [showTop, setShowTop] = useState(false);
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (post) {
            setLoading(true);
            fetch(`/blog/${post.file}`)
                .then((res) => res.text())
                .then((text) => {
                    setContent(text);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error loading blog post:', err);
                    setLoading(false);
                });
        }
    }, [post]);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-display font-bold mb-4">Post not found</h1>
                    <Link to={`/${locale}/blog`} className="text-primary-400 hover:text-primary-300 transition-colors">
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4">
            <SEO
                title={`${t(post.titleKey)} | Sciorex`}
                description={t(post.excerptKey)}
                path={`/blog/${slug}`}
                article={{ datePublished: post.date }}
            />

            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        to={`/${locale}/blog`}
                        className="inline-flex items-center text-muted hover:text-primary-400 transition-colors gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to all posts
                    </Link>
                </motion.div>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* ---- Series pill bar ---- */}
                    {isSeries && (
                        <div
                            style={{
                                display: 'flex',
                                gap: 0,
                                marginBottom: 32,
                                borderRadius: 12,
                                border: '1px solid var(--glass-border)',
                                overflow: 'hidden',
                            }}
                        >
                            {seriesParts.map((part, i) => {
                                const isActive = part.slug === slug;
                                return (
                                    <Link
                                        key={part.slug}
                                        to={`/${locale}/blog/${part.slug}`}
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            fontSize: 13,
                                            fontWeight: isActive ? 600 : 400,
                                            fontFamily: "'Inter', system-ui, sans-serif",
                                            color: isActive ? 'var(--text-color)' : 'var(--text-muted)',
                                            background: isActive ? 'var(--glass-bg-dark)' : 'transparent',
                                            borderRight: i < seriesParts.length - 1
                                                ? '1px solid var(--glass-border)'
                                                : undefined,
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                letterSpacing: '0.06em',
                                                color: isActive ? 'var(--accent-color)' : 'var(--text-muted)',
                                                opacity: isActive ? 1 : 0.6,
                                            }}
                                        >
                                            Part {part.series?.part}
                                        </span>
                                        <span
                                            className="line-clamp-1"
                                            style={{ fontSize: 12 }}
                                        >
                                            {t(part.titleKey)}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <header className="mb-12">
                        {/* Series badge */}
                        {isSeries && (
                            <span
                                className="glass"
                                style={{
                                    display: 'inline-block',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: 'var(--accent-color)',
                                    padding: '4px 12px',
                                    borderRadius: 6,
                                    marginBottom: 16,
                                    letterSpacing: '0.04em',
                                }}
                            >
                                {t(post.series!.nameKey)} &middot; Part {post.series!.part}
                            </span>
                        )}

                        <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6 leading-tight">
                            {t(post.titleKey)}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-muted text-sm">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {Math.ceil(content.split(' ').length / 200)} min read
                            </span>
                        </div>
                    </header>

                    <div className="prose max-w-none">
                        {loading ? (
                            <div className="space-y-4">
                                <div className="h-4 glass rounded w-3/4 animate-pulse" />
                                <div className="h-4 glass rounded animate-pulse" />
                                <div className="h-4 glass rounded w-5/6 animate-pulse" />
                            </div>
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    a: ({ href, children }) => {
                                        const isInternal = href?.startsWith('../') || href?.startsWith('/');

                                        if (isInternal && href) {
                                            const targetPath = href.startsWith('../')
                                                ? `/${locale}/blog/${href.replace('../', '')}`
                                                : href;
                                            return (
                                                <Link to={targetPath} className="text-primary-400 hover:text-primary-300 transition-colors">
                                                    {children}
                                                </Link>
                                            );
                                        }

                                        if (isGitHubSciorexUrl(href || '')) {
                                            return (
                                                <button
                                                    onClick={() => openModal(href || '')}
                                                    className="text-primary-400 hover:text-primary-300 transition-colors cursor-pointer underline"
                                                >
                                                    {children}
                                                </button>
                                            );
                                        }

                                        return (
                                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">
                                                {children}
                                            </a>
                                        );
                                    }
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        )}
                    </div>

                    {/* ---- Post navigation ---- */}
                    {isSeries ? (
                        /* Series: prev/next within the series */
                        <div className="mt-20 pt-10 border-t border-[var(--glass-border)] flex flex-col sm:flex-row gap-4 justify-between">
                            {prevInSeries ? (
                                <Link
                                    to={`/${locale}/blog/${prevInSeries.slug}`}
                                    className="group flex-1 glass p-6 rounded-2xl hover:border-primary-500/50 transition-all duration-300"
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs text-muted flex items-center gap-1">
                                            <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                                            Part {prevInSeries.series?.part}
                                        </span>
                                        <span className="font-display font-bold group-hover:text-primary-400 transition-colors line-clamp-1">
                                            {t(prevInSeries.titleKey)}
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex-1" />
                            )}

                            {nextInSeries ? (
                                <Link
                                    to={`/${locale}/blog/${nextInSeries.slug}`}
                                    className="group flex-1 glass p-6 rounded-2xl hover:border-primary-500/50 transition-all duration-300 text-right"
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs text-muted flex items-center gap-1 justify-end">
                                            Part {nextInSeries.series?.part}
                                            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                        </span>
                                        <span className="font-display font-bold group-hover:text-primary-400 transition-colors line-clamp-1">
                                            {t(nextInSeries.titleKey)}
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex-1" />
                            )}
                        </div>
                    ) : (
                        /* Standalone: global prev/next */
                        <div className="mt-20 pt-10 border-t border-[var(--glass-border)] flex flex-col sm:flex-row gap-4 justify-between">
                            {prevPost ? (
                                <Link
                                    to={`/${locale}/blog/${prevPost.slug}`}
                                    className="group flex-1 glass p-6 rounded-2xl hover:border-primary-500/50 transition-all duration-300"
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs text-muted flex items-center gap-1">
                                            <ChevronLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                                            {t('blog.prevPost')}
                                        </span>
                                        <span className="font-display font-bold group-hover:text-primary-400 transition-colors line-clamp-1">
                                            {t(prevPost.titleKey)}
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex-1" />
                            )}

                            {nextPost ? (
                                <Link
                                    to={`/${locale}/blog/${nextPost.slug}`}
                                    className="group flex-1 glass p-6 rounded-2xl hover:border-primary-500/50 transition-all duration-300 text-right"
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs text-muted flex items-center gap-1 justify-end">
                                            {t('blog.nextPost')}
                                            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                        </span>
                                        <span className="font-display font-bold group-hover:text-primary-400 transition-colors line-clamp-1">
                                            {t(nextPost.titleKey)}
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex-1" />
                            )}
                        </div>
                    )}
                    {/* ---- Back to top (inline) ---- */}
                    <div style={{ textAlign: 'center', marginTop: 40 }}>
                        <button
                            type="button"
                            onClick={scrollToTop}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: 13,
                                color: 'var(--text-muted)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                transition: 'color 0.2s ease',
                                letterSpacing: '0.02em',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-color)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                        >
                            <ArrowUp style={{ width: 14, height: 14 }} />
                            Back to top
                        </button>
                    </div>
                </motion.article>
            </div>

            {/* ---- Floating back-to-top button ---- */}
            <AnimatePresence>
                {showTop && (
                    <motion.button
                        type="button"
                        onClick={scrollToTop}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        aria-label="Back to top"
                        style={{
                            position: 'fixed',
                            bottom: 28,
                            right: 28,
                            zIndex: 40,
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            border: '1px solid var(--glass-border)',
                            background: 'var(--bg-color)',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s ease, color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-color)';
                            e.currentTarget.style.color = 'var(--accent-color)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                    >
                        <ArrowUp style={{ width: 18, height: 18 }} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
