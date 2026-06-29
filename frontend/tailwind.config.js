/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        verde: '#009B3A',
        amarelo: '#FEDD00',
        azul: '#002776',
      },
    },
  },
  plugins: [],
}
