import { motion } from 'framer-motion';
import { Download, Apple, Monitor, Terminal, CheckCircle, Package, AlertTriangle, ExternalLink } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { useTranslation } from 'react-i18next';
import { DOWNLOAD_BASE_URL, DOCS_URL, config } from '../config/urls';
import { getVersionJsonUrl } from '@sciorex/shared-config';
import { useState, useEffect } from 'react';

const osIcons = [Monitor, Apple, Terminal];
const osColors = [
  'from-blue-500 to-cyan-500',
  'from-gray-400 to-gray-600',
  'from-orange-500 to-yellow-500',
];

export default function DownloadSection() {
  const { t } = useTranslation('common');
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch(getVersionJsonUrl(config));
        if (response.ok) {
          const data = await response.json();
          // Handle both signed and unsigned format
          const ver = data.data?.version || data.version;
          if (ver) setVersion(ver);
        }
      } catch {
        // Silently fail, version will just not show
      }
    };
    fetchVersion();
  }, []);

  const downloadGroups = [
    {
      os: t('download.windows'),
      icon: osIcons[0],
      color: osColors[0],
      options: [
        { name: t('download.installer'), file: 'Sciorex-win-x64.exe', size: '~200 MB', description: t('download.recommended'), url: `${DOWNLOAD_BASE_URL}/Sciorex-win-x64.exe` },
        { name: t('download.portable'), file: 'Sciorex-portable.exe', size: '~200 MB', description: t('download.noInstall'), url: `${DOWNLOAD_BASE_URL}/Sciorex-portable.exe` },
      ],
    },
    {
      os: t('download.mac'),
      icon: osIcons[1],
      color: osColors[1],
      options: [
        { name: t('download.appleSilicon'), file: 'Sciorex-mac-arm64.dmg', size: '~340 MB', description: t('download.m1m2m3'), url: `${DOWNLOAD_BASE_URL}/Sciorex-mac-arm64.dmg` },
        { name: t('download.intel'), file: 'Sciorex-mac-x64.dmg', size: '~340 MB', description: t('download.intelMacs'), url: `${DOWNLOAD_BASE_URL}/Sciorex-mac-x64.dmg` },
      ],
    },
    {
      os: t('download.linux'),
      icon: osIcons[2],
      color: osColors[2],
      options: [
        { name: t('download.appImage'), file: 'Sciorex-linux-x86_64.AppImage', size: '~250 MB', description: t('download.universal'), url: `${DOWNLOAD_BASE_URL}/Sciorex-linux-x86_64.AppImage` },
        { name: t('download.debian'), file: 'Sciorex-linux-amd64.deb', size: '~220 MB', description: t('download.aptCompatible'), url: `${DOWNLOAD_BASE_URL}/Sciorex-linux-amd64.deb` },
        { name: t('download.fedora'), file: 'Sciorex-linux-x86_64.rpm', size: '~220 MB', description: t('download.dnfCompatible'), url: `${DOWNLOAD_BASE_URL}/Sciorex-linux-x86_64.rpm` },
      ],
    },
  ];

  const features = [
    t('download.features.free'),
    t('download.features.allFeatures'),
    t('download.features.noAccount'),
    t('download.features.localPrivate'),
  ];
  return (
    <section id="download" className="section relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'var(--download-bg)' }} />
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
            {t('download.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            {t('download.title')}
            <span className="text-gradient"> {t('download.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            {t('download.subtitle')}
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
              <div className={`bg-gradient-to-r ${group.color} bg-opacity-10 p-5 border-b border-glass-border`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.color} bg-opacity-20 flex items-center justify-center`}>
                    <group.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-heading">
                      {group.os}
                    </h3>
                    {version && <p className="text-xs text-white/60">v{version}</p>}
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="p-4 space-y-3">
                {group.options.map((option) => (
                  <motion.a
                    key={option.name}
                    href={option.url}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => analytics.trackDownload(group.os, option.name)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-card-bg hover:bg-primary-500/5 border border-glass-border hover:border-primary-500/30 transition-all group"
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
                        <p className="text-sm font-medium text-heading">
                          {option.name}
                        </p>
                        <p className="text-xs text-muted opacity-80">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">{option.file}</p>
                      <p className="text-xs text-muted opacity-60">{option.size}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* macOS Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5"
        >
          <div className="flex gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-amber-300">{t('download.macNotice.title')}</p>
              <p className="text-muted">{t('download.macNotice.description')}</p>
              <code className="block rounded-lg bg-black/30 px-4 py-2.5 text-xs text-amber-200 font-mono select-all">
                {t('download.macNotice.command')}
              </code>
              <p className="text-muted text-xs">{t('download.macNotice.alternative')}</p>
              <p className="text-muted text-xs">{t('download.macNotice.sequoia')}</p>
              <a
                href={t('download.macNotice.whyUrl')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
              >
                {t('download.macNotice.whyLink')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
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
              className="flex items-center gap-2 text-muted"
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
          <p className="text-sm text-muted">
            {t('download.requirements')}{' '}
            <a href={`${DOCS_URL}/guide/getting-started`} className="text-primary-400 hover:text-primary-300 underline">
              {t('download.setupGuide')} →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
