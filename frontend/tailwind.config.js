/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1e1e1e',
        text: '#ffffff',
        accent: '#ec9f05',
        muted: '#999999',
        primary: '#ff4e00',
      },
    },
  },
  plugins: [],
};