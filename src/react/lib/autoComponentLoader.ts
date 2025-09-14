import { lazy } from 'react'
import type { ComponentType } from 'react'

const COMPONENT_BASES = {
  // Direct component paths
  auth: '/src/react/components/auth',
  dashboard: '/src/react/components/dashboard',
  examples: '/src/react/components/examples',
  common: '/src/react/components/common',
  // Fallback to root components last
  components: '/src/react/components'
} as const

type ComponentBases = keyof typeof COMPONENT_BASES

interface AutoComponentConfig {
  loader: () => Promise<{ default: ComponentType<any> }>;
  layout?: 'default' | 'minimal';
  requiredAuth?: boolean;
}

export async function getDynamicComponent(
  componentPath: string,
  debug = false
): Promise<AutoComponentConfig> {
  try {
    // Always return TestReactComponent regardless of the input path
    const testComponent = await import('@/react/components/examples/TestReactComponent');
    
    return {
      loader: () => import('@/react/components/examples/TestReactComponent'),
      layout: 'default',
      requiredAuth: false
    };
  } catch (error) {
    if (debug) {
      console.error(`[autoComponentLoader] Failed to load component:`, error);
    }
    throw new Error(`Component not found: ${componentPath}`);
  }
}