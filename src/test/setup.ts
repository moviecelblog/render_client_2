// Configure Jest environment
import '@testing-library/jest-dom';

// Add custom matchers for Map objects
expect.extend({
  toBeInstanceOf(received: any, expected: any) {
    const pass = received instanceof expected;
    return {
      pass,
      message: () =>
        `expected ${received} ${pass ? 'not ' : ''}to be instance of ${expected}`,
    };
  },
});

// Add Map serialization support
const mapReplacer = (key: string, value: any) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  }
  return value;
};

const mapReviver = (key: string, value: any) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
};

// Add global helpers for Map serialization
(global as any).mapToJson = (map: Map<any, any>) => {
  return JSON.stringify(map, mapReplacer);
};

(global as any).jsonToMap = (jsonStr: string) => {
  return JSON.parse(jsonStr, mapReviver);
};

// Add fetch mock support
(global as any).fetch = jest.fn();

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  // Reset fetch mock
  (global.fetch as jest.Mock).mockReset();
});
