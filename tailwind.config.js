/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enables dark mode support
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // Custom blue color
        background: "#F9FAFB", // Light background for log viewer
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Better readability
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Improves form elements styling
    require('@tailwindcss/typography'), // Helps with readable logs
  ],
};
