import { motion } from 'framer-motion';
import { Check, Crown, Users, Building2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analytics } from '../utils/analytics';

const plans = [
  {
    name: 'Personal',
    price: 'Free',
    period: '',
    description: 'Everything you need to orchestrate your AI agents',
    icon: Crown,
    color: 'from-primary-500 to-primary-600',
    popular: true,
    features: [
      'Unlimited agents',
      'Unlimited workflows',
      'Visual flow editor',
      'Kanban ticket management',
      'Full MCP support',
      'All AI models (Claude Opus, Sonnet, Haiku)',
      'Extended thinking modes',
      'Local data storage',
      'Auto-updates',
      'Community support',
    ],
    cta: 'Download Now',
    ctaLink: '#download',
    available: true,
  },
  {
    name: 'Teams',
    price: 'Coming Soon',
    period: '',
    description: 'Collaborate with your team on research workflows',
    icon: Users,
    color: 'from-accent-500 to-accent-600',
    popular: false,
    features: [
      'Everything in Personal',
      'Team workspaces',
      'Shared agent configurations',
      'Shared flow templates',
      'Team ticket boards',
      'Real-time collaboration',
      'Centralized MCP management',
      'Usage analytics',
      'Priority support',
      'Slack integration',
    ],
    cta: 'Join Waitlist',
    ctaLink: '#',
    available: false,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    period: '',
    description: 'Full-scale deployment with enterprise integrations',
    icon: Building2,
    color: 'from-emerald-500 to-emerald-600',
    popular: false,
    features: [
      'Everything in Teams',
      'Jira integration',
      'Confluence integration',
      'GitHub Enterprise',
      'Azure DevOps',
      'SSO / SAML authentication',
      'On-premise deployment',
      'Custom agent templates',
      'SLA guarantees',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    ctaLink: '#',
    available: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-30" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm text-primary-300 mb-4">
            Simple Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            Free for
            <span className="text-gradient"> Everyone</span>
          </h2>
          <p className="text-xl text-dark-100 max-w-2xl mx-auto">
            Start with full power for free. Scale up when you need team features.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl overflow-hidden ${plan.popular
                  ? 'ring-2 ring-primary-500/50'
                  : ''
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Available Now
                  </div>
                </div>
              )}

              {/* Coming Soon Overlay */}
              {!plan.available && (
                <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full bg-dark-700 text-dark-100 text-sm font-medium border border-white/10">
                    Coming Soon
                  </span>
                </div>
              )}

              <div className="glass-dark h-full">
                {/* Plan Header */}
                <div className={`p-6 border-b border-white/5`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-4xl font-display font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-dark-200 ml-2">{plan.period}</span>
                    )}
                  </div>

                  <p className="text-sm text-dark-100">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-primary-400' : 'text-dark-300'
                          }`} />
                        <span className="text-sm text-dark-100">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <a
                    href={plan.ctaLink}
                    className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all ${plan.popular
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/25'
                        : 'glass text-white hover:bg-white/10'
                      }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-dark-200 text-sm">
            Need custom integrations?{' '}
            <Link
              to="/contact"
              onClick={() => analytics.trackEnterpriseCTA()}
              className="text-primary-400 hover:text-primary-300 underline"
            >
              Let's talk →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
