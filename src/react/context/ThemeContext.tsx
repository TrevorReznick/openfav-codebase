import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { globalThemeInjector, type Theme } from '@/react/lib/themeInjector';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initialize theme from the injector
    if (typeof window !== 'undefined') {
      return globalThemeInjector.getTheme();
    }
    return 'system';
  });

  const setTheme = (newTheme: Theme) => {
    globalThemeInjector.setTheme(newTheme);
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = globalThemeInjector.toggleTheme();
    setThemeState(newTheme);
  };

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setThemeState(event.detail.theme);
    };

    // Listen for theme changes from the injector
    document.addEventListener('theme-change', handleThemeChange as EventListener);
    
    // Set up system theme change listener
    const cleanup = globalThemeInjector.watchSystemTheme?.();

    return () => {
      document.removeEventListener('theme-change', handleThemeChange as EventListener);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
