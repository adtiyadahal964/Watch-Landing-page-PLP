import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#151411",
        ivory: "#f6f1e8",
        gold: "#b58a46",
        champagne: "#d4b477",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(181, 138, 70, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
