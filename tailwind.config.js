import { type Config } from "tailwindcss";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Fraunces", "serif"],
        display: ["Newsreader", "serif"],
      },
      colors: {
        background: "#FBFAF6",
        foreground: "#1F2937",
        muted: "#6B7280",
        card: "#FFFFFF",
        border: "#E5E7EB",
        accent: "#374151",
        primary: "#1F2937",
        secondary: "#6B7280",
      },
    },
  },
  plugins: [
    require("@tailwindcss/vite"),
  ],
} satisfies Config;
