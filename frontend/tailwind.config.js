/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#323437',
        'secondary': '#2C2E31',
        'accent': '#e63946',
        'text': {
          DEFAULT: '#D1D0C5',
          'darker': '#646669',
        }
      },
      fontFamily: {
        'mono': ['Roboto Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}