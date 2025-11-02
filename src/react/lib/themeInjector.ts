/**
 * Theme Injection Utility
 * Handles theme propagation from components to parent layouts and pages
 */

import { theme as themeStore } from '@/store'
import { useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export interface ThemeInjectionConfig {
  propagateToParent?: boolean
  updateCookies?: boolean
  updateLocalStorage?: boolean
  storageKey?: string
}

const defaultConfig: ThemeInjectionConfig = {
  propagateToParent: true,
  updateCookies: true,
  updateLocalStorage: true,
  storageKey: 'theme'
}

/**
 * Injects theme settings to parent components (layout, page)
 */
export class ThemeInjector {
  private config: ThemeInjectionConfig
  private currentTheme: Theme = 'system'

  constructor(config: Partial<ThemeInjectionConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.initializeTheme()
  }

  private initializeTheme() {
    if (typeof window === 'undefined') {
      this.currentTheme = 'system';
      return;
    }

    // Get theme from various sources in priority order
    const storedTheme = localStorage.getItem(this.config.storageKey!) as Theme | null
    const cookieTheme = this.getCookieTheme()
    
    // Default to 'system' if no stored theme is found
    this.currentTheme = storedTheme || cookieTheme || 'system';
    
    // Apply the theme without triggering events on init
    this.applyTheme(this.currentTheme, false)
  }

  private getCookieTheme(): Theme | null {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const themeCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${this.config.storageKey}=`)
    )
    return themeCookie ? themeCookie.split('=')[1] as Theme : null
  }

  public getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  private setCookie(theme: Theme) {
    if (typeof document === 'undefined') return
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `${this.config.storageKey}=${theme}; expires=${expires.toUTCString()}; path=/`
  }

  private applyTheme(newTheme: Theme, triggerEvents = true) {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const resolvedTheme = newTheme === 'system' ? this.getSystemTheme() : newTheme

    // Update DOM classes - only remove the opposite theme class
    if (resolvedTheme === 'dark') {
      root.classList.remove('light')
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }

    // Update data attributes for CSS targeting
    root.setAttribute('data-theme', newTheme)
    root.setAttribute('data-resolved-theme', resolvedTheme)

    // Update storage
    if (this.config.updateLocalStorage) {
      localStorage.setItem(this.config.storageKey!, newTheme)
    }

    if (this.config.updateCookies) {
      this.setCookie(newTheme)
    }

    // Update nanostores
    themeStore.set(resolvedTheme)

    // Propagate to parent components
    if (this.config.propagateToParent && triggerEvents) {
      this.notifyParents(newTheme, resolvedTheme)
    }

    this.currentTheme = newTheme
  }

  private notifyParents(theme: Theme, resolvedTheme: 'light' | 'dark') {
    try {
      // Dispatch custom events for parent components to listen to
      const themeChangeEvent = new CustomEvent('theme-change', {
        detail: { theme, resolvedTheme },
        bubbles: true
      });

      const layoutUpdateEvent = new CustomEvent('layout-theme-update', {
        detail: { theme, resolvedTheme },
        bubbles: true
      });

      const pageUpdateEvent = new CustomEvent('page-theme-update', {
        detail: { theme, resolvedTheme },
        bubbles: true
      });

      // Dispatch events in the next tick to prevent React batching issues
      setTimeout(() => {
        try {
          document.dispatchEvent(themeChangeEvent);
          document.dispatchEvent(layoutUpdateEvent);
          document.dispatchEvent(pageUpdateEvent);
          
          // Also update any meta tags for theme-color
          this.updateMetaThemeColor(resolvedTheme);
          
          if (process.env.NODE_ENV !== 'production') {
            console.log(`[theme-injector] Theme propagated to parents: ${theme} (resolved: ${resolvedTheme})`);
          }
        } catch (error) {
          console.error('[theme-injector] Error dispatching theme events:', error);
        }
      }, 0);
    } catch (error) {
      console.error('[theme-injector] Error in notifyParents:', error);
    }
  }

  private updateMetaThemeColor(resolvedTheme: 'light' | 'dark') {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    const colors = {
      light: '#ffffff',
      dark: '#0a0a0a'
    }

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors[resolvedTheme])
    } else {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = colors[resolvedTheme]
      document.head.appendChild(meta)
    }
  }

  /**
   * Set theme and propagate to parents
   */
  setTheme(theme: Theme) {
    this.applyTheme(theme, true)
  }

  /**
   * Get current theme
   */
  getTheme(): Theme {
    return this.currentTheme
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const currentResolved = this.currentTheme === 'system' 
      ? this.getSystemTheme() 
      : this.currentTheme
    
    const newTheme = currentResolved === 'dark' ? 'light' : 'dark'
    this.setTheme(newTheme)
    return newTheme
  }

  /**
   * Listen for system theme changes when in system mode
   */
  watchSystemTheme() {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (this.currentTheme === 'system') {
        this.applyTheme('system', true)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }
}

// Global theme injector instance
export const globalThemeInjector = new ThemeInjector()

// Hook for React components
export function useThemeInjector() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => globalThemeInjector.getTheme());

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setCurrentTheme(event.detail.theme);
    };

    document.addEventListener('theme-change', handleThemeChange as EventListener);
    const cleanup = globalThemeInjector.watchSystemTheme?.();

    return () => {
      document.removeEventListener('theme-change', handleThemeChange as EventListener);
      if (cleanup) cleanup();
    };
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    globalThemeInjector.setTheme(theme);
  }, []);

  const toggleTheme = useCallback(() => {
    return globalThemeInjector.toggleTheme();
  }, []);

  return {
    theme: currentTheme,
    setTheme,
    getTheme: globalThemeInjector.getTheme.bind(globalThemeInjector),
    toggleTheme,
    isDark: currentTheme === 'dark' || (currentTheme === 'system' && globalThemeInjector.getSystemTheme() === 'dark')
  };
}
