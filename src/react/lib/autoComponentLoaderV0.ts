// src/react/lib/autoComponentLoader.ts
import { lazy } from 'react'
import type { ComponentType } from 'react'

// Base paths relative to the project root - examples first
const COMPONENT_BASES = {
  // Direct component paths
  auth: '/src/react/components/auth',
  dashboard: '/src/react/components/dashboard',
  examples: '/src/react/components/examples',
  common: '/src/react/components/common',
  // ui: '/src/react/components/ui',
  // Fallback to root components last
  components: '/src/react/components'
} as const;

type ComponentBases = keyof typeof COMPONENT_BASES;

interface AutoComponentConfig {
  loader: () => Promise<{ default: ComponentType<any> }>;
  layout?: 'default' | 'minimal';
  requiredAuth?: boolean;
}

// Browser-compatible path joining
const joinPaths = (...parts: string[]): string => {
  return parts
    .map(part => part.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
};

export async function getDynamicComponent(componentPath: string, debug = false): Promise<AutoComponentConfig> {
  // Normalize path (e.g., "home.FeatureCard" -> "home/FeatureCard")
  // Also handle paths that start with 'components/' prefix
  let normalizedPath = componentPath.replace(/\./g, '/');
  normalizedPath = normalizedPath.replace(/^components\//, '');
  
  // Explicitly exclude UI components
  if (normalizedPath.startsWith('ui/') || normalizedPath.includes('/ui/')) {
    throw new Error(`UI components are not available through dynamic loading: ${componentPath}`);
  }
  
  // Special handling for TestComponent - only check in examples directory
  if (normalizedPath.endsWith('TestComponent') || normalizedPath.includes('test-component')) {
    try {
      // Try relative import first (works in both dev and prod)
      const module = await import('@/react/components/examples/TestComponent');
      return {
        loader: () => import('@/react/components/examples/TestComponent'),
        layout: 'minimal',
        requiredAuth: false
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[autoComponentLoader] Failed to load TestComponent:', error);
      throw new Error(`Failed to load TestComponent: ${errorMessage}`);
    }
  }
  
  // Try to find the component in the components directory
  const componentBases: [string, string][] = [
    ['examples', '@/react/components/examples'],
    ['auth', '@/react/components/auth'],
    ['common', '@/react/components/common'],
    ['', '@/react/components']  // Root components
  ];

  for (const [base, importPath] of componentBases) {
    try {
      const fullPath = base ? `${importPath}/${normalizedPath}` : `${importPath}/${normalizedPath}`;
      const module = await import(/* @vite-ignore */ fullPath);
      
      return {
        loader: () => import(/* @vite-ignore */ fullPath),
        layout: 'default',
        requiredAuth: normalizedPath.startsWith('auth/')
      };
    } catch (error) {
      // Continue to next base path
      if (debug) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log(`[autoComponentLoader] Component not found at ${base}:`, errorMessage);
      }
    }
  }

  // If we get here, the component wasn't found in any base path
  throw new Error(`Component not found: ${componentPath}`);
}