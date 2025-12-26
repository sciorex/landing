import { motion } from 'framer-motion';
import { Check, Crown, Users, Building2, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { analytics } from '../utils/analytics';
import { useTranslation } from 'react-i18next';

const planIcons = [Crown, Users, Building2];
const planColors = [
  'from-primary-500 to-primary-600',
  'from-accent-500 to-accent-600',
  'from-emerald-500 to-emerald-600',
];

export default function Pricing() {
  const { t } = useTranslation('pricing');
  const { locale } = useParams<{ locale: string }>();

  const plans = [
    {
      name: t('plans.personal.name'),
      price: t('plans.personal.price'),
      period: t('plans.personal.period'),
      description: t('plans.personal.description'),
      icon: planIcons[0],
      color: planColors[0],
      popular: true,
      features: (t('plans.personal.features', { returnObjects: true }) as string[]),
      cta: t('plans.personal.cta'),
      ctaLink: '#download',
      available: true,
      availableText: t('plans.personal.available'),
    },
    {
      name: t('plans.teams.name'),
      price: t('plans.teams.price'),
      period: t('plans.teams.period'),
      description: t('plans.teams.description'),
      icon: planIcons[1],
      color: planColors[1],
      popular: false,
      features: (t('plans.teams.features', { returnObjects: true }) as string[]),
      cta: t('plans.teams.cta'),
      ctaLink: '#',
      available: false,
      comingSoonText: t('plans.teams.comingSoon'),
    },
    {
      name: t('plans.enterprise.name'),
      price: t('plans.enterprise.price'),
      period: t('plans.enterprise.period'),
      description: t('plans.enterprise.description'),
      icon: planIcons[2],
      color: planColors[2],
      popular: false,
      features: (t('plans.enterprise.features', { returnObjects: true }) as string[]),
      cta: t('plans.enterprise.cta'),
      ctaLink: '#',
      available: false,
      comingSoonText: t('plans.enterprise.comingSoon'),
    },
  ];
  return (
    <section id="pricing" className="section relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />

      <div className="max-w-6xl mx-auto relative z-10">
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
                    {plan.availableText}
                  </div>
                </div>
              )}

              {/* Coming Soon Overlay */}
              {!plan.available && (
                <div className="absolute inset-0 bg-section/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full glass-dark text-heading text-sm font-medium border border-glass-border">
                    {plan.comingSoonText}
                  </span>
                </div>
              )}

              <div className="glass-dark h-full">
                {/* Plan Header */}
                <div className={`p-6 border-b border-glass-border`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-heading">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-4xl font-display font-bold text-heading">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted ml-2">{plan.period}</span>
                    )}
                  </div>

                  <p className="text-sm text-muted">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-primary-400' : 'text-muted'
                          }`} />
                        <span className="text-sm text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <a
                    href={plan.ctaLink}
                    className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all ${plan.popular
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/25'
                      : 'btn-secondary'
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
          <p className="text-muted text-sm">
            {t('enterpriseCTA.text')}{' '}
            <Link
              to={`/${locale || 'en'}/contact`}
              onClick={() => analytics.trackEnterpriseCTA()}
              className="text-primary-400 hover:text-primary-300 underline"
            >
              {t('enterpriseCTA.linkText')} →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
