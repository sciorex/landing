import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const blogPosts: never[] = [];

export default function Blog() {
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
            Learn & Explore
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold">
            Latest from the
            <span className="text-gradient"> Blog</span>
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
              No posts yet
            </h3>
            <p className="text-dark-200 text-center max-w-md">
              We're working on some great content. Check back soon for tutorials, guides, and best practices.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
