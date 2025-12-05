import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TUM color palette - all blues, no warm tones
        primary: {
          50: "#e8f0f7",   // Very light cool blue
          100: "#c2d9ea",  // Light cool blue
          200: "#9abddb",  // Light-medium cool blue
          300: "#729bc9",  // Medium cool blue
          400: "#4a7bb7",  // Medium-dark cool blue
          500: "#0E396E",  // TUM lighter blue - primary
          600: "#0A2D57",  // TUM mid blue
          700: "#072140",  // TUM dark blue
          800: "#051830",
          900: "#031023",
        },
        secondary: {
          50: "#e8f0f7",   // Very light cool blue
          100: "#c2d9ea",  // Light cool blue
          200: "#9abddb",  // Light-medium cool blue
          300: "#729bc9",  // Medium cool blue
          400: "#4a7bb7",  // Medium-dark cool blue
          500: "#0A2D57",  // TUM mid blue - secondary
          600: "#082649",
          700: "#072140",
          800: "#051830",
          900: "#031023",
        },
        accent: {
          50: "#e8f0f7",   // Very light cool blue
          100: "#c2d9ea",  // Light cool blue
          200: "#9abddb",  // Light-medium cool blue
          300: "#729bc9",  // Medium cool blue
          400: "#4a7bb7",  // Medium-dark cool blue
          500: "#072140",  // TUM dark blue - accent
          600: "#051830",
          700: "#031023",
          800: "#020913",
          900: "#010509",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif"],
      },
      fontSize: {
        base: "18px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [],
};

export default config;

