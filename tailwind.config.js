import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2A5C7D",
          light: "#3B7CA8",
          dark: "#1F4560"
        },
        secondary: {
          DEFAULT: "#7EA8BE",
          light: "#9BBFD2",
          dark: "#6890A7"
        },
        success: "#4CAF50",
        error: "#F44336",
        warning: "#FFA726",
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A"
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.1)'
      },
    },
  },
  plugins: [],
} satisfies Config;
