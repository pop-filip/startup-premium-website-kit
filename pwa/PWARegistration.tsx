'use client';

import { useEffect } from 'react';

// ============================================================
// PWA REGISTRATION — Register service worker
//
// Usage in layout.tsx:
//   <PWARegistration />
// ============================================================

export function PWARegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('SW registered:', reg.scope);

          // Check for updates every 60 minutes
          setInterval(() => reg.update(), 60 * 60 * 1000);

          // Notify user when update is available
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available — show update prompt
                if (confirm('Dostupna je nova verzija sajta. Želite li da osvežite?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((err) => console.error('SW registration failed:', err));
    }
  }, []);

  return null;
}
