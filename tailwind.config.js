/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      opacity: {
        8: "0.08",
        12: "0.12",
      },
      colors: {
        bg: {
          DEFAULT: "#0a0a0f",
          card: "#13131c",
          hover: "#1a1a28",
        },
        primary: {
          DEFAULT: "#00d9a3",
          dark: "#00b388",
          light: "#33e8b8",
        },
        accent: {
          DEFAULT: "#ff6b35",
          dark: "#e55a2b",
          light: "#ff8c5a",
        },
        secondary: {
          DEFAULT: "#4d7cfe",
          dark: "#3a62e0",
          light: "#6e9aff",
        },
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        neutral: {
          50: "#f5f5f7",
          100: "#e5e5ea",
          200: "#c7c7cc",
          300: "#8e8e93",
          400: "#636366",
          500: "#48484a",
          600: "#3a3a3c",
          700: "#2c2c2e",
          800: "#1c1c1e",
          900: "#0a0a0f",
        },
      },
      fontFamily: {
        body: ["Inter", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        fun: ["Baloo 2", "cursive"],
        brand: ["Orbitron", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        handwrite: ["Ma Shan Zheng", "cursive"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bubble-1": "bubble1 3s ease-in-out infinite",
        "bubble-2": "bubble2 4s ease-in-out infinite",
        "bubble-3": "bubble3 3.5s ease-in-out infinite",
        "bubble-4": "bubble4 2.5s ease-in-out infinite",
        "bubble-5": "bubble5 3.8s ease-in-out infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bubble1: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        bubble2: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        bubble3: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bubble4: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        bubble5: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
