import { motion } from 'framer-motion';
import { Crown, Target, Users, Sparkles } from 'lucide-react';

const values = [
  {
    icon: Crown,
    title: 'Excellence',
    description: 'We strive to build the most powerful and intuitive research tools available.',
  },
  {
    icon: Target,
    title: 'Focus',
    description: 'Every feature is designed to help you achieve your research goals faster.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We build alongside our users, listening and iterating based on real needs.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'Pushing the boundaries of what AI-powered research can accomplish.',
  },
];

export default function About() {
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
            About Sciorex
          </h1>
          <p className="text-xl text-dark-100">
            The King of Knowledge
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-invert prose-lg max-w-none mb-16"
        >
          <div className="glass rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Our Mission</h2>
            <p className="text-dark-100 mb-6">
              Sciorex was born from a simple belief: research should be powerful yet effortless.
              We're building tools that let you orchestrate AI agent swarms, design complex
              research workflows, and conquer any knowledge domain with ease.
            </p>
            <p className="text-dark-100 mb-6">
              Our platform combines cutting-edge AI capabilities with an intuitive interface,
              enabling researchers, developers, and knowledge workers to accomplish in hours
              what once took days or weeks.
            </p>
            <p className="text-dark-100">
              Whether you're conducting academic research, competitive analysis, or deep-diving
              into any topic, Sciorex gives you the power to rule your domain.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-dark-100 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
