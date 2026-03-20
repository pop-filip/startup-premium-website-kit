import type { Config } from 'tailwindcss';

// ============================================================
// TAILWIND CONFIG — Premium Website Defaults
// Includes: custom colors, typography, animations, responsive
// ============================================================

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // Enable dark mode via class or media query
  darkMode: 'class', // Toggle: 'class' for manual, 'media' for system

  theme: {
    extend: {
      // --- Color Palette (customize per project) ---
      colors: {
        primary: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Main brand color
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        neutral: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error:   '#EF4444',
        info:    '#3B82F6',
      },

      // --- Typography ---
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem',     { lineHeight: '1.625rem' }],  // 16px base
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':  ['2.25rem',  { lineHeight: '2.5rem' }],
        '5xl':  ['3rem',     { lineHeight: '1.15' }],
        '6xl':  ['3.75rem',  { lineHeight: '1.1' }],
      },

      // --- Spacing ---
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // --- Border Radius ---
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // --- Shadows ---
      boxShadow: {
        'soft':    '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium':  '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'strong':  '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
        'glow':    '0 0 20px rgba(99, 102, 241, 0.3)',
      },

      // --- Animations ---
      animation: {
        'fade-in':      'fadeIn 0.5s ease-out',
        'fade-up':      'fadeUp 0.6s ease-out',
        'slide-in':     'slideIn 0.3s ease-out',
        'scale-in':     'scaleIn 0.2s ease-out',
        'spin-slow':    'spin 3s linear infinite',
        'pulse-soft':   'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },

      // --- Transitions ---
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },

      // --- Screens (custom breakpoints) ---
      screens: {
        'xs':  '475px',
        '3xl': '1920px',
      },

      // --- Max Width for readable text ---
      maxWidth: {
        'readable': '75ch',
      },
    },
  },

  plugins: [
    // Uncomment as needed:
    // require('@tailwindcss/typography'),     // Prose styling for CMS content
    // require('@tailwindcss/forms'),           // Better form defaults
    // require('@tailwindcss/aspect-ratio'),    // Aspect ratio utilities
    // require('@tailwindcss/container-queries'), // Container queries
  ],
};

export default config;
