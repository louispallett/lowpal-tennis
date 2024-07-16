/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        "minArticle": "40em",
        "maxArticle": "70em"
      }
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      sedan: ["Sedan", "sans-serif"],
    }
  },
  plugins: [],
}