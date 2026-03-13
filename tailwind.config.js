export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7B3F00", // Coffee Brown
        secondary: "#F8F5F2", // Cream
        accent: "#CBA135", // Gold
        "text-primary": "#2B2B2B",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
