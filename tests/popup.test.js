const fs = require('fs');
const path = require('path');

// Mock the chrome object before modules are loaded
global.chrome = {
  storage: {
    sync: {
      get: jest.fn((keys, callback) => callback({
        redirectEnabled: true,
        defaultPage: 'deployment',
        theme: 'light'
      })),
      set: jest.fn((data, callback) => callback()),
    },
  },
  runtime: {
    getManifest: jest.fn(() => ({ version: '1.0' })),
  },
  tabs: {
    query: jest.fn(),
  }
};

describe('Popup UI Logic', () => {
  let popup;

  beforeEach(() => {
    // Reset DOM and mocks
    document.body.innerHTML = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    jest.resetModules();
    chrome.storage.sync.set.mockClear();

    // Load the script
    popup = require('../src/popup.js');

    // Manually trigger DOMContentLoaded to run the script's main logic
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('should toggle the extension off and disable inputs', () => {
    const activeToggle = document.getElementById('activeToggle');
    activeToggle.checked = false;
    activeToggle.dispatchEvent(new Event('change'));

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ redirectEnabled: false }, expect.any(Function));
    
    const defaultPageSelect = document.getElementById('defaultPageSelect');
    expect(defaultPageSelect.disabled).toBe(true);
  });

  it('should save the selected page when changed', () => {
    const defaultPageSelect = document.getElementById('defaultPageSelect');
    defaultPageSelect.value = 'users';
    defaultPageSelect.dispatchEvent(new Event('change'));

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ defaultPage: 'users' });
  });

  it('should show custom input and save its value', () => {
    const defaultPageSelect = document.getElementById('defaultPageSelect');
    defaultPageSelect.value = 'custom';
    defaultPageSelect.dispatchEvent(new Event('change'));

    const customPageGroup = document.getElementById('customPageGroup');
    expect(customPageGroup.classList.contains('hidden')).toBe(false);

    const customPageInput = document.getElementById('customPageInput');
    customPageInput.value = '/my/custom/path';
    customPageInput.dispatchEvent(new Event('input'));

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      defaultPage: '/my/custom/path',
      customPage: '/my/custom/path'
    });
  });
}); 