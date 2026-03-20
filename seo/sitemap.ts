import { MetadataRoute } from 'next';

/**
 * Dynamic sitemap generator for Next.js App Router.
 * Place this file at: app/sitemap.ts
 * 
 * Next.js will automatically generate /sitemap.xml
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- Static pages ---
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Add more static pages here...
  ];

  // --- Dynamic pages (example: blog posts from CMS/database) ---
  // Uncomment and modify based on your data source:
  //
  // const posts = await fetch(`${SITE_URL}/api/posts`).then(res => res.json());
  // const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
  //   url: `${SITE_URL}/blog/${post.slug}`,
  //   lastModified: new Date(post.updatedAt),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }));

  // --- Dynamic pages (example: products) ---
  // const products = await fetch(`${SITE_URL}/api/products`).then(res => res.json());
  // const productPages: MetadataRoute.Sitemap = products.map((product) => ({
  //   url: `${SITE_URL}/products/${product.slug}`,
  //   lastModified: new Date(product.updatedAt),
  //   changeFrequency: 'daily' as const,
  //   priority: 0.7,
  // }));

  return [
    ...staticPages,
    // ...blogPages,
    // ...productPages,
  ];
}
