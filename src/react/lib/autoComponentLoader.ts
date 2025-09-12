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

export async function getDynamicComponent(componentPath: string): Promise<AutoComponentConfig> {
  // Normalize path (e.g., "home.FeatureCard" -> "home/FeatureCard")
  // Also handle paths that start with 'components/' prefix
  let normalizedPath = componentPath.replace(/\./g, '/');
  normalizedPath = normalizedPath.replace(/^components\//, '');
  
  // Explicitly exclude UI components
  if (normalizedPath.startsWith('ui/') || normalizedPath.includes('/ui/')) {
    throw new Error(`UI components are not available through dynamic loading: ${componentPath}`);
  }
  
  // Special handling for TestComponent - only check in examples directory
  if (normalizedPath.endsWith('TestComponent')) {
    const fullPath = '/src/react/components/examples/TestComponent.tsx';
    try {
      const module = await import(/* @vite-ignore */ fullPath);
      return {
        loader: () => import(/* @vite-ignore */ fullPath),
        layout: 'minimal',
        requiredAuth: false
      };
    } catch (e) {
      console.debug(`[autoComponentLoader] TestComponent not found at ${fullPath}:`, e);
    }
  }
  
  // Special handling for examples directory
  if (normalizedPath.startsWith('examples/') || normalizedPath.includes('test-component')) {
    let componentName = normalizedPath;
    if (normalizedPath.includes('test-component')) {
      componentName = 'TestComponent';
    } else {
      componentName = normalizedPath.replace('examples/', '');
    }
    
    const possiblePaths = [
      `/src/react/components/examples/${componentName}.tsx`,
      `/src/react/components/examples/${componentName}/index.tsx`
    ];
    
    for (const fullPath of possiblePaths) {
      try {
        const module = await import(/* @vite-ignore */ fullPath);
        return {
          loader: () => import(/* @vite-ignore */ fullPath),
          layout: 'minimal',
          requiredAuth: false
        };
      } catch (e) {
        console.debug(`[autoComponentLoader] Component not found at ${fullPath}:`, e);
      }
    }
  }
  
  // Try exact match first (e.g., auth/Auth)
  try {
    const exactPath = `/src/react/components/${normalizedPath}.tsx`;
    const module = await import(/* @vite-ignore */ exactPath);
    return {
      loader: () => import(/* @vite-ignore */ exactPath),
      layout: 'minimal',
      requiredAuth: normalizedPath.startsWith('auth/')
    };
  } catch (e) {
    // Try with index.tsx
    try {
      const indexPath = `/src/react/components/${normalizedPath}/index.tsx`;
      const module = await import(/* @vite-ignore */ indexPath);
      return {
        loader: () => import(/* @vite-ignore */ indexPath),
        layout: 'minimal',
        requiredAuth: normalizedPath.startsWith('auth/')
      };
    } catch (e) {
      console.debug(`[autoComponentLoader] Component not found at ${normalizedPath}:`, e);
    }
  }
  
  // Fallback to searching in base directories
  for (const [baseName, basePath] of Object.entries(COMPONENT_BASES)) {
    try {
      // Try direct path first (e.g., auth/Auth)
      let fullPath = `${basePath}/${normalizedPath}.tsx`;
      
      // Try importing the component
      try {
        const module = await import(/* @vite-ignore */ fullPath);
        return {
          loader: () => import(/* @vite-ignore */ fullPath),
          layout: 'minimal',
          requiredAuth: baseName === 'auth' || normalizedPath.startsWith('auth/')
        };
      } catch (e) {
        // If direct path fails, try with index.tsx for directories
        fullPath = `${basePath}/${normalizedPath}/index.tsx`;
        const module = await import(/* @vite-ignore */ fullPath);
        return {
          loader: () => import(/* @vite-ignore */ fullPath),
          layout: 'minimal',
          requiredAuth: baseName === 'auth' || normalizedPath.startsWith('auth/')
        };
      }
    } catch (e) {
      // Continue to try other directories
      console.debug(`[autoComponentLoader] Component not found at ${baseName}:`, e);
      continue;
    }
  }
  
  throw new Error(`Component ${componentPath} not found in any base directory. ` +
    `Tried: ${Object.keys(COMPONENT_BASES).map(b => `${b}/${normalizedPath}`).join(', ')}`);
}