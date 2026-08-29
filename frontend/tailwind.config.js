/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a1e42',
          blue: '#003366',
          gold: '#dfb24c',
          goldHover: '#c49a38',
        }
      }
    },
  },
  plugins: [],
}
