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
| `sw.js` | Service Worker — offline cache, PWA | Lighthouse PWA score, offline support |
| `PWARegistration.tsx` | SW registracija + install prompt | Add to Home Screen |

---

## ⚡ Performance Checklist (vanilla HTML projekti)

Za vanilla HTML/CSS/JS projekte (bez Next.js), ručno implementirati:

```html
<!-- 1. Preload hero resursa -->
<link rel="preload" href="videos/hero.mp4" as="video" type="video/mp4">

<!-- 2. fetchpriority na hero elementu -->
<video fetchpriority="high" ...>

<!-- 3. format-detection — sprječava iOS auto-linkovanje -->
<meta name="format-detection" content="telephone=no, date=no, email=no, address=no">

<!-- 4. WebM fallback za video (VP9, manji od MP4) -->
<video>
  <source src="hero.webm" type="video/webm">  <!-- VP9, ~30% manji -->
  <source src="hero.mp4"  type="video/mp4">   <!-- fallback -->
</video>

<!-- 5. Service Worker registracija -->
<script>
  if('serviceWorker' in navigator){
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(()=>{}));
  }
</script>
```

### ffmpeg — WebM konverzija
```bash
# VP9 WebM (optimalno za web, bez audio jer je video muted)
ffmpeg -i video.mp4 -c:v libvpx-vp9 -crf 33 -b:v 0 -an -deadline good -cpu-used 2 video.webm
```

### Speakable Schema (voice search)
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".hero-tagline", ".page-description"]
  },
  "url": "https://yourdomain.com/"
}
```

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

---

## 🔍 SEO — Kako funkcionišu Keywords

**`<meta name="keywords">`** — Google ga ignoriše od 2009. Bing ga djelimično koristi.

**Što Google stvarno gleda (po važnosti):**

| Signal | Važnost | Napomena |
|---|---|---|
| **Title tag** | ⭐⭐⭐⭐⭐ | Max 60 znakova, primarna ključna riječ na početku |
| **Meta description** | ⭐⭐⭐⭐ | Utječe na CTR, max 160 znakova, action-oriented |
| **H1/H2 naslovi** | ⭐⭐⭐⭐ | Ključne riječi prirodno u naslovima sekcija |
| **Tekst na stranici** | ⭐⭐⭐⭐ | Prirodno korištenje, ne keyword stuffing |
| **Schema.org markup** | ⭐⭐⭐⭐ | Rich results, LocalBusiness, FAQ, Breadcrumbs |
| **Core Web Vitals** | ⭐⭐⭐⭐ | LCP < 2.5s, CLS < 0.1, FID < 100ms |
| **Backlinks** | ⭐⭐⭐⭐⭐ | Vanjski sajtovi koji linkuju na tebe |
| **meta keywords** | ❌ | Google ignoriše |

### Title tag formula
```
Primarna KR — Sekundarna KR | Brend
npr: "Videograf Österreich — Hochzeitsfilm & Imagefilm | matografie.at"
```

### Meta description formula
```
[Šta radiš] + [Gdje/Za koga] + [Benefit] + [CTA]
npr: "Professioneller Videograf in Österreich. Hochzeitsfilme & Imagefilme. Wien · Linz · Salzburg. Jetzt anfragen."
```

---

## 🗺️ Schema.org — Preporučena Struktura

```
@graph
├── Person / Organization          ← Ko si / što je firma
├── LocalBusiness (ako imaš lokaciju)  ← Google Maps, priceRange
│   └── hasOfferCatalog
│       └── Service[] (sa cijenama)   ← Rich results za usluge
├── WebSite (sa SearchAction)          ← Site-wide search
└── WebPage + BreadcrumbList           ← Per-page navigacija
```

### Dostupni schema generatori u `seo-metadata.tsx`

| Funkcija | Schema tip | Kada koristiti |
|---|---|---|
| `organizationSchema()` | Organization | Svaka stranica (u layout) |
| `websiteSchema()` | WebSite | Svaka stranica (u layout) |
| `localBusinessSchema()` | LocalBusiness | Lokalni biznis sa adresom |
| `articleSchema()` | Article | Blog postovi |
| `productSchema()` | Product | E-commerce proizvodi |
| `breadcrumbSchema()` | BreadcrumbList | Sve stranice osim home |
| `faqSchema()` | FAQPage | Stranice sa FAQ sekcijom |

### LocalBusiness primjer (za freelancere/agencije)
```tsx
<JsonLd data={localBusinessSchema({
  name: 'Tvoje Ime / Firma',
  url: 'https://yourdomain.com',
  phone: '+43XXXXXXXXX',
  address: { street: '', city: 'Linz', postalCode: '4020', country: 'AT' },
  geo: { lat: 48.3069, lng: 14.2858 },
  priceRange: '€€',
  image: 'https://yourdomain.com/og-image.jpg',
})} />
```

---

## 🔒 Security Headers — Nginx Config

Za produkcijski Nginx server, dodaj u server blok:

```nginx
# Clickjacking zaštita
add_header X-Frame-Options "DENY";

# MIME sniffing zaštita
add_header X-Content-Type-Options "nosniff";

# Referrer privacy
add_header Referrer-Policy "strict-origin-when-cross-origin";

# Disable browser features
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()";

# Force HTTPS (samo nakon SSL setup-a)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Content Security Policy (prilagodi domenama koje koristiš)
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.web3forms.com https://www.google-analytics.com;
";
```

### Next.js — Security Headers (već u `next.config.js`)
Starter kit `next.config.js` već uključuje sve security headere automatski za Next.js deployment.

---

## 🤖 robots.txt — Preporučena Konfiguracija

```txt
User-agent: *
Allow: /

# Blokirati admin/API rute od crawlanja
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## 📊 Google Search Console — Checklist (nakon go-live)

1. **Dodaj domenu** na [search.google.com/search-console](https://search.google.com/search-console)
2. **Verifikuj vlasništvo** — HTML meta tag ili DNS TXT zapis
3. **Submit sitemap** — Settings → Sitemaps → `https://yourdomain.com/sitemap.xml`
4. **URL Inspection** — provjeri da li Google može crawlati homepage
5. **Core Web Vitals** — provjeri LCP, CLS, FID izvještaj

---

## 🖼️ og-image.jpg — Preporučene Dimenzije

```
Dimenzije: 1200 × 630 px
Format: JPG (bolji za WhatsApp/Facebook preview)
Veličina: < 300KB
Tekst na slici: ime, titula, domena
```

Koristi za: WhatsApp preview, Facebook, LinkedIn, Twitter/X, iMessage, Slack

---

Kreirano sa Claude AI — 2026
