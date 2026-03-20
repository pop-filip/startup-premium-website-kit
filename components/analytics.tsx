'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { hasConsent } from './cookie-consent';

// ============================================================
// GOOGLE ANALYTICS 4 — GDPR-Compliant Wrapper
// Only loads after user gives analytics consent
// ============================================================

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function Analytics() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Check initial consent
    setConsentGiven(hasConsent('analytics'));

    // Listen for consent changes
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setConsentGiven(detail?.analytics === true);
    };

    window.addEventListener('consent-updated', handler);
    return () => window.removeEventListener('consent-updated', handler);
  }, []);

  if (!GA_ID || !consentGiven) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  );
}


// ============================================================
// EVENT TRACKING HELPERS
// ============================================================

type EventParams = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
};

export function trackEvent({ action, category, label, value, ...rest }: EventParams) {
  if (!hasConsent('analytics')) return;
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
}

// Pre-defined event helpers
export const events = {
  // CTA clicks
  ctaClick: (label: string) =>
    trackEvent({ action: 'cta_click', category: 'engagement', label }),

  // Form submissions
  formSubmit: (formName: string) =>
    trackEvent({ action: 'form_submit', category: 'conversion', label: formName }),

  // Page scroll depth
  scrollDepth: (percentage: number) =>
    trackEvent({ action: 'scroll_depth', category: 'engagement', value: percentage }),

  // File downloads
  fileDownload: (fileName: string) =>
    trackEvent({ action: 'file_download', category: 'engagement', label: fileName }),

  // External link clicks
  outboundLink: (url: string) =>
    trackEvent({ action: 'outbound_click', category: 'engagement', label: url }),

  // Search
  search: (query: string) =>
    trackEvent({ action: 'search', category: 'engagement', label: query }),

  // E-commerce
  addToCart: (productId: string, value: number) =>
    trackEvent({ action: 'add_to_cart', category: 'ecommerce', label: productId, value }),

  purchase: (orderId: string, value: number) =>
    trackEvent({ action: 'purchase', category: 'ecommerce', label: orderId, value }),
};
