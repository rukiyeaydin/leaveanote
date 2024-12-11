/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'shadowBlue': '1px 1px 10px 1px rgba(0, 255, 255, 0.7)',
      }
    },
  },
  plugins: [],
}