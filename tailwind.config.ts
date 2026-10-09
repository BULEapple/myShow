import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 深色主题基础色
        background: '#0B0F1A',
        surface: '#111827',
        foreground: '#E6EAF2',
        muted: '#9AA4B2',
        accent: {
          DEFAULT: '#6C8CFF',
          soft: '#8AA2FF',
        },
      },
      borderRadius: {
        card: '16px',
        chip: '12px',
      },
      maxWidth: {
        content: '1200px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config
