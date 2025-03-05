/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/groupeisi/**/*.{html,ts}",  // Ajustez "groupeisi" avec le nom de votre projet
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#041F4E',
          light: '#0F2F61',
          dark: '#021535',
        },
        secondary: '#2A4C7D',
        accent: '#4A77B4',
        gray: {
          light: '#F9FAFB',
          DEFAULT: '#E5E7EB',
        },
        error: '#EF4444',
      },
    },
  },
  plugins: [],
}

