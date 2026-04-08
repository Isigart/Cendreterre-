import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        chef: {
          50: "#fef7ee",
          100: "#fdedd3",
          200: "#f9d6a5",
          300: "#f5b86d",
          400: "#f09333",
          500: "#ed7a0e",
          600: "#de6009",
          700: "#b8480a",
          800: "#933a10",
          900: "#773110",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e3eae2",
          200: "#c7d5c6",
          300: "#a1b89f",
          400: "#799776",
          500: "#587956",
          600: "#446143",
          700: "#374e37",
          800: "#2e3f2e",
          900: "#263527",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
