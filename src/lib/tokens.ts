// src/lib/tokens.ts - Design Tokens con valori effettivi

const colors = {
  border: '0 0% 89.8%',           // ✅ Valori HSL space-separated
  input: '0 0% 89.8%',
  ring: '0 0% 3.9%',
  background: '0 0% 100%',
  'background-color': '0 0% 100%',
  foreground: '0 0% 3.9%',
  'text-color': '0 0% 3.9%',
  
  // Primary
  'primary-color': '262 80% 50%',  // Esempio: viola
  'primary-hover': '262 80% 45%',
  
  // Secondary
  secondary: '215 51% 51%',         // Esempio: blu
  'secondary-color': '215 51% 51%',
  
  // Destructive
  destructive: '0 84% 60%',        // Rosso
  
  // Muted
  muted: '0 0% 96.1%',
  'muted-foreground': '0 0% 45.1%',
  
  // Accent
  accent: '47 100% 45.3%',         // Giallo/Arancio
  
  // Card
  card: '0 0% 100%',
  'card-bg': '0 0% 100%',
  'card-border': '0 0% 89.8%',
  
  // Popover
  popover: '0 0% 100%',
} as const;

const typography = {
  fontFamily: {
    base: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas'
  },
  fontSize: {
    base: '1rem',
    lg: '1.125rem',
    sm: '0.875rem'
  }
} as const;

const spacing = {
  '0': '0',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
  '40': '10rem',
  '48': '12rem',
  '56': '14rem',
  '64': '16rem'
} as const;

export const designTokens = {
  colors,
  typography,
  spacing
} as const;

// Export individual token groups
export const colorTokens = colors;
export const typographyTokens = typography;
export const spacingTokens = spacing;

// Type definitions
export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;

export default designTokens;