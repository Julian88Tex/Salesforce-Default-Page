// tests/setup.js

// Mock the chrome extension APIs before each test
beforeAll(() => {
  global.chrome = {
    storage: {
      sync: {
        get: jest.fn((keys, callback) => {
          callback({});
        }),
        set: jest.fn((items, callback) => {
          if (callback) {
            callback();
          }
        }),
      },
    },
    runtime: {
      getManifest: () => {
        return { version: '0.45' };
      },
      onMessage: {
        addListener: jest.fn(),
      },
    },
    tabs: {
      query: jest.fn(),
    },
  };
}); 