/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        mist: '#eef2f7',
        brand: '#2563eb',
        success: '#15803d',
        warning: '#b45309',
        danger: '#b91c1c',
      },
    },
  },
  plugins: [],
};
