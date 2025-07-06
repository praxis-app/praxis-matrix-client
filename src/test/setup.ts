import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

// Mock environment variables
Object.defineProperty(globalThis, 'import.meta', {
  value: {
    env: {
      VITE_SERVER_BASE_URL: 'https://test-server.example.com',
    },
  },
  configurable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
