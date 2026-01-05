import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/web/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/partner/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/admin/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Wolt-inspired color palette
        primary: {
          50: "#E6F2FF",
          100: "#CCE5FF",
          200: "#99CBFF",
          300: "#66B2FF",
          400: "#3399FF",
          500: "#009DE0", // Wolt blue
          600: "#007DB3",
          700: "#005C86",
          800: "#003D5A",
          900: "#001F2D",
        },
        accent: {
          50: "#FFF5E6",
          100: "#FFEBCC",
          200: "#FFD699",
          300: "#FFC266",
          400: "#FFAD33",
          500: "#FF9900", // Wolt orange
          600: "#CC7A00",
          700: "#995C00",
          800: "#663D00",
          900: "#331F00",
        },
        success: {
          DEFAULT: "#00C853",
          dark: "#009624",
        },
        danger: {
          DEFAULT: "#FF3B30",
          dark: "#CC2F26",
        },
        warning: {
          DEFAULT: "#FFCC00",
          dark: "#CCA300",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        hebrew: ["var(--font-heebo)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
