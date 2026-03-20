import { describe, it, expect } from 'vitest';

// ============================================================
// EXAMPLE UNIT TESTS — Place in: src/__tests__/helpers.test.ts
// Run: npx vitest
// ============================================================

// Import your helpers (adjust path for your project)
// import { slugify, truncate, isValidEmail, isValidPhone, formatCurrency, getInitials, readingTime } from '@/lib/helpers';

// --- Inline copies for demo (delete when using real imports) ---
function slugify(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[čćžšđ]/g, (c) => ({ č: 'c', ć: 'c', ž: 'z', š: 's', đ: 'dj' } as any)[c] || c)
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.substring(0, max).replace(/\s+\S*$/, '') + '…';
}
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone: string): boolean {
  return /^(\+381|0)[1-9][0-9]{7,8}$/.test(phone.replace(/[\s-]/g, ''));
}
function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
}
function readingTime(text: string, wpm = 200): string {
  const words = text.trim().split(/\s+/).length;
  return `${Math.ceil(words / wpm)} min čitanja`;
}
// --- End inline copies ---


describe('slugify', () => {
  it('converts basic text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('handles Serbian characters', () => {
    expect(slugify('Čevapčići i Đuveč')).toBe('cevapcici-i-djuvec');
  });

  it('removes special characters', () => {
    expect(slugify('Price: $100!')).toBe('price-100');
  });

  it('handles multiple spaces and hyphens', () => {
    expect(slugify('  too   many   spaces  ')).toBe('too-many-spaces');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});


describe('truncate', () => {
  it('returns original if within limit', () => {
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('truncates at word boundary', () => {
    const result = truncate('This is a longer sentence that needs truncating', 20);
    expect(result.length).toBeLessThanOrEqual(21); // +1 for ellipsis char
    expect(result).toContain('…');
  });

  it('handles exact length', () => {
    expect(truncate('Exact', 5)).toBe('Exact');
  });
});


describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('name.surname@company.co.rs')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('@no-user.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user @domain.com')).toBe(false);
  });
});


describe('isValidPhone', () => {
  it('accepts valid Serbian phone numbers', () => {
    expect(isValidPhone('+381641234567')).toBe(true);
    expect(isValidPhone('0641234567')).toBe(true);
    expect(isValidPhone('+381 64 123 4567')).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('+1234567890')).toBe(false);
  });
});


describe('getInitials', () => {
  it('returns initials from full name', () => {
    expect(getInitials('Marko Petrović')).toBe('MP');
  });

  it('handles single name', () => {
    expect(getInitials('Marko')).toBe('M');
  });

  it('limits to 2 characters', () => {
    expect(getInitials('Ana Marija Petrović')).toBe('AM');
  });
});


describe('readingTime', () => {
  it('calculates reading time', () => {
    const text = Array(400).fill('word').join(' '); // 400 words
    expect(readingTime(text)).toBe('2 min čitanja');
  });

  it('rounds up to 1 min for short text', () => {
    expect(readingTime('Short text')).toBe('1 min čitanja');
  });
});
