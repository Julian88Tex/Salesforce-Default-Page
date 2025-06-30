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
    chrome.tabs.query.mockClear();
    window.alert = jest.fn();

    // Load the script
    popup = require('../src/popup.js');

    // Manually trigger DOMContentLoaded to run the script's main logic
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('should initialize the UI with stored values', () => {
    const activeToggle = document.getElementById('activeToggle');
    const defaultPageSelect = document.getElementById('defaultPageSelect');
    
    expect(activeToggle.checked).toBe(true);
    expect(defaultPageSelect.value).toBe('deployment');
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

  it('should save the theme when toggled', () => {
    const themeToggle = document.getElementById('themeToggleSwitch');
    themeToggle.dispatchEvent(new Event('change'));

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ theme: 'dark' });
  });

  it('should display the correct version number', () => {
    const versionDisplay = document.getElementById('version-display');
    expect(versionDisplay.textContent).toBe('v1.0');
  });

  describe('Use Current Page button', () => {
    it('should be disabled by default', () => {
      const useCurrentPageBtn = document.getElementById('useCurrentPageBtn');
      expect(useCurrentPageBtn.disabled).toBe(true);
    });
    
    it('should be enabled only when custom page is selected', () => {
        const useCurrentPageBtn = document.getElementById('useCurrentPageBtn');
        const defaultPageSelect = document.getElementById('defaultPageSelect');

        // Initially should be disabled
        expect(useCurrentPageBtn.disabled).toBe(true);

        // Select custom, should be enabled
        defaultPageSelect.value = 'custom';
        defaultPageSelect.dispatchEvent(new Event('change'));
        expect(useCurrentPageBtn.disabled).toBe(false);
    });

    it('should set input value from a valid lightning page', () => {
        chrome.tabs.query.mockImplementation((query, callback) => {
            callback([{ url: 'https://something.lightning.force.com/lightning/setup/ObjectManager/home' }]);
        });

        const defaultPageSelect = document.getElementById('defaultPageSelect');
        defaultPageSelect.value = 'custom';
        defaultPageSelect.dispatchEvent(new Event('change'));
        
        const useCurrentPageBtn = document.getElementById('useCurrentPageBtn');
        useCurrentPageBtn.dispatchEvent(new Event('click'));

        expect(chrome.tabs.query).toHaveBeenCalled();
        expect(chrome.storage.sync.set).toHaveBeenCalledWith({
            defaultPage: '/lightning/setup/ObjectManager/home',
            customPage: '/lightning/setup/ObjectManager/home'
        });
    });

    it('should show an alert for a non-lightning page', () => {
        chrome.tabs.query.mockImplementation((query, callback) => {
            callback([{ url: 'https://www.google.com' }]);
        });

        const defaultPageSelect = document.getElementById('defaultPageSelect');
        defaultPageSelect.value = 'custom';
        defaultPageSelect.dispatchEvent(new Event('change'));
        
        const useCurrentPageBtn = document.getElementById('useCurrentPageBtn');
        useCurrentPageBtn.dispatchEvent(new Event('click'));

        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('not a valid Salesforce Lightning page'));
    });
  });

  describe('Edge Cases', () => {
    it('should use default values if storage is empty', () => {
      // Redo setup with empty storage
      chrome.storage.sync.get.mockImplementation((keys, callback) => callback({}));
      document.body.innerHTML = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
      require('../src/popup.js');
      document.dispatchEvent(new Event('DOMContentLoaded'));

      const activeToggle = document.getElementById('activeToggle');
      const defaultPageSelect = document.getElementById('defaultPageSelect');

      expect(activeToggle.checked).toBe(true); // Default enabled is true
      expect(defaultPageSelect.value).toBe('deployment'); // Default page
    });

    it('extractLightningPath should return null for invalid URLs', () => {
        // This function is not exported, so we have to test its effects.
        // The effect is that an alert is shown.
        chrome.tabs.query.mockImplementation((query, callback) => {
            callback([{ url: 'not-a-valid-url' }]);
        });

        const defaultPageSelect = document.getElementById('defaultPageSelect');
        defaultPageSelect.value = 'custom';
        defaultPageSelect.dispatchEvent(new Event('change'));

        const useCurrentPageBtn = document.getElementById('useCurrentPageBtn');
        useCurrentPageBtn.dispatchEvent(new Event('click'));
        expect(window.alert).toHaveBeenCalled();
    });
  });
}); 