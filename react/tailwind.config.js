/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arial: ['Arial', 'sans'],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animated")
  ],
}

