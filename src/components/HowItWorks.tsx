import { motion } from 'framer-motion';
import { Bot, Workflow, CheckCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const stepImages = [
  '/screenshots/step-config.png',
  '/screenshots/step-flow.png',
  '/screenshots/step-kanban.png',
];

const stepIcons = [Bot, Workflow, CheckCircle];

export default function HowItWorks() {
  const { t } = useTranslation('common');

  const steps = [
    {
      number: t('howItWorks.steps.createAgents.number'),
      icon: stepIcons[0],
      title: t('howItWorks.steps.createAgents.title'),
      description: t('howItWorks.steps.createAgents.description'),
      image: stepImages[0],
    },
    {
      number: t('howItWorks.steps.designWorkflow.number'),
      icon: stepIcons[1],
      title: t('howItWorks.steps.designWorkflow.title'),
      description: t('howItWorks.steps.designWorkflow.description'),
      image: stepImages[1],
    },
    {
      number: t('howItWorks.steps.trackTickets.number'),
      icon: stepIcons[2],
      title: t('howItWorks.steps.trackTickets.title'),
      description: t('howItWorks.steps.trackTickets.description'),
      image: stepImages[2],
    },
  ];
  return (
    <section id="how-it-works" className="section relative overflow-hidden bg-section">
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
            {t('howItWorks.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            {t('howItWorks.title')}
            <span className="text-gradient"> {t('howItWorks.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
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
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
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
                <h3 className="text-3xl font-display font-bold text-heading mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-muted leading-relaxed mb-6">
                  {step.description}
                </p>
                {index === steps.length - 1 && (
                  <a
                    href="#download"
                    className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold group"
                  >
                    {t('howItWorks.getStarted')}
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
