# 🚀 Premium Website Starter Kit

Kompletan set config fajlova, komponenti i utility funkcija za kreiranje premium Next.js website-a. Svaki fajl je production-ready i spreman za copy-paste u tvoj projekat.

---

## 📁 Struktura Foldera

```
premium-starter-kit/
│
├── config/                    # Konfiguracija projekta
│   ├── next.config.js         # Next.js config sa security headers + performance
│   ├── .env.template          # Template za environment varijable
│   ├── .eslintrc.js           # ESLint sa a11y + TypeScript pravilima
│   ├── .prettierrc            # Prettier konfiguracija
│   ├── .gitignore             # Gitignore template
│   └── tailwind.config.ts     # Tailwind sa premium defaults (boje, fontovi, animacije)
│
├── seo/                       # SEO & Discoverability
│   ├── seo-metadata.tsx       # Metadata generator + Schema.org (Organization, Article, Product, FAQ, Breadcrumbs, LocalBusiness)
│   ├── sitemap.ts             # Dinamički sitemap generator za Next.js
│   └── robots.txt             # Robots.txt template
│
├── security/                  # Security
│   └── middleware.ts          # Next.js middleware (rate limiting, redirects, bot protection, maintenance mode)
│
├── accessibility/             # Accessibility (WCAG AA)
│   ├── a11y-components.tsx    # SkipToMain, VisuallyHidden, FocusTrap, LiveRegion, IconButton
│   └── a11y-utilities.css     # Focus styles, reduced motion, high contrast, dark mode
│
├── components/                # Gotove komponente
│   ├── cookie-consent.tsx     # GDPR cookie consent banner sa granularnim kontrolama
│   └── analytics.tsx          # GA4 wrapper koji poštuje cookie consent
│
├── hooks/                     # Custom React hooks
│   └── use-premium-hooks.ts   # useMediaQuery, useIntersectionObserver, useScrollProgress,
│                              # useDebounce, useLocalStorage, useCopyToClipboard,
│                              # useClickOutside, useKeyPress, useDarkMode, useScrollLock
│
├── utils/                     # Utility funkcije
│   └── helpers.ts             # cn(), formatCurrency, formatDate, slugify, truncate,
│                              # isValidEmail, isValidPhone, readingTime, generateId
│
├── ci-cd/                     # CI/CD Pipeline
│   ├── ci-cd.yml              # GitHub Actions (lint, test, security, a11y, build, deploy)
│   └── lighthouserc.json      # Lighthouse CI config (score thresholds)
│
└── docs/                      # Dokumentacija
    └── README.md              # Ovaj fajl
```

---

## ⚡ Quick Start

### 1. Kreiraj Next.js projekat
```bash
npx create-next-app@latest my-premium-site --typescript --tailwind --eslint --app --src-dir
cd my-premium-site
```

### 2. Instaliraj dependencies
```bash
npm install clsx tailwind-merge
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-jsx-a11y eslint-config-prettier prettier-plugin-tailwindcss
```

### 3. Kopiraj fajlove iz starter kit-a
```bash
# Config fajlovi → root projekta
cp config/next.config.js ./next.config.js
cp config/.eslintrc.js ./.eslintrc.js
cp config/.prettierrc ./.prettierrc
cp config/.gitignore ./.gitignore
cp config/.env.template ./.env.local
cp config/tailwind.config.ts ./tailwind.config.ts

# SEO → app/ folder
cp seo/seo-metadata.tsx ./src/lib/seo.tsx
cp seo/sitemap.ts ./src/app/sitemap.ts
cp seo/robots.txt ./public/robots.txt

# Security
cp security/middleware.ts ./src/middleware.ts

# Accessibility
cp accessibility/a11y-components.tsx ./src/components/a11y/
cp accessibility/a11y-utilities.css ./src/styles/

# Components
cp components/cookie-consent.tsx ./src/components/
cp components/analytics.tsx ./src/components/

# Hooks & Utils
cp hooks/use-premium-hooks.ts ./src/hooks/
cp utils/helpers.ts ./src/lib/

# CI/CD
mkdir -p .github/workflows
cp ci-cd/ci-cd.yml ./.github/workflows/ci-cd.yml
cp ci-cd/lighthouserc.json ./lighthouserc.json
```

### 4. Postavi u layout.tsx
```tsx
// src/app/layout.tsx
import { SkipToMain } from '@/components/a11y/a11y-components';
import { CookieConsent } from '@/components/cookie-consent';
import { Analytics } from '@/components/analytics';
import { JsonLd, organizationSchema, websiteSchema } from '@/lib/seo';
import '@/styles/a11y-utilities.css';

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body>
        <JsonLd data={organizationSchema({
          name: 'Your Company',
          url: 'https://yourdomain.com',
          logo: 'https://yourdomain.com/logo.png',
        })} />
        <JsonLd data={websiteSchema({
          name: 'Your Company',
          url: 'https://yourdomain.com',
        })} />
        
        <SkipToMain />
        <header>...</header>
        <main id="main-content">{children}</main>
        <footer>...</footer>
        
        <CookieConsent privacyPolicyUrl="/privacy-policy" />
        <Analytics />
      </body>
    </html>
  );
}
```

### 5. SEO na svakoj stranici
```tsx
// src/app/about/page.tsx
import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'O nama',
  description: 'Saznajte više o našoj kompaniji i timu.',
  path: '/about',
  keywords: ['o nama', 'tim', 'kompanija'],
});

export default function AboutPage() {
  return <div>...</div>;
}
```

---

## 🔧 Šta svaki fajl radi

| Fajl | Šta rešava | Checklist stavke |
|------|-----------|-----------------|
| `next.config.js` | Security headers, image optimization, caching | Security headers A+, WebP/AVIF, Cache-Control |
| `middleware.ts` | Rate limiting, redirects, bot protection | Brute force zaštita, canonical URLs, maintenance mode |
| `seo-metadata.tsx` | Meta tagovi, OG, Twitter Cards, Schema.org | Svi SEO i structured data zahtevi |
| `cookie-consent.tsx` | GDPR consent sa granularnim kontrolama | Cookie consent, opt-in, kategorije |
| `analytics.tsx` | GA4 koji čeka consent pre učitavanja | GDPR-compliant analytics |
| `a11y-components.tsx` | Skip link, focus trap, screen reader helpers | WCAG AA accessibility |
| `a11y-utilities.css` | Focus visible, reduced motion, dark mode | Vizuelna pristupačnost |
| `ci-cd.yml` | Automated lint, test, security, deploy | CI/CD, automatski testovi |
| `lighthouserc.json` | Performance score thresholds | Lighthouse 90+ enforcement |
| `tailwind.config.ts` | Design system (boje, tipografija, animacije) | Konzistentan dizajn |
| `helpers.ts` | Formatiranje, validacija, utility funkcije | Code quality |
| `use-premium-hooks.ts` | Responsive, animations, dark mode, clipboard | UX interakcije |

---

## 📋 Vercel Environment Variables

Dodaj u Vercel dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `SENTRY_DSN`

Za CI/CD dodaj GitHub Secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `CODECOV_TOKEN` (opciono)

---

## 🎯 Preporučeni NPM Packages

```bash
# Core
npm install next react react-dom

# Styling
npm install tailwindcss postcss autoprefixer
npm install clsx tailwind-merge

# SEO & Analytics
npm install next-sitemap    # Alternativa za sitemap generisanje

# Forms
npm install react-hook-form zod @hookform/resolvers

# Email
npm install @react-email/components resend

# Database
npm install prisma @prisma/client

# Auth
npm install next-auth

# Monitoring
npm install @sentry/nextjs

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D playwright
npm install -D axe-core @axe-core/playwright
```

---

Kreirano sa Claude AI — 2026
