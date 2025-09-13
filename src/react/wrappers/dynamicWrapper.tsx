// src/react/wrappers/dynamicWrapper.tsx
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getDynamicComponent } from '@/react/lib/autoComponentLoader';
import LoadFallback from '@/react/components/common/LoadFallback';

interface DynamicWrapperProps {
  componentPath: string;
  props?: Record<string, any>;
  fallback?: React.ComponentType;
  debug?: boolean;
}

const DebugInfo: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="text-xs p-2 bg-gray-100 rounded mb-2">
    <span className="font-mono font-bold">{label}:</span> {JSON.stringify(value, null, 2)}
  </div>
);

const DynamicWrapper: React.FC<DynamicWrapperProps> = ({
  componentPath,
  props = {},
  fallback: CustomFallback = LoadFallback,
  debug = false
}) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      if (!isMounted) return;
      
      try {
        setLoadingState('loading');
        if (debug) console.log('[DynamicWrapper] Loading component:', componentPath);
        
        const config = await getDynamicComponent(componentPath);
        if (debug) console.log('[DynamicWrapper] Got component config:', { config });
        
        if (!isMounted) return;
        
        // Create a lazy-loaded component with the config's loader
        const LazyComponent = lazy(async () => {
          try {
            if (debug) console.log('[DynamicWrapper] Lazy loading component:', componentPath);
            const module = await config.loader();
            if (debug) console.log('[DynamicWrapper] Successfully loaded component:', componentPath);
            return module;
          } catch (err) {
            console.error(`[DynamicWrapper] Error in lazy loading ${componentPath}:`, err);
            throw err;
          }
        });
        
        if (isMounted) {
          setComponent(() => LazyComponent);
          setLoadingState('success');
        }
      } catch (err) {
        console.error(`[DynamicWrapper] Error loading component '${componentPath}':`, err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoadingState('error');
        }
      }
    };
    
    loadComponent();
    
    return () => {
      isMounted = false;
    };
  }, [componentPath, debug]);

  // Render error state
  if (loadingState === 'error' || error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <h3 className="text-red-700 font-medium">Error loading component: {componentPath}</h3>
        {error?.message && <p className="text-red-600 mt-2">{error.message}</p>}
        {debug && error?.stack && (
          <pre className="text-xs text-red-500 mt-2 overflow-auto">
            {error.stack}
          </pre>
        )}
      </div>
    );
  }

  // Render loading state
  if (loadingState === 'loading' || !Component) {
    return <CustomFallback />;
  }

  // Render the loaded component
  return (
    <ErrorBoundary
      fallbackRender={({ error: boundaryError }) => (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <h3 className="text-red-700 font-medium">Component Error: {componentPath}</h3>
          <p className="text-red-600 mt-2">{boundaryError.message}</p>
          {debug && (
            <pre className="text-xs text-red-500 mt-2 overflow-auto">
              {boundaryError.stack}
            </pre>
          )}
        </div>
      )}
    >
      <Suspense fallback={<CustomFallback />}>
        {debug && <DebugInfo label="Component Props" value={props} />}
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DynamicWrapper;