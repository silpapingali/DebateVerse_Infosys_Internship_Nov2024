/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFFFFF',
        'secondary': '#000000',
        'Favorite': '#707070'
      },
      fontFamily:{
        'primary': ["Montserrat", "sans-serif"],
        'secondary':["Nunito Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}

