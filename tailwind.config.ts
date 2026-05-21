import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF7F1",
          100: "#F2EEE7",
          200: "#E6DFD2",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          soft: "#3D3D3D",
          mute: "#6B6B6B",
          faint: "#9C9C9C",
        },
        gold: {
          DEFAULT: "#C9A961",
          dark: "#A88B45",
        },
        signal: {
          up: "#3E6B47",
          down: "#B4422D",
          flat: "#7A7A7A",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightish: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
