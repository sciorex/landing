import { motion } from 'framer-motion';
import {
  Bot,
  Workflow,
  Kanban,
  MessageSquare,
  GitBranch,
  Settings2,
  Zap,
  Shield,
  History,
  Layers,
  Puzzle,
  Bell,
  Sparkles,
  Code2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const iconMap = {
  Sparkles,
  Bot,
  Workflow,
  Kanban,
  MessageSquare,
  Puzzle,
  Code2,
  GitBranch,
  Layers,
  History,
  Zap,
  Settings2,
  Shield,
  Bell,
};

const colorMap = [
  'from-violet-500 to-purple-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-indigo-500 to-violet-500',
  'from-cyan-500 to-blue-500',
  'from-teal-500 to-cyan-500',
  'from-rose-500 to-pink-500',
  'from-yellow-500 to-orange-500',
  'from-sky-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
  'from-emerald-500 to-green-500',
  'from-red-500 to-rose-500',
];

const iconOrder = [
  'Sparkles',
  'Bot',
  'Workflow',
  'Kanban',
  'MessageSquare',
  'Puzzle',
  'Code2',
  'GitBranch',
  'Layers',
  'History',
  'Zap',
  'Settings2',
  'Shield',
  'Bell',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Features() {
  const { t } = useTranslation('features');

  const features = iconOrder.map((iconName, index) => ({
    icon: iconMap[iconName as keyof typeof iconMap],
    title: t(`features.${index}.title`),
    description: t(`features.${index}.description`),
    color: colorMap[index],
  }));

  return (
    <section id="features" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-bg" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-400 mb-4">
            {t('badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            {t('title')}
            <span className="text-gradient"> {t('titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="glass-dark rounded-2xl p-6 card-hover group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">
                {feature.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
