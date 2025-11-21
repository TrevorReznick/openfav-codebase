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
        // Base colors with alpha support
        border: "hsl(var(--color-border) / <alpha-value>)",
        input: "hsl(var(--color-input) / <alpha-value>)",
        ring: "hsl(var(--color-ring) / <alpha-value>)",
        
        // Background colors
        background: {
          DEFAULT: "hsl(var(--color-background) / <alpha-value>)",
          color: "hsl(var(--color-background-color) / <alpha-value>)",
        },
        
        // Text colors
        foreground: "hsl(var(--color-foreground) / <alpha-value>)",
        text: {
          color: "hsl(var(--color-text-color) / <alpha-value>)",
        },
        
        // Primary colors
        primary: {
          DEFAULT: "hsl(var(--color-primary-color) / <alpha-value>)",
          hover: "hsl(var(--color-primary-hover) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        
        // Secondary colors
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        
        // Destructive colors
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        
        // Muted colors
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        
        // Accent colors
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        
        // Card colors
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          bg: "hsl(var(--color-card-bg) / <alpha-value>)",
          border: "hsl(var(--color-card-border) / <alpha-value>)",
        },
        
        // Popover colors
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
      },
      
      // Border radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // Keyframes
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      
      // Animation
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      
      // Additional theme extensions can be added here
      ...Object.fromEntries(
        Object.entries(designTokens.colors || {}).map(([key]) => [
          key, 
          `hsl(var(--color-${key}) / <alpha-value>)`
        ])
      ),
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    // Add other plugins here
  ],
};

export default config;
