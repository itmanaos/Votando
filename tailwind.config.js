
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'shrink-width': 'shrinkWidth 4s linear forwards',
      },
      keyframes: {
        shrinkWidth: {
          'from': { width: '100%' },
          'to': { width: '0%' },
        }
      }
    },
  },
  plugins: [],
}
