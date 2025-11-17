/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f2f5',
          100: '#d1e5eb',
          500: '#6b9aab',
          600: '#5a8596',
          700: '#4a6d7a',
        },
        beige: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
        }
      }
    },
  },
  plugins: [],
}
