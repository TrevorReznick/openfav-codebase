"use client"

import { useStore } from "@nanostores/react"
import { testUsername, theme } from "@/store"
import { Button } from "@/react/components/ui/button"
import { ArrowRight, Moon, SunMedium } from 'lucide-react'
import { useEffect } from 'react';

export default function Welcome() {
  const name = useStore(testUsername)
  const currentTheme = useStore(theme)
  
  // Initialize theme on mount
  useEffect(() => {
    function getThemeFromStorage() {
      try {
        // 1. Try localStorage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          return savedTheme;
        }
        
        // 2. Check cookies as fallback
        const cookieMatch = document.cookie.match(/theme=([^;]+)/);
        if (cookieMatch && (cookieMatch[1] === 'light' || cookieMatch[1] === 'dark')) {
          return cookieMatch[1];
        }
        
        // 3. Fall back to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } catch (e) {
        console.warn('[theme][welcome] Error reading theme from storage:', e);
        return 'light'; // Default fallback
      }
    }
    
    // Only run this effect once on mount
    const initialTheme = getThemeFromStorage();
    console.log(`[theme][welcome] Initial theme: ${initialTheme}`);
    
    // Update theme if needed
    if (initialTheme !== currentTheme) {
      console.log(`[theme][welcome] Updating theme to: ${initialTheme}`);
      theme.set(initialTheme);
      
      // Sync to all storage mechanisms
      try {
        localStorage.setItem('theme', initialTheme);
        document.cookie = `theme=${initialTheme}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.setAttribute('data-theme', initialTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(initialTheme);
      } catch (e) {
        console.warn('[theme][welcome] Error syncing theme:', e);
      }
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      // Only update if we're in system theme mode
      if (localStorage.getItem('theme') === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        console.log(`[theme][welcome] System theme changed to: ${systemTheme}`);
        theme.set(systemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []); // Empty dependency array means this runs once on mount
  
  const toggleTheme = () => {
    // Toggle between light and dark
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Log the theme change with details
    console.group('[theme][welcome] Theme Toggle');
    console.log(`Current theme: ${currentTheme}`);
    console.log(`New theme: ${newTheme}`);
    
    // Update the theme in the store first
    theme.set(newTheme);
    
    // Update all storage mechanisms
    try {
      // 1. Update localStorage
      localStorage.setItem('theme', newTheme);
      console.log(`[theme][welcome] Updated localStorage: ${newTheme}`);
      
      // 2. Set cookie for server-side rendering
      document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
      console.log(`[theme][welcome] Set cookie: theme=${newTheme}`);
      
      // 3. Update the data-theme attribute
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // 4. Update classes
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      
      // 5. Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('theme-change', { 
        detail: { theme: newTheme } 
      }));
      
      console.log(`[theme][welcome] Theme updated successfully`);
      
    } catch (e) {
      console.error('[theme][welcome] Error updating theme:', e);
    } finally {
      console.groupEnd();
    }
  }

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{"Benvenuto in Astro + React"}</h1>
        <p className="mt-4 text-muted-foreground">
          {"Ciao "}
          <strong>{name}</strong>
          {", questo è uno starter con React Query, Nanostores, Tailwind e shadcn-style."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="/build/hello">
            <Button>
              {"Vai a Hello"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <a href="/build/home-test">
            <Button variant="secondary">{"Vai a HomeTest"}</Button>
          </a>
          <a href="/build/home">
            <Button variant="outline">{"Home"}</Button>
          </a>
          <Button variant="outline" onClick={toggleTheme}>
            {currentTheme === "dark" ? (
              <SunMedium data-testid="sun-icon" className="mr-2 h-4 w-4" />
            ) : (
              <Moon data-testid="moon-icon" className="mr-2 h-4 w-4" />
            )}
            {currentTheme === "dark" ? "Light" : "Dark"}
          </Button>
        </div>
      </div>
    </section>
  )
}
