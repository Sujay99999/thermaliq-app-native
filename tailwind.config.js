/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1976D2',
          dark: '#0D47A1',
          light: '#42A5F5',
        },
        accent: '#42A5F5',
        success: '#10b981',
        warning: '#fbbf24',
      },
    },
  },
  plugins: [],
}
