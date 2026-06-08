import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#fdf2f4",
          100: "#fce7eb",
          200: "#f9d0d9",
          300: "#f4a9ba",
          400: "#ec7593",
          500: "#e04470",
          600: "#cc2553",
          700: "#ac1840",
          800: "#8B1E3F",
          900: "#7a1a38",
          950: "#440c1e",
        },
        gold: {
          50: "#fdf9ee",
          100: "#faf0d0",
          200: "#f4dea0",
          300: "#edc566",
          400: "#e6ab3a",
          500: "#D4A017",
          600: "#c08a10",
          700: "#9d6c10",
          800: "#825515",
          900: "#6d4616",
          950: "#3e2508",
        },
        leaf: {
          50: "#f2f8f0",
          100: "#e1f0dc",
          200: "#c4e1bb",
          300: "#97ca8e",
          400: "#67ae5d",
          500: "#4E7D3A",
          600: "#3d7030",
          700: "#325927",
          800: "#2a4821",
          900: "#233c1c",
          950: "#10200d",
        },
        cream: "#FFF8E7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        tamil: ["var(--font-noto-serif-tamil)", "serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "kolam-pattern": "url('/patterns/kolam.svg')",
        "hero-gradient":
          "linear-gradient(135deg, #8B1E3F 0%, #D4A017 50%, #4E7D3A 100%)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "premium": "0 20px 60px -10px rgba(139, 30, 63, 0.3)",
        "gold": "0 4px 20px rgba(212, 160, 23, 0.4)",
        "card": "0 4px 24px rgba(0,0,0,0.08)",
        "card-hover": "0 12px 40px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
