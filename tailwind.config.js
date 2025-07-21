/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Geist", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
        mono: ["Geist Mono", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      colors: {
        primary: "#7c3aed",
        'primary-foreground': "#ffffff",
        secondary: "#f472b6",
        'secondary-foreground': "#ffffff",
      },
      boxShadow: {
        primary: "0 6px 32px 0 rgba(124,58,237,0.18), 0 1.5px 4px 0 rgba(124,58,237,0.10)",
        secondary: "0 2px 8px 0 rgba(31,38,135,0.10)",
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
