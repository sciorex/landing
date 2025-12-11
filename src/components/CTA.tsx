import { motion } from 'framer-motion';
import { ArrowRight, Crown } from 'lucide-react';

export default function CTA() {
  return (
    <section className="section relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          {/* Content */}
          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-6">
                <Crown className="w-4 h-4" />
                Ready to rule your knowledge domain?
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
                Claim Your Throne as
                <br />
                The King of Knowledge
              </h2>
              
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
                Download Sciorex and command your AI agent army.
                Free for personal use, no account required.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#download"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-900 font-semibold rounded-xl hover:bg-white/90 transition-all hover:shadow-lg group"
                >
                  Download Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://github.com/sciorex/sciorex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Star on GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
