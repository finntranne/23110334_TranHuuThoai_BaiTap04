/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2f5acf", // Coolmate Blue
        secondary: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
        coolmateBlue: "#2f5acf",
        coolmateBlack: "#111111",
        coolmateGray: "#2f3033",
        coolmateLight: "#f4f4f4",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}