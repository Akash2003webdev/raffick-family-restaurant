/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6b1522",
          50: "#fbebec",
          100: "#f3ccd0",
          200: "#e59aa1",
          300: "#d2636e",
          400: "#a02c39",
          500: "#6b1522",
          600: "#57111c",
          700: "#440d16",
          800: "#330a10",
          900: "#22060a",
        },
        gold: {
          DEFAULT: "#bb8a2e",
          50: "#fdf7ea",
          100: "#f8e8c2",
          200: "#eecc7d",
          300: "#dbab52",
          400: "#bb8a2e",
          500: "#96701f",
          600: "#795919",
        },
        ink: "#1c0b0d",
        cream: "#fdf6ec",
        paper: "#fffcf6",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(122,31,43,0.08)",
        card: "0 6px 24px rgba(122,31,43,0.12)",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        fadeUp: "fadeUp 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
