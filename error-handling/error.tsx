'use client';

// ============================================================
// GLOBAL ERROR PAGE — Place at: app/error.tsx
// Catches all unhandled errors in the app
// ============================================================

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        background: '#FAFAFA',
      }}
    >
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔧</div>
      <h1 style={{ fontSize: '1.75rem', color: '#1B2A4A', margin: '0 0 0.5rem' }}>
        Došlo je do greške
      </h1>
      <p style={{ color: '#5A6A7A', maxWidth: '450px', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
        Izvinjavamo se na neugodnosti. Naš tim je obavešten i radimo na rešavanju problema.
      </p>

      {process.env.NODE_ENV === 'development' && (
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
        </pre>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 2rem',
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
            padding: '0.75rem 2rem',
            background: 'transparent',
            color: '#5A6A7A',
            border: '1px solid #D4D4D4',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          Početna strana
        </button>
      </div>

      {error.digest && (
        <p style={{ color: '#A3A3A3', fontSize: '0.75rem', marginTop: '2rem' }}>
          Error ID: {error.digest}
        </p>
      )}
    </main>
  );
}
