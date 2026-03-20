// ============================================================
// ESLINT CONFIG — Premium Website Standards
// Place at project root: .eslintrc.js
// npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
//   eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks
//   eslint-config-next eslint-config-prettier
// ============================================================

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/strict',        // Strictest accessibility rules
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',                        // Must be last — disables conflicting rules
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jsx-a11y', 'react'],
  
  rules: {
    // --- Accessibility (WCAG AA) ---
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/media-has-caption': 'warn',
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',

    // --- TypeScript ---
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'error',

    // --- React ---
    'react/react-in-jsx-scope': 'off',  // Not needed in Next.js
    'react/prop-types': 'off',           // Using TypeScript
    'react/self-closing-comp': 'error',
    'react/no-array-index-key': 'warn',

    // --- Performance ---
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',

    // --- Code Quality ---
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'eqeqeq': ['error', 'always'],
    'no-nested-ternary': 'warn',
  },

  settings: {
    react: { version: 'detect' },
  },

  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'public/',
    '*.config.js',
    '*.config.mjs',
  ],
};
