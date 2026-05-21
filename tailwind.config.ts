import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mist — neutral surface tones (brand: Mist #EDE8E4)
        mist: {
          50: "#F7F4F0",
          100: "#EDE8E4",
          200: "#E0D9D1",
          300: "#CDC3B7",
        },
        // Slate blue — primary text / brand-dark (brand: Slate blue #1F343F)
        slate: {
          DEFAULT: "#1F343F",
          soft: "#3D5560",
          mute: "#6B7F89",
          faint: "#9CABB2",
        },
        // Denim blue — secondary brand accent (brand: Denim blue #2C537A)
        denim: {
          DEFAULT: "#2C537A",
          soft: "#3D6890",
        },
        // Powder blue — quiet accent (brand: Powder blue #7BA0B2)
        powder: "#7BA0B2",
        // Sand — warm accent (brand: Sand #D9B9A0)
        sand: {
          DEFAULT: "#D9B9A0",
          soft: "#E5CDB8",
        },
        // Salmon pink — CTA & urgency only (brand spec is explicit)
        salmon: {
          DEFAULT: "#FF787A",
          soft: "#FF9799",
        },
        // Terracotta — used for "down" signal (from brand accessibility palette)
        terracotta: "#9E6464",
        // Signal tokens — wired to brand-aligned hues
        signal: {
          up: "#2C537A",
          down: "#9E6464",
          flat: "#6B7F89",
        },
      },
      fontFamily: {
        serif: ['"Ivy Mode"', "Georgia", '"Times New Roman"', "serif"],
        sans: [
          '"Ivy Epic"',
          '"Segoe UI"',
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightish: "-0.02em",
        brand: "0.01em",
      },
      backgroundImage: {
        diamond:
          "repeating-linear-gradient(45deg, transparent 0, transparent 79px, rgba(31,52,63,0.05) 79px, rgba(31,52,63,0.05) 80px), repeating-linear-gradient(-45deg, transparent 0, transparent 79px, rgba(31,52,63,0.05) 79px, rgba(31,52,63,0.05) 80px)",
      },
    },
  },
  plugins: [],
};

export default config;
