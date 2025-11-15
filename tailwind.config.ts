import type { Config } from "tailwindcss";
import { designTokens } from "./src/lib/tokens";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Add spacing tokens
      spacing: Object.fromEntries(
        Object.entries(designTokens.spacing).map(([key]) => [key, `var(--spacing-${key})`])
      ),
      // Typography tokens
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      // Color tokens
      colors: {
          // Migrated colors from astroflux-v4
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        DEFAULT: "hsl(var(--color-DEFAULT))",
        hover: "hsl(var(--color-hover))",
        background-color: "hsl(var(--color-background-color))",
        text-color: "hsl(var(--color-text-color))",
        primary-color: "hsl(var(--color-primary-color))",
        primary-hover: "hsl(var(--color-primary-hover))",
        secondary-color: "hsl(var(--color-secondary-color))",
        accent-color: "hsl(var(--color-accent-color))",
        card-bg: "hsl(var(--color-card-bg))",
        card-border: "hsl(var(--color-card-border))",

          // Migrated colors from astroflux-v4
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        DEFAULT: "hsl(var(--color-DEFAULT))",
        hover: "hsl(var(--color-hover))",
        background-color: "hsl(var(--color-background-color))",
        text-color: "hsl(var(--color-text-color))",
        primary-color: "hsl(var(--color-primary-color))",
        primary-hover: "hsl(var(--color-primary-hover))",
        secondary-color: "hsl(var(--color-secondary-color))",
        accent-color: "hsl(var(--color-accent-color))",
        card-bg: "hsl(var(--color-card-bg))",
        card-border: "hsl(var(--color-card-border))",

          // Migrated colors from astroflux-v4
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        DEFAULT: "hsl(var(--color-DEFAULT))",
        hover: "hsl(var(--color-hover))",
        background-color: "hsl(var(--color-background-color))",
        text-color: "hsl(var(--color-text-color))",
        primary-color: "hsl(var(--color-primary-color))",
        primary-hover: "hsl(var(--color-primary-hover))",
        secondary-color: "hsl(var(--color-secondary-color))",
        accent-color: "hsl(var(--color-accent-color))",
        card-bg: "hsl(var(--color-card-bg))",
        card-border: "hsl(var(--color-card-border))",

          // Migrated colors from astroflux-v4
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        DEFAULT: "hsl(var(--color-DEFAULT))",
        hover: "hsl(var(--color-hover))",
        background-color: "hsl(var(--color-background-color))",
        text-color: "hsl(var(--color-text-color))",
        primary-color: "hsl(var(--color-primary-color))",
        primary-hover: "hsl(var(--color-primary-hover))",
        secondary-color: "hsl(var(--color-secondary-color))",
        accent-color: "hsl(var(--color-accent-color))",
        card-bg: "hsl(var(--color-card-bg))",
        card-border: "hsl(var(--color-card-border))",

          // Migrated colors from astroflux-v4
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        DEFAULT: "hsl(var(--color-DEFAULT))",
        hover: "hsl(var(--color-hover))",
        background-color: "hsl(var(--color-background-color))",
        text-color: "hsl(var(--color-text-color))",
        primary-color: "hsl(var(--color-primary-color))",
        primary-hover: "hsl(var(--color-primary-hover))",
        secondary-color: "hsl(var(--color-secondary-color))",
        accent-color: "hsl(var(--color-accent-color))",
        card-bg: "hsl(var(--color-card-bg))",
        card-border: "hsl(var(--color-card-border))",

          // Migrated colors from astroflux-v4
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        ring: "hsl(var(--color-ring))",
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        DEFAULT: "hsl(var(--color-DEFAULT))",
        hover: "hsl(var(--color-hover))",
        background-color: "hsl(var(--color-background-color))",
        text-color: "hsl(var(--color-text-color))",
        primary-color: "hsl(var(--color-primary-color))",
        primary-hover: "hsl(var(--color-primary-hover))",
        secondary-color: "hsl(var(--color-secondary-color))",
        accent-color: "hsl(var(--color-accent-color))",
        card-bg: "hsl(var(--color-card-bg))",
        card-border: "hsl(var(--color-card-border))",

        // Color tokens from design system
        ...Object.fromEntries(
          Object.entries(designTokens.colors).map(([key]) => [key, `var(--color-${key})`])
        ),
        // Component colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
          // Migrated keyframes from astroflux-v4
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "0%, 100%": {
          "50%": { transform: "translateY(-10px)" }
        },

          // Migrated keyframes from astroflux-v4
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "0%, 100%": {
          "50%": { transform: "translateY(-10px)" }
        },

          // Migrated keyframes from astroflux-v4
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "0%, 100%": {
          "50%": { transform: "translateY(-10px)" }
        },

          // Migrated keyframes from astroflux-v4
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "0%, 100%": {
          "50%": { transform: "translateY(-10px)" }
        },

        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
          // Migrated animations from astroflux-v4
          "fade-in": "fade-in 0.6s ease-out",
          "fade-in-slow": "fade-in-slow 0.8s ease-out",

          // Migrated animations from astroflux-v4
          "fade-in": "fade-in 0.6s ease-out",
          "fade-in-slow": "fade-in-slow 0.8s ease-out",

          // Migrated animations from astroflux-v4
          "fade-in": "fade-in 0.6s ease-out",
          "fade-in-slow": "fade-in-slow 0.8s ease-out",

          // Migrated animations from astroflux-v4
          "fade-in": "fade-in 0.6s ease-out",
          "fade-in-slow": "fade-in-slow 0.8s ease-out",

        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
