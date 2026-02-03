/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Фирменная палитра «Напитки вместе»
        brand: {
          wine: '#9D3339',
          'wine-dark': '#450D1B',
          peach: '#F7D1AA',
          terracotta: '#945B4A',
          cream: '#F4E5CB',
          mint: '#A5D7AB',
          sky: '#C6DCFC',
          gray: '#EAEAEA',
          white: '#FFFFFF',
          forest: '#1E4B2E',
          teal: '#194245',
          charcoal: '#424242',
          black: '#000000',
        },
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        body: ['"Arial Nova"', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'brand': '12px',
      },
      transitionDuration: {
        'accordion': '250ms',
      },
    },
  },
  plugins: [],
}
