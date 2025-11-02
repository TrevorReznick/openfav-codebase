import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeInjector, type Theme } from '../themeInjector';

describe('ThemeInjector', () => {
  let themeInjector: ThemeInjector;
  
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn()
    };
    
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: ''
    });
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    
    // @ts-ignore
    global.localStorage = localStorageMock;
    
    themeInjector = new ThemeInjector();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('should initialize with system theme by default', () => {
    expect(themeInjector.getTheme()).toBe('system');
  });
  
  it('should set and get theme', () => {
    themeInjector.setTheme('dark');
    expect(themeInjector.getTheme()).toBe('dark');
    
    themeInjector.setTheme('light');
    expect(themeInjector.getTheme()).toBe('light');
  });
  
  it('should toggle between light and dark themes', () => {
    themeInjector.setTheme('light');
    themeInjector.toggleTheme();
    expect(themeInjector.getTheme()).toBe('dark');
    
    themeInjector.toggleTheme();
    expect(themeInjector.getTheme()).toBe('light');
  });
  
  it('should detect system theme', () => {
    // Mock dark mode
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    expect(themeInjector.getSystemTheme()).toBe('dark');
  });
  
  it('should update document class when theme changes', () => {
    const addSpy = vi.spyOn(document.documentElement.classList, 'add');
    const removeSpy = vi.spyOn(document.documentElement.classList, 'remove');
    
    themeInjector.setTheme('dark');
    expect(removeSpy).toHaveBeenCalledWith('light');
    expect(addSpy).toHaveBeenCalledWith('dark');
    
    themeInjector.setTheme('light');
    expect(removeSpy).toHaveBeenCalledWith('dark');
    expect(addSpy).toHaveBeenCalledWith('light');
  });
});
