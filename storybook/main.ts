// ============================================================
// STORYBOOK CONFIG — Place at: .storybook/main.ts
//
// Setup:
//   npx storybook@latest init
//   npm run storybook
//
// This config is pre-configured for Next.js + Tailwind
// ============================================================

import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // Where to find stories
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  // Addons
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',      // Controls, Actions, Viewport, Docs
    '@chromatic-com/storybook',          // Visual testing
    '@storybook/addon-interactions',     // Test user interactions
    '@storybook/addon-a11y',             // Accessibility checks
    '@storybook/addon-themes',           // Theme switching
  ],

  // Framework
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  // TypeScript
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },

  // Static files
  staticDirs: ['../public'],

  // Docs
  docs: {
    autodocs: 'tag', // Auto-generate docs for components with 'autodocs' tag
  },
};

export default config;
