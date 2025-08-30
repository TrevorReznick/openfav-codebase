import { test, describe, expect, beforeEach } from 'vitest';
import { 
  counterStore, 
  currentPath, 
  previousPath, 
  notifications, 
  messageStore, 
  userStore, 
  loadingStore, 
  themeStore, 
  useLoading 
} from '../index.js';

describe('Store', () => {
  // Reset stores before each test
  beforeEach(() => {
    counterStore.set(0);
    currentPath.set('/');
    previousPath.set('/');
    notifications.set([]);
    messageStore.set('');
    userStore.set(null);
    loadingStore.set(true);
    themeStore.set({ theme: 'dark', systemTheme: 'dark' });
  });

  describe('counterStore', () => {
    test('should initialize with 0', () => {
      expect(counterStore.get()).toBe(0);
    });

    test('should update counter value', () => {
      counterStore.set(5);
      expect(counterStore.get()).toBe(5);
    });
  });

  describe('navigation', () => {
    test('should initialize with default paths', () => {
      expect(currentPath.get()).toBe('/');
      expect(previousPath.get()).toBe('/');
    });

    test('should update navigation paths', () => {
      currentPath.set('/about');
      previousPath.set('/home');
      
      expect(currentPath.get()).toBe('/about');
      expect(previousPath.get()).toBe('/home');
    });
  });

  describe('notifications', () => {
    test('should initialize with empty array', () => {
      expect(notifications.get()).toEqual([]);
    });

    test('should add notifications', () => {
      const testMessage = 'Test notification';
      notifications.set([...notifications.get(), testMessage]);
      
      expect(notifications.get()).toContain(testMessage);
      expect(notifications.get().length).toBe(1);
    });
  });

  describe('messageStore', () => {
    test('should initialize with empty string', () => {
      expect(messageStore.get()).toBe('');
    });

    test('should update message', () => {
      const testMessage = 'Test message';
      messageStore.set(testMessage);
      expect(messageStore.get()).toBe(testMessage);
    });
  });

  describe('userStore', () => {
    test('should initialize as null', () => {
      expect(userStore.get()).toBeNull();
    });

    test('should store user data', () => {
      const testUser = { id: 1, name: 'Test User' };
      userStore.set(testUser);
      expect(userStore.get()).toEqual(testUser);
    });
  });

  describe('loadingStore', () => {
    test('should initialize as true', () => {
      expect(loadingStore.get()).toBe(true);
    });

    test('should update loading state', () => {
      loadingStore.set(false);
      expect(loadingStore.get()).toBe(false);
    });
  });

  describe('themeStore', () => {
    test('should initialize with dark theme', () => {
      expect(themeStore.get()).toEqual({ theme: 'dark', systemTheme: 'dark' });
    });

    test('should update theme', () => {
      themeStore.set({ theme: 'light', systemTheme: 'light' });
      expect(themeStore.get()).toEqual({ theme: 'light', systemTheme: 'light' });
    });
  });

  describe('useLoading', () => {
    test('should return loading state and message', () => {
      loadingStore.set(true);
      messageStore.set('Loading...');
      
      const result = useLoading();
      
      expect(result).toEqual({
        isLoading: true,
        message: 'Loading...'
      });
    });
  });
});
