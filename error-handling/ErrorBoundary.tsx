'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

// ============================================================
// ERROR BOUNDARY — Catches React rendering errors
//
// Usage:
//   <ErrorBoundary>
//     <YourApp />
//   </ErrorBoundary>
//
//   <ErrorBoundary fallback={<CustomError />}>
//     <RiskyComponent />
//   </ErrorBoundary>
// ============================================================

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to your error reporting service (Sentry, LogRocket, etc.)
    console.error('ErrorBoundary caught:', error, errorInfo);

    // Report to Sentry (uncomment when configured)
    // if (typeof window !== 'undefined' && (window as any).Sentry) {
    //   (window as any).Sentry.captureException(error, { extra: errorInfo });
    // }

    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}


// ============================================================
// DEFAULT ERROR FALLBACK UI
// ============================================================

function DefaultErrorFallback({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ fontSize: '1.5rem', color: '#1B2A4A', margin: '0 0 0.75rem' }}>
        Nešto je pošlo naopako
      </h2>
      <p style={{ color: '#5A6A7A', maxWidth: '500px', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
        Došlo je do neočekivane greške. Pokušajte ponovo ili nas kontaktirajte ako problem potraje.
      </p>

      {process.env.NODE_ENV === 'development' && error && (
        <pre
          style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.8rem',
            maxWidth: '600px',
            overflow: 'auto',
            textAlign: 'left',
            marginBottom: '1.5rem',
            color: '#991B1B',
          }}
        >
          {error.message}
          {'\n\n'}
          {error.stack}
        </pre>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={onReset}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6366F1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          Pokušaj ponovo
        </button>
        <button
          onClick={() => (window.location.href = '/')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: '#5A6A7A',
            border: '1px solid #D4D4D4',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          Nazad na početnu
        </button>
      </div>
    </div>
  );
}
