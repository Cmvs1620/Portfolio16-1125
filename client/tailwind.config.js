/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Body / default text font
        sans: ["Wsmogila", "ui-sans-serif", "system-ui"],
        // Display / headings font (keeps Surgena as a fallback if you have it)
        display: ["Wsmogila", "Surgena", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
