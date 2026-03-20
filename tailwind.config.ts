import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#161a22',
          secondary: '#0e1015',
          card:      '#282e39',
        },
        border: {
          subtle: '#323337',
          strong: '#515255',
        },
        text: {
          primary:   '#ffffff',
          secondary: '#eeeeee',
          muted:     '#aaaaaa',
          hint:      '#999999',
          faint:     '#555555',
        },
        accent: {
          warm:      '#c4ae91',
          'warm-dim': '#a8906e',
          neon:      '#00ff9f',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],  // IBM Plex Mono — all type roles
      },
      animation: {
        'fade-in':       'fadeIn 0.6s ease-out forwards',
        'fade-up':       'fadeUp 0.6s ease-out forwards',
        'chevron-pulse': 'chevronPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        chevronPulse: {
          '0%, 100%': { transform: 'translateY(0)',  opacity: '0.3' },
          '50%':      { transform: 'translateY(5px)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}

export default config
