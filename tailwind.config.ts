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
      // Spacing tokens
      spacing: designTokens.spacing,
      
      // Font family (preservato e formattato correttamente)
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      
      // Colors
      colors: {
        // Design tokens (migrated)
    'border': 'hsl(var(--border))',
    'input': 'hsl(var(--input))',
    'ring': 'hsl(var(--ring))',
    'background': 'hsl(var(--background))',
    'foreground': 'hsl(var(--foreground))',
    'DEFAULT': 'hsl(262 83% 58%)',
    'hover': 'hsl(263 70% 50%)',
    'background-color': 'hsl(222 47% 11%)',
    'text-color': 'hsl(0 0% 100%)',
    'primary-color': 'hsl(262 83% 58%)',
    'primary-hover': 'hsl(263 70% 50%)',
    'secondary-color': 'hsl(217 33% 17%)',
    'accent-color': 'hsl(271 91% 65%)',
    'card-bg': 'hsl(217 33% 17% / 0.3)',
    'card-border': 'hsl(0 0% 100% / 0.1)',
        
        // Shadcn/ui component colors
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
      
      // Border radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // Keyframes (merged)
      keyframes: {
        "accordion-down": {"from":{"height":"0"},"to":{"height":"var(--radix-accordion-content-height)"}},
        "accordion-up": {"from":{"height":"var(--radix-accordion-content-height)"},"to":{"height":"0"}},
        "fade-in": {"0%":"opacity: \"0\", transform: \"translateY(10px)\"","100%":"opacity: \"1\", transform: \"translateY(0)\""},
        "fade-in-slow": {"0%":"opacity: \"0\"","100%":"opacity: \"1\""},
        "0%, 100%": {"50%":"transform: \"translateY(-10px)\""}
      },
      
      // Animations (merged)
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "fade-in-slow": "fade-in-slow 0.8s ease-out"
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