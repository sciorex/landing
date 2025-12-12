import { motion } from 'framer-motion';
import { Mail, MessageSquare, FileText } from 'lucide-react';
import { analytics } from '../utils/analytics';

const contactOptions = [
  {
    icon: Mail,
    title: 'General Inquiries',
    email: 'hello@sciorex.com',
    description: 'For general questions about Sciorex.',
  },
  {
    icon: MessageSquare,
    title: 'Support',
    email: 'support@sciorex.com',
    description: 'Need help with the app? We\'re here for you.',
  },
  {
    icon: FileText,
    title: 'Press & Media',
    email: 'press@sciorex.com',
    description: 'Media inquiries and press requests.',
  },
];

export default function Contact() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-dark-100 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
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
              <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
              <p className="text-dark-100 text-sm mb-4">{option.description}</p>
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
          <h2 className="text-2xl font-display font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-dark-100 mb-6">
            Connect with other Sciorex users, get tips, and stay updated on the latest features.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://discord.gg/zSjPjA5j"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.trackSocialClick('Discord')}
              className="btn-primary"
            >
              Join Discord
            </a>
            <a
              href="https://github.com/sciorex/sciorex"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.trackSocialClick('GitHub')}
              className="btn-secondary"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
