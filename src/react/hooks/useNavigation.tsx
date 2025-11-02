import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type NavigationContextType = {
  navigate: (path: string) => void
  goBack: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new Event('popstate'))
  }

  const goBack = () => {
    window.history.back()
  }

  return (
    <NavigationContext.Provider value={{ navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
