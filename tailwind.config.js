/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.js',
    './index.js',
    './app/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
    },
  },
  plugins: [],
}

