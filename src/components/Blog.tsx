import { motion } from 'framer-motion';
import { FileText, ArrowRight, Calendar, Clock, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { blogPosts, type BlogPost } from '../data/blog';

type GroupedItem =
  | { type: 'post'; post: BlogPost }
  | { type: 'series'; nameKey: string; posts: BlogPost[] };

export default function Blog() {
  const { t } = useTranslation('common');
  const { locale } = useParams<{ locale: string }>();

  const groupedItems = blogPosts.reduce((acc, post) => {
    if (post.series) {
      const existingSeries = acc.find(item => item.type === 'series' && item.nameKey === post.series?.nameKey) as Extract<GroupedItem, { type: 'series' }> | undefined;
      if (existingSeries) {
        existingSeries.posts.push(post);
        return acc;
      }
      acc.push({
        type: 'series',
        nameKey: post.series.nameKey,
        posts: [post]
      });
    } else {
      acc.push({ type: 'post', post });
    }
    return acc;
  }, [] as GroupedItem[]);

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
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 mb-4">
            {t('blog.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold">
            {t('blog.title')}
            <span className="text-gradient"> {t('blog.titleHighlight')}</span>
          </h2>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {groupedItems.map((item, index) => (
            <motion.div
              key={item.type === 'post' ? item.post.slug : item.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={item.type === 'series' ? 'md:col-span-2' : ''}
            >
              {item.type === 'post' ? (
                <Link
                  to={`/${locale}/blog/${item.post.slug}`}
                  className="group block h-full glass-dark p-8 rounded-2xl hover:border-primary-500/50 transition-all duration-300 card-hover"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4 text-xs text-muted mb-6 font-medium uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.post.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
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

                    <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-primary-400 transition-colors">
                      {t(item.post.titleKey)}
                    </h3>

                    <p className="text-muted mb-8 flex-grow leading-relaxed">
                      {t(item.post.excerptKey)}
                    </p>

                    <div className="inline-flex items-center gap-2 text-primary-400 font-semibold group-hover:gap-3 transition-all">
                      {t('blog.readMore')}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="glass-dark p-8 rounded-3xl border border-primary-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Layers className="w-32 h-32" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-widest border border-primary-500/20">
                        {item.posts.length} Parts Series
                      </span>
                      <span className="text-muted text-xs uppercase tracking-widest font-medium">
                        Featured
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                      {t(item.nameKey)}
                    </h3>

                    <p className="text-muted mb-10 max-w-2xl text-lg leading-relaxed">
                      {t(item.posts[0].excerptKey)}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {item.posts.sort((a, b) => (a.series?.part || 0) - (b.series?.part || 0)).map((post) => (
                        <Link
                          key={post.slug}
                          to={`/${locale}/blog/${post.slug}`}
                          className="flex flex-col p-5 rounded-xl glass hover:bg-white/5 transition-all border border-white/5 hover:border-primary-500/30 group/item"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500 mb-2">
                            Part {post.series?.part}
                          </span>
                          <span className="text-sm font-semibold group-hover/item:text-primary-400 transition-colors line-clamp-2">
                            {t(post.titleKey).split(':')[1]?.trim() || t(post.titleKey)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

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
              <FileText className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">
              {t('blog.emptyTitle')}
            </h3>
            <p className="text-muted text-center max-w-md">
              {t('blog.emptyDescription')}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
