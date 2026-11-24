/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'life-blue': '#3B82F6',
        'life-blue-dark': '#2563EB',
        'life-bg': '#F5F9FC',
        'life-bg-alt': '#F2F7FA',
        'life-footer': '#1A202C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
