/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Sora", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 60px rgba(111, 124, 154, 0.14)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        fadeIn: "fadeIn 0.7s ease-out both",
      },
      colors: {
        mist: "#f6f4ff",
        peach: "#fff2eb",
        sky: "#edf7ff",
        ink: "#24324a",
      },
    },
  },
  plugins: [],
};
