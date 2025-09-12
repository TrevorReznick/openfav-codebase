import React, { lazy, Suspense, useState, useEffect, useMemo } from 'react'
import type { FC, ComponentType, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { getComponentConfig, hasComponent } from '@/react/lib/autoComponentLoader'
import { ThemeProvider } from '@/react/providers/themeProvider'
import { ThemeToggle } from '@/react/components/ThemeToggle'
import { NavigationProvider } from '@/react/hooks/useNavigation'
import LoadingFallback from '@/react/components/common/LoadingFallback'

interface AppClientProps {
  componentName?: string
  useQueryString?: boolean
  children?: ReactNode
  additionalProviders?: Array<ComponentType<{ children: ReactNode }>>
  showThemeToggle?: boolean
  showToaster?: boolean
}

// QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
})

const AppClient: FC<AppClientProps> = ({
  componentName,
  useQueryString = false,
  children,
  additionalProviders = [],
  showThemeToggle = false,
  showToaster = true,
}) => {
  // Base providers with QueryClient and Theme
  const providers: Array<ComponentType<{ children: ReactNode }>> = [
    ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
    ThemeProvider as ComponentType<{ children: ReactNode }>,
    NavigationProvider as ComponentType<{ children: ReactNode }>,
    ...additionalProviders,
  ]

  // State for component loading
  const [componentState, setComponentState] = useState({
    name: componentName || null,
    error: null as Error | null,
    isLoading: !!componentName,
  })

  // Load component when componentName changes
  useEffect(() => {
    if (!componentName) {
      setComponentState({ name: null, error: null, isLoading: false })
      return
    }

    let isMounted = true
    
    const loadComponent = async () => {
      try {
        setComponentState(prev => ({ ...prev, isLoading: true, error: null }))
        
        // Check if component exists
        const componentExists = await hasComponent(componentName)
        if (!componentExists) {
          throw new Error(`Component "${componentName}" not found in registry`)
        }

        // Get component config
        await getComponentConfig(componentName)
        
        if (isMounted) {
          setComponentState({
            name: componentName,
            error: null,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error(`Failed to load component ${componentName}:`, error)
        if (isMounted) {
          setComponentState({
            name: componentName,
            error: error as Error,
            isLoading: false,
          })
        }
      }
    }

    loadComponent()
    
    return () => {
      isMounted = false
    }
  }, [componentName])

  // Create the dynamic component with React.lazy
  const DynamicComponent = useMemo(() => {
    if (!componentState.name || componentState.isLoading || componentState.error) {
      return null
    }
    
    return lazy(async () => {
      try {
        const config = await getComponentConfig(componentState.name!)
        const Component = await config.loader()
        return { default: Component.default }
      } catch (error) {
        console.error('Error in lazy loading:', error)
        throw error
      }
    })
  }, [componentState.name, componentState.isLoading, componentState.error])

  // Render fallback UI based on the current state
  const renderFallback = () => {
    if (componentState.error) {
      // Handle auth-related components specifically
      const authComponents = ['login', 'auth', 'signin', 'sign-up', 'register']
      if (componentState.name && authComponents.includes(componentState.name.toLowerCase())) {
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 m-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-600 text-xl">ℹ️</span>
              <h3 className="font-bold text-blue-800">Authentication Required</h3>
            </div>
            <p className="text-blue-700 mb-4">
              The {componentState.name} component is not available. This might be because:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-blue-700">
              <li>The authentication component is not yet implemented</li>
              <li>You need to create an authentication component in your components directory</li>
              <li>The authentication system is not properly configured</li>
            </ul>
          </div>
        )
      }

      // Default error display
      return (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 m-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-destructive text-xl">⚠️</span>
            <h3 className="font-bold text-destructive">Component Load Error</h3>
          </div>
          <p className="text-destructive mb-3">
            Failed to load component: <code className="bg-destructive/20 px-1 rounded">{componentState.name}</code>
          </p>
          <p className="text-sm text-muted-foreground">
            {componentState.error?.toString()}
          </p>
        </div>
      )
    }

    // Loading state
    return <LoadingFallback />
  }

  // Main content
  const content = (
    <div className="bg-background min-h-screen">
      {/* Theme Toggle */}
      {showThemeToggle && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      )}

      {/* Dynamic Component */}
      <Suspense fallback={renderFallback()}>
        {DynamicComponent ? (
          <DynamicComponent />
        ) : componentState.error ? (
          renderFallback()
        ) : componentState.isLoading ? (
          renderFallback()
        ) : null}
      </Suspense>

      {/* Children */}
      {children && (
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      )}

      {/* Toaster */}
      {showToaster && (
        <Toaster 
          richColors 
          position="top-right" 
          toastOptions={{
            className: 'bg-background border-border',
          }}
        />
      )}
    </div>
  )

  // Wrap with providers
  return (
    <>
      {providers.reduceRight(
        (child, Provider) => (
          <Provider>{child}</Provider>
        ),
        content
      )}
    </>
  )
}

export default AppClient