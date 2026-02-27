/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        // You can name this anything you want (e.g., 'primary', 'raleway', 'sans-new')
        'raleway': ['Raleway', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'], // Example for another font
        'lato': ['Lato', 'sans-serif'],
        'yellowtail': ['"Yellowtail"', '"Yellowtail Fallback"', 'cursive'],
      },  
      
      
    },
  },
  plugins: [],
}
