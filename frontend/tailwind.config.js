/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Indigo 500
        secondary: "#ec4899", // Pink 500
        dark: "#1e1e2e",    // Dark background
        darker: "#181825",
        light: "#cdd6f4",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
