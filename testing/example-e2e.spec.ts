import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ============================================================
// E2E TESTS — Place in: e2e/ folder
//
// npm install -D @playwright/test @axe-core/playwright
// npx playwright test
// ============================================================


test.describe('Home Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*$/); // Has any title
    await expect(page.locator('main')).toBeVisible();
  });

  test('has working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check main nav exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Click a nav link (adjust to your actual links)
    // await page.click('nav >> text=O nama');
    // await expect(page).toHaveURL('/about');
  });

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // No horizontal scroll
    const body = page.locator('body');
    const scrollWidth = await body.evaluate((el) => el.scrollWidth);
    const clientWidth = await body.evaluate((el) => el.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});


test.describe('Contact Form', () => {
  test('shows validation errors', async ({ page }) => {
    await page.goto('/contact');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Check for error messages
    // await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test('submits successfully with valid data', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form
    // await page.fill('input[name="name"]', 'Test User');
    // await page.fill('input[name="email"]', 'test@example.com');
    // await page.fill('input[name="subject"]', 'Test Subject');
    // await page.fill('textarea[name="message"]', 'This is a test message for the contact form.');
    
    // Submit
    // await page.click('button[type="submit"]');
    
    // Check success message
    // await expect(page.locator('text=uspešno')).toBeVisible();
  });
});


test.describe('SEO', () => {
  test('has meta description', async ({ page }) => {
    await page.goto('/');
    
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /.+/);
  });

  test('has Open Graph tags', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.+/);
  });

  test('has canonical URL', async ({ page }) => {
    await page.goto('/');
    
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
  });

  test('has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Should have exactly one H1
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
  });
});


test.describe('Accessibility (WCAG AA)', () => {
  test('home page has no a11y violations', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('skip to main content link works', async ({ page }) => {
    await page.goto('/');
    
    // Tab to skip link
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator('a:has-text("Skip to main")');
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeFocused();
    }
  });

  test('all images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // alt can be empty string (decorative) but must exist
      expect(alt).not.toBeNull();
    }
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab through page and check focus is visible
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      if (await focused.count() > 0) {
        const tagName = await focused.evaluate((el) => el.tagName.toLowerCase());
        // Focus should be on interactive elements
        expect(['a', 'button', 'input', 'select', 'textarea', 'summary']).toContain(tagName);
      }
    }
  });
});


test.describe('Performance', () => {
  test('page loads within 3 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('no console errors in production', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
