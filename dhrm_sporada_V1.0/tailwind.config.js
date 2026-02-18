/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
      'blue-600':'#2D70E1' // payroll color
    }
    },
     fontFamily:{
      'poppins': ['poppins']
    },
  },
  plugins: [],
}