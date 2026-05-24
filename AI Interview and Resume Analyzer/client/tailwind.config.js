/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Supports switching to dark mode
  theme: {
    extend: {
      colors: {
        darkBg: '#090D1A',
        darkCard: '#121829',
        darkBorder: '#1F293D',
        brandPrimary: '#6366F1', // indigo-500
        brandSecondary: '#A855F7', // purple-500
        brandGlow: 'rgba(99, 102, 241, 0.15)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
