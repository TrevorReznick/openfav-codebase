import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Estendi expect di Vitest con i matcher di jest-dom
expect.extend(matchers);

// Mock per ResizeObserver
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverStub;

// Pulisci dopo ogni test
afterEach(() => {
  cleanup();
});
