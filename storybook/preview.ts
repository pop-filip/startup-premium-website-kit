// ============================================================
// STORYBOOK PREVIEW — Place at: .storybook/preview.ts
// ============================================================

import type { Preview } from '@storybook/react';
import '../src/styles/globals.css'; // Import your global styles

const preview: Preview = {
  parameters: {
    // Backgrounds
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
        { name: 'gray', value: '#f5f5f5' },
      ],
    },

    // Viewport presets
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
      },
    },

    // Controls
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    // Layout
    layout: 'centered',

    // Accessibility
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'heading-order', enabled: true },
        ],
      },
    },
  },

  // Tags for auto-docs
  tags: ['autodocs'],
};

export default preview;
