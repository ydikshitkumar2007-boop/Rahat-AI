import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--bg-main)",
        foreground: "var(--text-main)",
        brand: {
          DEFAULT: "var(--brand-primary)",
          hover: "var(--brand-hover)",
          active: "var(--brand-active)",
          soft: "var(--brand-soft)",
          border: "var(--brand-border)",
          text: "var(--brand-text)",
        },
        saffron: {
          DEFAULT: "var(--saffron-primary)",
          hover: "var(--saffron-hover)",
          soft: "var(--saffron-soft)",
          border: "var(--saffron-border)",
          text: "var(--saffron-text)",
        },
        earth: {
          50: '#FAFAF8',
          100: '#F8F7F4',
          200: '#F4F1EB',
          300: '#E6E1D8',
          400: '#D7CFC2',
          500: '#8A8178',
          600: '#7A4B2A',
          700: '#633A20',
          800: '#2E241D',
          900: '#1F2933',
        },
        risk: {
          low: "#4F7A58",
          moderate: "#B88422",
          high: "#B7602B",
          severe: "#A33D32",
          info: "#667C8F",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
