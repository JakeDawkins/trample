/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '0px',
      md: '480px',
      lg: '768px',
    },
    extend: {},
  },
  plugins: [],
};
