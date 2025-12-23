/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/component/**/*.{js,ts,jsx,tsx}", // singular
    "./src/components/**/*.{js,ts,jsx,tsx}", // optional if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
