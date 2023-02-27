/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
    "./src/components/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  important: true,
  plugins: [require("@tailwindcss/forms")({strategy: 'class'})],
  theme: {
    extend: {
      colors: {
        blurple: "#635BFF",
      },
    },
  },
};
