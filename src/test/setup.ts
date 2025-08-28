import { expect } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock any browser APIs or global variables your tests might need
global.ResizeObserver = require('resize-observer-polyfill');

// Setup any test utilities or mocks here
