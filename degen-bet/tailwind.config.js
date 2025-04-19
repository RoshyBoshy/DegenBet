/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a2e",
        secondary: "#16213e",
        background: "#0f0f1a",
        card: "#16213e",
        accent: "#0f3460",
        success: "#10b981",
        danger: "#ef4444",
        positive: "#4ade80",
        negative: "#f87171",
      },
      animation: {
        ticker: "ticker 20s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};
