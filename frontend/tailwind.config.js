/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#080A0E',
        'surface': '#111318',
        'surface-raised': '#1C1F28',
        'border': '#252830',
        'accent': '#A8FF3E',
        'accent-hover': '#92E630',
        'accent-muted': 'rgba(168, 255, 62, 0.1)',
        'text-primary': '#ECEEF2',
        'text-secondary': '#8B92A5',
        'text-muted': '#4B5563',
        'danger': '#EF4444',
        'warning': '#F59E0B',
        'success': '#22C55E',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
