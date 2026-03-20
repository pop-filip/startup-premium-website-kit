'use client';

import React, { useState, useEffect, useCallback } from 'react';

// ============================================================
// GDPR COOKIE CONSENT BANNER
// Features: Granular consent, remembers choice, blocks scripts
// ============================================================

interface ConsentPreferences {
  necessary: boolean;   // Always true — cannot be disabled
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: string;
}

const CONSENT_KEY = 'cookie-consent-preferences';
const CONSENT_VERSION = '1.0'; // Bump this to re-ask consent

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: '',
};

export function getConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function hasConsent(category: keyof ConsentPreferences): boolean {
  const consent = getConsent();
  if (!consent) return false;
  return consent[category] === true;
}

/**
 * Use this function to conditionally load third-party scripts.
 * Example:
 *   if (hasConsent('analytics')) { loadGoogleAnalytics(); }
 */


export function CookieConsent({
  privacyPolicyUrl = '/privacy-policy',
  onConsentChange,
}: {
  privacyPolicyUrl?: string;
  onConsentChange?: (preferences: ConsentPreferences) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setPreferences(existing);
    }
  }, []);

  const saveConsent = useCallback((prefs: ConsentPreferences) => {
    const withTimestamp = { ...prefs, timestamp: new Date().toISOString() };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(withTimestamp));
    setPreferences(withTimestamp);
    setVisible(false);
    onConsentChange?.(withTimestamp);

    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('consent-updated', { detail: withTimestamp }));
  }, [onConsentChange]);

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true, preferences: true, timestamp: '' });
  };

  const rejectAll = () => {
    saveConsent({ ...DEFAULT_PREFERENCES, timestamp: '' });
  };

  const saveSelected = () => {
    saveConsent(preferences);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50000,
        background: '#ffffff',
        borderTop: '2px solid #2E75B6',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        padding: '1.5rem',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main message */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#1B2A4A' }}>
            Koristimo kolačiće 🍪
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#5A6A7A', lineHeight: 1.5 }}>
            Koristimo kolačiće za poboljšanje vašeg iskustva, analizu saobraćaja i personalizaciju sadržaja. 
            Možete izabrati koje kategorije dozvoljavate.{' '}
            <a href={privacyPolicyUrl} style={{ color: '#2E75B6' }}>
              Politika privatnosti
            </a>
          </p>
        </div>

        {/* Granular controls */}
        {showDetails && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            margin: '1rem 0',
            padding: '1rem',
            background: '#F0F4F8',
            borderRadius: '8px',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <input type="checkbox" checked disabled />
              <span><strong>Neophodni</strong> — Uvek aktivni</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences(p => ({ ...p, analytics: e.target.checked }))}
              />
              <span><strong>Analitika</strong> — Google Analytics, heatmaps</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences(p => ({ ...p, marketing: e.target.checked }))}
              />
              <span><strong>Marketing</strong> — Reklame, remarketing</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.preferences}
                onChange={(e) => setPreferences(p => ({ ...p, preferences: e.target.checked }))}
              />
              <span><strong>Preferencije</strong> — Tema, jezik</span>
            </label>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={acceptAll}
            style={{
              padding: '0.7rem 1.5rem',
              background: '#2E75B6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Prihvati sve
          </button>
          
          {showDetails && (
            <button
              onClick={saveSelected}
              style={{
                padding: '0.7rem 1.5rem',
                background: '#27AE60',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Sačuvaj izbor
            </button>
          )}

          <button
            onClick={rejectAll}
            style={{
              padding: '0.7rem 1.5rem',
              background: 'transparent',
              color: '#5A6A7A',
              border: '1px solid #C0CCD8',
              borderRadius: '6px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Samo neophodni
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              padding: '0.7rem 1rem',
              background: 'transparent',
              color: '#2E75B6',
              border: 'none',
              fontSize: '0.9rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              minHeight: '44px',
            }}
          >
            {showDetails ? 'Sakrij opcije' : 'Prilagodi'}
          </button>
        </div>
      </div>
    </div>
  );
}
