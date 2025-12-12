declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function trackEvent(event: string, props?: Record<string, string>) {
  if (window.plausible) {
    window.plausible(event, props ? { props } : undefined);
  }
}

export const analytics = {
  trackDownload: (os: string, variant: string) => {
    trackEvent('Download', { os, variant });
  },
  trackSocialClick: (platform: string) => {
    trackEvent('Social Click', { platform });
  },
  trackContactClick: (type: string) => {
    trackEvent('Contact Click', { type });
  },
  trackEnterpriseCTA: () => {
    trackEvent('Enterprise CTA');
  },
};
