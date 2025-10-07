# Design Tokens Documentation

This document outlines the design tokens used in the project and how to use them.

## Colors

### Primary Colors
- `primary`: Used for primary actions and important elements
- `secondary`: Used for secondary actions and less prominent elements
- `success`: Indicates successful operations
- `danger`: Indicates dangerous or destructive actions
- `warning`: Indicates warnings
- `info`: Used for informational messages

### Usage in CSS/SCSS
```css
.button {
  background-color: hsl(var(--color-primary));
  color: white;
}
```

### Usage in React Components
```tsx
import { getColor } from '@/lib/tokens';

const MyComponent = () => (
  <div style={{ backgroundColor: `hsl(${getColor('primary')})` }}>
    Content
  </div>
);
```

## Spacing

### Available Spacing Units
- `0`: 0px
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `3`: 0.75rem (12px)
- `4`: 1rem (16px)
- `5`: 1.25rem (20px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `10`: 2.5rem (40px)
- `12`: 3rem (48px)
- `16`: 4rem (64px)
- `20`: 5rem (80px)
- `24`: 6rem (96px)
- `32`: 8rem (128px)

### Usage in CSS/SCSS
```css
.container {
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-2);
}
```

### Usage in React Components
```tsx
import { getSpacing } from '@/lib/tokens';

const MyComponent = () => (
  <div style={{ padding: getSpacing(4) }}>
    Content with spacing
  </div>
);
```

## Typography

### Font Families
- `--font-sans`: Primary font (Inter)
- `--font-mono`: Monospace font (Roboto Mono)

### Font Sizes
- `sm`: 0.875rem (14px)
- `base`: 1rem (16px)
- `lg`: 1.125rem (18px)

### Usage in CSS/SCSS
```css
.heading {
  font-family: var(--font-sans);
  font-size: var(--font-size-lg);
}

.code {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}
```

## Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Use the provided utility functions** when working in React components
3. **Keep token names consistent** across the codebase
4. **Add new tokens** when needed, but check existing ones first
5. **Document new tokens** in this file

## Adding New Tokens

1. Add the new token to the appropriate JSON file in `migration/design-system/tokens/`
2. Update the TypeScript types in `src/lib/tokens.ts` if needed
3. Add examples to this documentation
4. Test the new token in development before deployment
