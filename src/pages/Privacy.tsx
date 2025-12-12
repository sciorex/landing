import { motion } from 'framer-motion';

export default function Privacy() {
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
            Privacy Policy
          </h1>
          <p className="text-dark-100">
            Last updated: December 2024
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl p-8 md:p-12"
        >
          <div className="space-y-8 text-dark-100">
            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                1. Introduction
              </h2>
              <p>
                Sciorex ("we", "our", or "us") is committed to protecting your privacy.
                We believe in minimal data collection and full transparency. This Privacy
                Policy explains what little data we collect when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                2. What We Collect
              </h2>
              <p className="mb-4">
                <strong className="text-white">We do not collect any personal data.</strong> We
                do not use cookies, we do not track you across websites, and we do not collect
                any personally identifiable information.
              </p>
              <p>
                The only data we gather is anonymous, aggregated website analytics through{' '}
                <a
                  href="https://plausible.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300"
                >
                  Plausible Analytics
                </a>
                , a privacy-focused analytics service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                3. Plausible Analytics
              </h2>
              <p className="mb-4">
                We use Plausible Analytics to understand how visitors use our website.
                Plausible is a privacy-friendly alternative to Google Analytics that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Does not use cookies</li>
                <li>Does not collect personal data</li>
                <li>Does not track you across websites</li>
                <li>Is fully GDPR, CCPA, and PECR compliant</li>
                <li>Is hosted in the EU</li>
              </ul>
              <p className="mt-4">
                The data collected includes: page views, referrer source, browser type,
                operating system, device type, and country (not city or precise location).
                This data cannot be used to identify you personally.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                4. The Sciorex Application
              </h2>
              <p>
                Sciorex is a local-first application. All your research data, workflows,
                and configurations are stored entirely on your device. We have no access
                to your data, and nothing is sent to our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                5. Third-Party AI Services
              </h2>
              <p>
                When you use AI features in Sciorex, your queries are sent directly to
                the AI provider you configure (such as Anthropic's Claude). We do not
                proxy, store, or have access to these communications. Please review the
                privacy policy of your chosen AI provider.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                6. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you
                of any changes by posting the new Privacy Policy on this page and updating
                the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white mb-4">
                7. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a
                  href="mailto:privacy@sciorex.com"
                  className="text-primary-400 hover:text-primary-300"
                >
                  privacy@sciorex.com
                </a>
                .
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
