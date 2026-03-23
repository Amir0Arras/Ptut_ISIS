/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#0066CC',
        'medical-blue-dark': '#003D99',
        'health-green': '#00AA44',
        'health-green-dark': '#006622',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
