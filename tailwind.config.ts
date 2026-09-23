import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0D0D12",
          card: "#17171F",
          light: "#FAFAFA",
          "light-card": "#FFFFFF",
        },
        ink: {
          primary: "#F5F5F7",
          secondary: "#A1A1AA",
          "primary-light": "#17171F",
          "secondary-light": "#6B6B76",
        },
        accent: {
          DEFAULT: "#E8798F",
          dim: "#B25767",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
