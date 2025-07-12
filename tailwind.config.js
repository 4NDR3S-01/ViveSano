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
        background: "var(--background)",
        card: "var(--card)",
        foreground: "var(--foreground)",
        'muted-foreground': "var(--muted-foreground)",
        primary: "var(--primary)",
        'primary-foreground': "var(--primary-foreground)",
        secondary: "var(--secondary)",
        'secondary-foreground': "var(--secondary-foreground)",
        border: "var(--border)",
        accent: "var(--accent)",
        'accent-foreground': "var(--accent-foreground)",
      },
      boxShadow: {
        primary: "var(--shadow-primary)",
        secondary: "var(--shadow-secondary)",
      },
      borderColor: {
        strong: "var(--border-strong)",
      },
      backgroundImage: {
        'gradient-main': 'var(--background)',
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
