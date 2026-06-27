/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        petal:   '#fde8e8',
        blush:   '#f5c5c5',
        rose:    '#e8a0a0',
        gold:    '#c9996e',
        'gold-light': '#e8c9a0',
        cream:   '#fdf8f3',
        ivory:   '#faf5ef',
        'warm-white': '#fff9f5',
        'deep-rose': '#8b4a4a',
        'soft-brown': '#6b4a3a',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        script: ['Dancing Script', 'cursive'],
        body: ['Lato', 'sans-serif'],
        label: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
