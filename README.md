# OpenFav Dev V0

This is a fresh installation of the OpenFav project with React components migrated from astroflux-V4.

## Project Structure

- `/src/components` - React components from astroflux-V4
- `/src/pages` - Next.js pages (including the migrated Index page)
- `/src/styles` - Global styles and Tailwind configuration
- `/src/react` - React-specific code and components
- `/public` - Static assets

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Update the environment variables in .env.local
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Dark Mode

The project is configured with dark mode by default. The theme is managed by the `ThemeProvider` in `src/react/providers/themeProvider.tsx`.

## Styling

This project uses:
- Tailwind CSS for utility-first styling
- shadcn/ui components for UI elements
- CSS variables for theming

## Migrated Components

The following components have been migrated from astroflux-V4:
- All components from `/src/components`
- The main Index page

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Next Steps

1. Review and update any hardcoded paths in the migrated components
2. Test all functionality in the new environment
3. Update any outdated dependencies
4. Add any missing tests
