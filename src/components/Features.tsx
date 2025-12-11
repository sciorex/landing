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
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'Custom AI Agents',
    description:
      'Create specialized agents with unique prompts, system instructions, and tool permissions. Each agent has its own personality and expertise.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Workflow,
    title: 'Visual Flow Editor',
    description:
      'Design complex multi-agent pipelines with a node-based editor. Chain agents, add conditions, parallel execution, and data transformation.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Kanban,
    title: 'Ticket & Kanban',
    description:
      'Track work across agents with a powerful ticket system. Link conversations to tickets and see the full history of agent interactions.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: MessageSquare,
    title: 'Multi-Session Chat',
    description:
      'Run multiple conversation threads, fork sessions from any message, and organize chats with color-coded labels.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Puzzle,
    title: 'MCP Tool Protocol',
    description:
      'Configure different MCP servers per agent. Need Slack alerts? Database access? Custom APIs? Just add the right MCP.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: GitBranch,
    title: 'Research Tracking',
    description:
      'Track research workflows: paper fetching, summarization, hypothesis generation, experimentation, and verification.',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Layers,
    title: 'Epic Organization',
    description:
      'Group related tickets into epics for hierarchical organization. Perfect for tracking large research projects.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: History,
    title: 'Full Audit Trail',
    description:
      'Every action is logged with actor information (human or agent). Never lose track of what happened and when.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Event-Driven Flows',
    description:
      'Trigger workflows from ticket events, cron schedules, or manual actions. Build reactive automation systems.',
    color: 'from-sky-500 to-blue-500',
  },
  {
    icon: Settings2,
    title: 'Extended Thinking',
    description:
      'Configure thinking levels from quick responses to ultra-deep analysis with adjustable token budgets.',
    color: 'from-fuchsia-500 to-purple-500',
  },
  {
    icon: Shield,
    title: '100% Local & Private',
    description:
      'All data stays on your machine. No data collection, no tracking. Your AI interactions remain private.',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description:
      'Desktop and sound notifications for agent completions, errors, and important events.',
    color: 'from-red-500 to-rose-500',
  },
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
  return (
    <section id="features" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-bg opacity-50" />
      
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
            Powerful Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Everything You Need to
            <span className="text-gradient"> Manage AI Agents</span>
          </h2>
          <p className="text-xl text-dark-100 max-w-2xl mx-auto">
            From single agent tasks to complex multi-agent research pipelines,
            Sciorex gives you total control over your AI workflows.
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
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-dark-100 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
