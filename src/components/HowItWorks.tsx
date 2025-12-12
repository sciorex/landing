import { motion } from 'framer-motion';
import { Bot, Workflow, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Bot,
    title: 'Create Specialized Agents',
    description:
      'Define AI agents with specific prompts, tool permissions, and MCP configurations. Create a Paper Fetcher, a Hypothesis Generator, an Experiment Runner: each optimized for its role.',
    image: '/screenshots/step-config.png',
  },
  {
    number: '02',
    icon: Workflow,
    title: 'Design Your Workflow',
    description:
      'Use the visual flow editor to chain agents together. Add conditional branches, parallel execution, and data transformation nodes to build sophisticated pipelines.',
    image: '/screenshots/step-flow.png',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Track Everything with Tickets',
    description:
      'As agents work, their outputs link to tickets automatically. View the Kanban board to see progress, drill into any ticket for full conversation history and agent execution logs.',
    image: '/screenshots/step-kanban.png',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section relative overflow-hidden bg-dark-800/50">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 mb-4">
            Simple Yet Powerful
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            How
            <span className="text-gradient"> It Works</span>
          </h2>
          <p className="text-xl text-dark-100 max-w-2xl mx-auto">
            From agent creation to workflow automation in three simple steps.
            No coding required. Just drag, drop, and orchestrate.
          </p>
        </motion.div>
        
        {/* Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-6xl font-display font-bold text-gradient opacity-50">
                    {step.number}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center border border-white/10">
                    <step.icon className="w-7 h-7 text-primary-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-display font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-dark-100 leading-relaxed mb-6">
                  {step.description}
                </p>
                {index === steps.length - 1 && (
                  <a
                    href="#download"
                    className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold group"
                  >
                    Get Started Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
              
              {/* Image */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-3xl blur-2xl" />
                  <div className="image-frame relative">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
