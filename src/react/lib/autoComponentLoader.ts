import type { ComponentType } from 'react';

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