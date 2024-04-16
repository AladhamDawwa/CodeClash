/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E1E1E',
        secondary: '#2E2E2E',
        tertiary: '#3E3E3E',
        accent: '#FFD700',
        light: '#F8F8F8',
        dark: '#1A1A1A',
      },
    },
  },
  plugins: [],
};
