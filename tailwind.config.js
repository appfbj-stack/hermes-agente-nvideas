/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a2e',
          light: '#2a2a4a',
        },
        secondary: {
          DEFAULT: '#7b68ee',
          light: '#9a8cf2',
        },
        accent: '#28a745'
      }
    },
  },
  plugins: [],
};
