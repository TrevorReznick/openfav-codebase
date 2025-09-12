// src/react/DynamicWrapper.tsx
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getDynamicComponent } from '@/react/lib/autoComponentLoader.ts'
import LoadFallback from '../components/LoadFallback.js'
// Auth will be implemented later
// import { useAuthActions } from './hooks/useAuthActions';

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

export default function DynamicWrapper({ 
  componentPath, 
  props = {}, 
  fallback: CustomFallback = LoadFallback,
  debug = false
}: DynamicWrapperProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loadingState, setLoadingState] = useState<string>('idle');
  
  if (debug) {
    console.log('[DynamicWrapper] Initializing with:', { componentPath, props });
  }

  useEffect(() => {
    let isMounted = true;
    const loadComponent = async () => {
      try {
        setLoadingState('loading');
        if (debug) console.log('[DynamicWrapper] Loading component:', componentPath);
        
        const config = await getDynamicComponent(componentPath);
        if (debug) console.log('[DynamicWrapper] Got component config:', { config });
        
        // Auth will be implemented later
        // if (config.requiredAuth && !isAuthenticated) {
        //   const AuthComponent = lazy(() => import('./components/auth/Auth'));
        //   setComponent(() => AuthComponent);
        //   return;
        // }
        
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
        console.error(`[DynamicWrapper] Error loading ${componentPath}:`, err);
        if (isMounted) {
          setError(err as Error);
          setLoadingState('error');
        }
      }
    };
    
    loadComponent();
    
    return () => {
      isMounted = false;
    };
  }, [componentPath, debug]);
  
  if (error) {
    console.error('[DynamicWrapper] Render error state:', error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="font-bold text-red-800 mb-2">Error loading component</h3>
        <div className="font-mono text-sm mb-2">{componentPath}</div>
        <div className="text-red-600 text-sm">{error.message}</div>
        {debug && (
          <details className="mt-2">
            <summary className="text-xs cursor-pointer">Debug Details</summary>
            <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto max-h-40">
              {JSON.stringify({
                componentPath,
                error: error.toString(),
                stack: error.stack,
                loadingState
              }, null, 2)}
            </pre>
          </details>
        )}
      </div>
    );
  }
  
  if (!Component) {
    if (debug) console.log('[DynamicWrapper] No component loaded, showing fallback');
    return <CustomFallback />;
  }
  
  if (debug) console.log('[DynamicWrapper] Rendering component:', componentPath);
  
  return (
    <ErrorBoundary 
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-bold text-red-800">Error in component</h3>
          <div className="font-mono text-sm">{componentPath}</div>
          {debug && (
            <div className="mt-2 text-xs">
              <div>Props: {JSON.stringify(props, null, 2)}</div>
              <div>Loading State: {loadingState}</div>
            </div>
          )}
        </div>
      }
    >
      <Suspense 
        fallback={
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <div className="text-blue-800">Loading {componentPath}...</div>
            {debug && <DebugInfo label="Loading State" value={loadingState} />}
          </div>
        }
      >
        {debug && (
          <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-xs">
            <div className="font-bold">Debug Info:</div>
            <DebugInfo label="Component Path" value={componentPath} />
            <DebugInfo label="Loading State" value={loadingState} />
            <DebugInfo label="Props" value={props} />
          </div>
        )}
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}