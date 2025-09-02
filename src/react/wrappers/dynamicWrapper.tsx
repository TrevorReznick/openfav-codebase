// src/react/DynamicWrapper.tsx
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getDynamicComponent } from '@/react/lib/autoComponentLoader';
import LoadFallback from '@/reactcomponents/LoadFallback'
import { useAuthActions } from './hooks/useAuthActions';

interface DynamicWrapperProps {
  componentPath: string;
  props?: Record<string, any>;
  fallback?: React.ComponentType;
}

export default function DynamicWrapper({ 
  componentPath, 
  props = {}, 
  fallback: CustomFallback = LoadFallback 
}: DynamicWrapperProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated } = useAuthActions();
  
  useEffect(() => {
    const loadComponent = async () => {
      try {
        const config = await getDynamicComponent(componentPath);
        
        if (config.requiredAuth && !isAuthenticated) {
          const AuthComponent = lazy(() => import('./components/auth/Auth'));
          setComponent(() => AuthComponent);
          return;
        }
        
        const LazyComponent = lazy(config.loader);
        setComponent(() => LazyComponent);
      } catch (err) {
        setError(err as Error);
      }
    };
    
    loadComponent();
  }, [componentPath, isAuthenticated]);
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        Error loading component: {error.message}
      </div>
    );
  }
  
  if (!Component) {
    return <CustomFallback />;
  }
  
  return (
    <Suspense fallback={<CustomFallback />}>
      <Component {...props} />
    </Suspense>
  );
}