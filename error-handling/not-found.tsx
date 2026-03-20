import Link from 'next/link';

// ============================================================
// 404 PAGE — Place at: app/not-found.tsx
// ============================================================

export default function NotFound() {
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
      <div style={{ fontSize: '8rem', fontWeight: 900, color: '#E5E5E5', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontSize: '1.75rem', color: '#1B2A4A', margin: '1rem 0 0.5rem' }}>
        Stranica nije pronađena
      </h1>
      <p style={{ color: '#5A6A7A', maxWidth: '450px', lineHeight: 1.6, margin: '0 0 2rem' }}>
        Stranica koju tražite ne postoji, premeštena je ili je uklonjena.
        Proverite URL ili se vratite na početnu.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            padding: '0.75rem 2rem',
            background: '#6366F1',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            textDecoration: 'none',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Početna strana
        </Link>
        <Link
          href="/contact"
          style={{
            padding: '0.75rem 2rem',
            background: 'transparent',
            color: '#5A6A7A',
            border: '1px solid #D4D4D4',
            borderRadius: '8px',
            fontSize: '1rem',
            textDecoration: 'none',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Kontakt
        </Link>
      </div>

      <nav style={{ marginTop: '3rem' }}>
        <p style={{ color: '#A3A3A3', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          Možda tražite:
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { href: '/about', label: 'O nama' },
            { href: '/blog', label: 'Blog' },
            { href: '/services', label: 'Usluge' },
            { href: '/faq', label: 'FAQ' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ color: '#6366F1', textDecoration: 'none', fontSize: '0.9rem' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
