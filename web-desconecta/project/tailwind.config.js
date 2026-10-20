/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fefae0',
        deep: '#283618',
        olive: '#606c38',
        orange: '#dda15e',
        brown: '#bc6c25',
        ink: '#283618',
        sage: '#e7ead3',
        yellow: '#f6e8b1',
        pink: '#f1d8c4',
        blue: '#c9d9d5',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
