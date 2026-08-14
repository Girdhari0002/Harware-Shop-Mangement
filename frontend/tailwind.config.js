/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      // Large-monitor / ultrawide steps, beyond Tailwind's defaults.
      "3xl": "1920px",
      "4xl": "2560px",
      "5xl": "3440px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2F66B3",
          dark: "#24518F",
          light: "#EAF3FF",
        },
        accent: {
          DEFAULT: "#FFB800",
          light: "#FFF4CC",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
        },
        info: {
          DEFAULT: "#2563EB",
          light: "#DBEAFE",
        },
        background: "#F8FAFC",
        "cream-bg": "#FFFDEB",
        surface: "#FFFFFF",
        border: "#DDE3EA",
        "hover-bg": "#F1F6FC",
        text: {
          primary: "#172033",
          secondary: "#5F6B7A",
          muted: "#8993A4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(23, 32, 51, 0.06)",
        card: "0 1px 3px 0 rgba(23, 32, 51, 0.08), 0 1px 2px -1px rgba(23, 32, 51, 0.06)",
        modal: "0 10px 40px rgba(23, 32, 51, 0.15)",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};