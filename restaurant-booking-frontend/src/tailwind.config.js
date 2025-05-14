/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Keep this as is
  theme: {
    extend: {
      colors: {
        beige: '#F5F5DC',  // Light beige color
        brown: '#8B4513',   // Brown color
        gold: '#FFD700',    // Gold color
        white: '#FFFFFF',   // White color
      },
    },
  },
  plugins: [],
};
