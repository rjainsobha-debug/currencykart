import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./config/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        navy: "#0a1b35",
        royal: "#2458ff",
        mist: "#eef3f8",
        gold: "#d7ad45",
        emerald: "#10b981"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(3, 15, 35, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
