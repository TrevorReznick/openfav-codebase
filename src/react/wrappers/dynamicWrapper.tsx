// src/react/wrappers/dynamicWrapper.tsx
import React, { Suspense, lazy, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { getDynamicComponent } from '@/react/lib/autoComponentLoader'
import LoadFallback from '@/react/components/common/LoadFallback'

interface DynamicWrapperProps {
  componentPath?: string
  componentName?: string
  props?: Record<string, any>
  fallback?: React.ComponentType
  debug?: boolean
  render?: (props: { Component: React.ComponentType }) => React.ReactNode
}

const DebugInfo: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="text-xs p-2 bg-gray-100 rounded mb-2">
    <span className="font-mono font-bold">{label}:</span> {JSON.stringify(value, null, 2)}
  </div>
);

const DynamicWrapper: React.FC<DynamicWrapperProps> = ({
  componentPath,
  componentName,
  props = {},
  fallback: CustomFallback = LoadFallback,
  debug = true,
  render
}) => {
  const target = componentPath || componentName || '';
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Debug log only when componentPath changes
  useEffect(() => {
    if (debug) {
      console.log(`[DynamicWrapper] Mounted/Updated with target: ${target}`);
      console.log(`[DynamicWrapper] Current state:`, { loadingState, hasComponent: !!Component, error });
    }
  }, [target, debug]);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      if (!isMounted) {
        if (debug) console.log('[DynamicWrapper] Component unmounted, skipping load')
        return;
      }
      
      try {
        setLoadingState('loading')
        setError(null);
        
        if (debug) {
          console.log(`[DynamicWrapper] Starting to load component: ${target}`)
          console.trace('[DynamicWrapper] Stack trace for component load');
        }
        
        const config = await getDynamicComponent(target, debug)
        if (debug) {
          console.log('[DynamicWrapper] Successfully got component config')
          console.log('[DynamicWrapper] Config details:', {
            hasLoader: !!config.loader,
            layout: config.layout,
            requiredAuth: config.requiredAuth
          });
        }
        
        if (!isMounted) return
        
        // Create a lazy-loaded component with the config's loader
        const LazyComponent = lazy(async () => {
          try {
            if (debug) console.log('[DynamicWrapper] Starting lazy load for component:', target);
            const module = await config.loader();
            if (debug) {
              console.log('[DynamicWrapper] Successfully loaded component module:', target);
              console.log('[DynamicWrapper] Module exports:', Object.keys(module));
              console.log('[DynamicWrapper] Default export exists:', 'default' in module);
            }
            return module;
          } catch (err) {
            console.error(`[DynamicWrapper] Error in lazy loading ${target}:`, err)
            throw err;
          }
        });
        
        if (isMounted) {
          setComponent(() => LazyComponent)
          setLoadingState('success')
        }
      } catch (err) {
        console.error(`[DynamicWrapper] Error loading component '${target}':`, err)
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoadingState('error')
        }
      }
    };
    
    loadComponent()
    
    return () => {
      isMounted = false
    };
  }, [target, debug])

  // Render loading state
  if (loadingState === 'loading') {
    return <CustomFallback />;
  }

  // Render error state
  if (loadingState === 'error' || error) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 dark:bg-red-900/20 rounded">
        <h3 className="text-red-700 dark:text-red-300 font-bold mb-2">Error loading component</h3>
        <div className="mb-2 text-sm">
          <span className="font-medium">Path:</span> {componentPath}
        </div>
        {error?.message && (
          <pre className="text-xs text-red-600 dark:text-red-400 overflow-x-auto p-2 bg-red-100 dark:bg-red-900/30 rounded">
            {error.message}
          </pre>
        )}
        {debug && error?.stack && (
          <details className="mt-2">
            <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">Show stack trace</summary>
            <pre className="text-xs text-red-500 mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    );
  }

  // Render the component when loaded
  if (Component) {
    const WrappedComponent = () => {
      const content = render ? (
        render({ Component })
      ) : (
        <Component {...props} />
      );

      return (
        <ErrorBoundary 
          fallbackRender={({ error: boundaryError, resetErrorBoundary }) => (
            <div className="p-4 border border-red-500 bg-red-50 dark:bg-red-900/20 rounded">
              <h3 className="text-red-700 dark:text-red-300 font-bold mb-2">Component Error</h3>
              <div className="mb-2 text-sm">
                <span className="font-medium">Path:</span> {target}
              </div>
              <pre className="text-xs text-red-600 dark:text-red-400 overflow-x-auto p-2 bg-red-100 dark:bg-red-900/30 rounded">
                {boundaryError.message}
              </pre>
              <button 
                onClick={resetErrorBoundary}
                className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 rounded text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        >
          <Suspense fallback={<CustomFallback />}>
            {debug && (
              <div className="mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                <div className="font-mono text-green-600 dark:text-green-400">Loaded: {target}</div>
                {props && Object.keys(props).length > 0 && <DebugInfo label="Props" value={props} />}
              </div>
            )}
            {content}
          </Suspense>
        </ErrorBoundary>
      );
    };

    return <WrappedComponent />;
  }

  // Fallback UI if no component is loaded
  return (
    <div className="p-4 border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded">
      <p className="text-yellow-700 dark:text-yellow-300 font-medium">No component loaded</p>
      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        <div>Path: <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{target}</code></div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          This might be due to an incorrect path or the component might not exist.
        </div>
      </div>
    </div>
  );
};

export default DynamicWrapper