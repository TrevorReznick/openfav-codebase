// src/react/lib/autoComponentLoader.ts
import { lazy } from 'react'
import type { ComponentType } from 'react'

// Base paths relative to the project root - examples first
const COMPONENT_BASES = {
  examples: '/src/react/components/examples',  // Check examples directory first
  pages: '/src/components/pages',
  home: '/src/react/components/home',
  common: '/src/react/components/common',
  components: '/src/react/components'  // Check root components last
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
  const normalizedPath = componentPath.replace(/\./g, '/');
  
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
  
  // Try to find the component in different directories
  for (const [baseName, basePath] of Object.entries(COMPONENT_BASES)) {
    try {
      const fullPath = `${basePath}/${normalizedPath}.tsx`;
      
      // Try importing the component
      const module = await import(/* @vite-ignore */ fullPath);
      
      return {
        loader: () => import(/* @vite-ignore */ fullPath),
        layout: baseName === 'pages' ? 'default' : 'minimal',
        requiredAuth: normalizedPath.startsWith('admin/')
      };
    } catch (e) {
      // Continue to try other directories
      console.debug(`[autoComponentLoader] Component not found at ${baseName}:`, e);
      continue;
    }
  }
  
  throw new Error(`Component ${componentPath} not found in any base directory. ` +
    `Tried: ${Object.keys(COMPONENT_BASES).map(b => `${b}/${normalizedPath}`).join(', ')}`);
}