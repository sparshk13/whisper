/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1E1B3A",
          muted: "#6B6788",
        },
        brand: {
          DEFAULT: "#5B4BDB",
          start: "#6A5AE0",
          end: "#4A3BC7",
          deep: "#3B2FA8",
          peach: "#FFB88C",
        },
        mist: "#F4F2FB",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(60, 40, 160, 0.10)",
        subtle: "0 4px 16px rgba(60, 40, 160, 0.06)",
      },
      borderRadius: {
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};
