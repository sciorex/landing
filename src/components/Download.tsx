import { motion } from 'framer-motion';
import { Download, Apple, Monitor, Terminal, CheckCircle, Package } from 'lucide-react';

const downloadGroups = [
  {
    os: 'Windows',
    icon: Monitor,
    color: 'from-blue-500 to-cyan-500',
    options: [
      { name: 'Installer', file: '.exe', size: '~85 MB', description: 'Recommended' },
      { name: 'Portable', file: '.zip', size: '~82 MB', description: 'No install needed' },
    ],
  },
  {
    os: 'macOS',
    icon: Apple,
    color: 'from-gray-400 to-gray-600',
    options: [
      { name: 'Apple Silicon', file: '.dmg (arm64)', size: '~88 MB', description: 'M1/M2/M3/M4' },
      { name: 'Intel', file: '.dmg (x64)', size: '~92 MB', description: 'Intel Macs' },
    ],
  },
  {
    os: 'Linux',
    icon: Terminal,
    color: 'from-orange-500 to-yellow-500',
    options: [
      { name: 'AppImage', file: '.AppImage', size: '~80 MB', description: 'Universal' },
      { name: 'Debian/Ubuntu', file: '.deb', size: '~78 MB', description: 'apt compatible' },
    ],
  },
];

const features = [
  'Free for personal use',
  'All features included',
  'No account required',
  'Auto-updates included',
  '100% local & private',
];

export default function DownloadSection() {
  return (
    <section id="download" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800/50 to-dark-900" />
      <div className="absolute inset-0 mesh-bg" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 mb-4">
            Available Now
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Download
            <span className="text-gradient"> Sciorex</span>
          </h2>
          <p className="text-xl text-dark-100 max-w-2xl mx-auto">
            Claim your throne as the King of Knowledge.
            Free for personal use, no account required.
          </p>
        </motion.div>
        
        {/* Download Cards by OS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {downloadGroups.map((group) => (
            <div
              key={group.os}
              className="glass-dark rounded-2xl overflow-hidden"
            >
              {/* OS Header */}
              <div className={`bg-gradient-to-r ${group.color} bg-opacity-10 p-5 border-b border-white/5`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.color} bg-opacity-20 flex items-center justify-center`}>
                    <group.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">
                      {group.os}
                    </h3>
                    <p className="text-xs text-dark-200">v1.0.0</p>
                  </div>
                </div>
              </div>
              
              {/* Download Options */}
              <div className="p-4 space-y-3">
                {group.options.map((option) => (
                  <motion.button
                    key={option.name}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-700/50 hover:bg-dark-600/50 border border-white/5 hover:border-primary-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                        {option.name === 'Portable' ? (
                          <Package className="w-4 h-4 text-primary-400" />
                        ) : (
                          <Download className="w-4 h-4 text-primary-400" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">
                          {option.name}
                        </p>
                        <p className="text-xs text-dark-300">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-dark-200">{option.file}</p>
                      <p className="text-xs text-dark-400">{option.size}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3"
        >
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 text-dark-100"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </motion.div>
        
        {/* Requirement Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-dark-300">
            Requires Node.js v18+ and Claude Code CLI for AI features.{' '}
            <a href="#" className="text-primary-400 hover:text-primary-300 underline">
              Setup Guide →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
