const colors = {
  'background': '222 47% 11%',
  'foreground': '0 0% 100%',
  'primary': '262 83% 58%',
  'primary-hover': '263 70% 50%',
  'secondary': '217 33% 17%',
  'accent': '271 91% 65%',
  'card': '217 33% 17% / 0.3',
  'border': '0 0% 100% / 0.1'
} as const;

const typography = {
} as const;

const spacing = {

} as const;

export const designTokens = {
  colors,
  typography,
  spacing
} as const;

export const colorTokens = colors;
export const typographyTokens = typography;
export const spacingTokens = spacing;

export const getSpacing = (key) => {
  return `var(--spacing-${key})`;
};

export const getColor = (key) => {
  return `var(--color-${key})`;
};

export default designTokens;
