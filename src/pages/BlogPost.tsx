import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { blogPosts } from '../data/blog';
import SEO from '../components/SEO';

export default function BlogPost() {
    const { slug, locale } = useParams<{ slug: string; locale: string }>();
    const { t } = useTranslation('common');
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
    const post = blogPosts[currentIndex];
    const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

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
                    <Link to={`/${locale}/#blog`} className="text-primary-400 hover:text-primary-300 transition-colors">
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
            />

            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        to={`/${locale}/#blog`}
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
                    <header className="mb-12">
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
                                            // Handle relative links like ../slug
                                            const targetPath = href.startsWith('../')
                                                ? `/${locale}/blog/${href.replace('../', '')}`
                                                : href;
                                            return (
                                                <Link to={targetPath} className="text-primary-400 hover:text-primary-300 transition-colors">
                                                    {children}
                                                </Link>
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

                    {/* Post Navigation */}
                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
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
                </motion.article>
            </div>
        </div>
    );
}
