import { Metadata } from 'next';

// ============================================================
// SEO CONFIG — Centralized SEO defaults
// ============================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Your Site Name';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
  locale?: string;
}

/**
 * Generate complete metadata for any page.
 * 
 * Usage in page.tsx:
 * ```
 * export const metadata = generateMetadata({
 *   title: 'About Us',
 *   description: 'Learn more about our company',
 *   path: '/about',
 * });
 * ```
 */
export function generateSEOMetadata({
  title,
  description,
  path = '',
  image = '/og-default.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords = [],
  noIndex = false,
  locale = 'sr_RS',
}: SEOProps): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = path === '/' || path === '' 
    ? `${title} | ${SITE_NAME}` 
    : `${title} | ${SITE_NAME}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: author ? [{ name: author }] : undefined,
    creator: SITE_NAME,
    publisher: SITE_NAME,
    
    // Robots
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },

    // Canonical URL
    alternates: {
      canonical: url,
      // Add language alternates here:
      // languages: {
      //   'en': `${SITE_URL}/en${path}`,
      //   'sr': `${SITE_URL}/sr${path}`,
      // },
    },

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '',
    },
  };
}


// ============================================================
// SCHEMA.ORG — JSON-LD structured data generators
// ============================================================

export function organizationSchema(data: {
  name: string;
  url: string;
  logo: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  socialProfiles?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    email: data.email,
    telephone: data.phone,
    address: data.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: data.address.street,
          addressLocality: data.address.city,
          postalCode: data.address.postalCode,
          addressCountry: data.address.country,
        }
      : undefined,
    sameAs: data.socialProfiles,
  };
}

export function websiteSchema(data: {
  name: string;
  url: string;
  searchUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    ...(data.searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${data.searchUrl}?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };
}

export function articleSchema(data: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  publisherName: string;
  publisherLogo: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    url: data.url,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: { '@type': 'Person', name: data.authorName },
    publisher: {
      '@type': 'Organization',
      name: data.publisherName,
      logo: { '@type': 'ImageObject', url: data.publisherLogo },
    },
  };
}

export function productSchema(data: {
  name: string;
  description: string;
  image: string;
  url: string;
  price: string;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  rating?: { value: number; count: number };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    url: data.url,
    brand: data.brand ? { '@type': 'Brand', name: data.brand } : undefined,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency,
      availability: `https://schema.org/${data.availability}`,
      url: data.url,
    },
    ...(data.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.rating.value,
        reviewCount: data.rating.count,
      },
    }),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function localBusinessSchema(data: {
  name: string;
  url: string;
  phone: string;
  address: { street: string; city: string; postalCode: string; country: string };
  geo: { lat: number; lng: number };
  openingHours?: string[];
  image?: string;
  priceRange?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    url: data.url,
    telephone: data.phone,
    image: data.image,
    priceRange: data.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.street,
      addressLocality: data.address.city,
      postalCode: data.address.postalCode,
      addressCountry: data.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.geo.lat,
      longitude: data.geo.lng,
    },
    openingHoursSpecification: data.openingHours,
  };
}


// ============================================================
// JSON-LD COMPONENT — Drop this into your layout
// ============================================================

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
