// popup.js - Handle extension popup functionality with SLDS styling (v0.16)

document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with error checking
    const activeToggle = document.getElementById('activeToggle');
    const themeToggleSwitch = document.getElementById('themeToggleSwitch');
    const defaultPageSelect = document.getElementById('defaultPageSelect');
    const customPageInput = document.getElementById('customPageInput');
    const customPageGroup = document.getElementById('customPageGroup');
    const useCurrentPageBtn = document.getElementById('useCurrentPageBtn');
    
    // Display extension version
    const version = chrome.runtime.getManifest().version;
    const versionDisplay = document.getElementById('version-display');
    if (versionDisplay) {
        versionDisplay.textContent = `v${version}`;
    }
    
    // Check if all required elements exist
    if (!activeToggle || !themeToggleSwitch || !defaultPageSelect || !customPageInput || !customPageGroup || !useCurrentPageBtn) {
        console.error('Required DOM elements not found:', {
            activeToggle: !!activeToggle,
            themeToggleSwitch: !!themeToggleSwitch,
            defaultPageSelect: !!defaultPageSelect,
            customPageInput: !!customPageInput,
            customPageGroup: !!customPageGroup,
            useCurrentPageBtn: !!useCurrentPageBtn
        });
        return;
    }
    
    // Load current settings
    chrome.storage.sync.get(['redirectEnabled', 'defaultPage', 'customPage', 'theme'], function(result) {
        const isEnabled = result.redirectEnabled !== false; // Default to true
        const defaultPage = result.defaultPage || 'deployment';
        const customPage = result.customPage || '';
        const theme = result.theme || 'light';
        
        updateUI(isEnabled);
        setTheme(theme);
        
        // Set the select value
        if (['deployment', 'users', 'profiles', 'permsets', 'flows', 'apex', 'objects', 'home'].includes(defaultPage)) {
            defaultPageSelect.value = defaultPage;
        } else {
            defaultPageSelect.value = 'custom';
            customPageInput.value = customPage || defaultPage;
            customPageGroup.classList.remove('hidden');
            customPageGroup.classList.add('show');
        }
    });
    
    // Handle theme toggle switch only
    if (themeToggleSwitch) {
        themeToggleSwitch.addEventListener('change', toggleTheme);
    }
    
    function toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        chrome.storage.sync.set({'theme': newTheme});
    }
    
    // Handle main toggle change
    if (activeToggle) {
        activeToggle.addEventListener('change', function() {
            const newState = activeToggle.checked;
            chrome.storage.sync.set({'redirectEnabled': newState}, function() {
                updateUI(newState);
            });
        });
    }
    
    // Handle default page select changes
    if (defaultPageSelect) {
        defaultPageSelect.addEventListener('change', function() {
            const value = defaultPageSelect.value;
            
            if (value === 'custom') {
                customPageGroup.classList.remove('hidden');
                customPageGroup.classList.add('show');
                if (customPageInput) customPageInput.focus();
                // Save the custom value if there is one
                const customValue = customPageInput ? customPageInput.value.trim() : '';
                if (customValue) {
                    chrome.storage.sync.set({'defaultPage': customValue, 'customPage': customValue});
                }
            } else {
                customPageGroup.classList.add('hidden');
                customPageGroup.classList.remove('show');
                chrome.storage.sync.set({'defaultPage': value});
            }
        });
    }
    
    // Handle custom page input changes
    if (customPageInput) {
        customPageInput.addEventListener('input', function() {
            let value = customPageInput.value.trim();
            // Remove leading duplicate '/lightning' if present
            if (value.startsWith('/lightning/lightning')) {
                value = value.replace(/^\/lightning\/lightning/, '/lightning');
            }
            // Lightning page check
            const notLightningIndicator = document.getElementById('notLightningIndicator');
            const isLightning = value.startsWith('/lightning/') || value.startsWith('https://') && value.includes('/lightning/');
            if (notLightningIndicator) {
                notLightningIndicator.style.display = isLightning || !value ? 'none' : '';
            }
            if (useCurrentPageBtn) {
                if (!isLightning && value) {
                    useCurrentPageBtn.disabled = true;
                    useCurrentPageBtn.classList.add('slds-button_disabled');
                    useCurrentPageBtn.style.background = '#e0e0e0';
                    useCurrentPageBtn.style.color = '#888';
                    useCurrentPageBtn.style.borderColor = '#ccc';
                } else {
                    useCurrentPageBtn.disabled = false;
                    useCurrentPageBtn.classList.remove('slds-button_disabled');
                    useCurrentPageBtn.style.background = '';
                    useCurrentPageBtn.style.color = '';
                    useCurrentPageBtn.style.borderColor = '';
                }
            }
            if (value) {
                chrome.storage.sync.set({'defaultPage': value, 'customPage': value});
            }
        });
    }
    
    // Handle "Use Current Page" button
    if (useCurrentPageBtn) {
        useCurrentPageBtn.textContent = 'Use Current Page';
        useCurrentPageBtn.addEventListener('click', function() {
            if (useCurrentPageBtn.disabled) return;
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    const url = tabs[0].url;
                    const lightningPath = extractLightningPath(url);
                    
                    if (lightningPath && customPageInput) {
                        customPageInput.value = lightningPath;
                        chrome.storage.sync.set({'defaultPage': lightningPath, 'customPage': lightningPath});
                        
                        // Visual feedback - show the updated path
                        useCurrentPageBtn.textContent = 'Updated';
                        
                        // Briefly highlight the input to show the updated value
                        customPageInput.style.backgroundColor = '#e8f5e8';
                        customPageInput.style.borderColor = '#4caf50';
                        
                        setTimeout(() => {
                            useCurrentPageBtn.textContent = 'Use Current Page';
                            customPageInput.style.backgroundColor = '';
                            customPageInput.style.borderColor = '';
                        }, 2000);
                    } else {
                        alert('Current page is not a valid Salesforce Lightning page.\n\nPlease navigate to a Lightning page first.');
                    }
                }
            });
        });
    }
    
    // Extract Lightning path from full URL
    function extractLightningPath(url) {
        try {
            const urlObj = new URL(url);
            
            // Check if it's a Salesforce domain
            if (!urlObj.hostname.includes('salesforce') && !urlObj.hostname.includes('force.com')) {
                return null;
            }
            
            // Find the lightning path
            const lightningIndex = urlObj.pathname.indexOf('/lightning/');
            if (lightningIndex !== -1) {
                return urlObj.pathname.substring(lightningIndex);
            }
            
            // Handle one.app URLs
            if (urlObj.pathname.includes('/one/one.app')) {
                const hash = urlObj.hash;
                if (hash && hash.includes('/lightning/')) {
                    const lightningStart = hash.indexOf('/lightning/');
                    const lightningPath = hash.substring(lightningStart);
                    // Remove any query parameters from the hash
                    return lightningPath.split('?')[0];
                }
            }
            
            return null;
        } catch (e) {
            return null;
        }
    }
    
    function setTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        
        // Update theme toggle switch
        if (themeToggleSwitch) {
            themeToggleSwitch.checked = theme === 'dark';
        }
    }
    
    function updateUI(isEnabled) {
        if (activeToggle) {
            activeToggle.checked = isEnabled;
        }
        if (customPageInput) {
            customPageInput.disabled = !isEnabled;
            if (!isEnabled) {
                customPageInput.classList.add('slds-disabled');
            } else {
                customPageInput.classList.remove('slds-disabled');
            }
        }
        if (useCurrentPageBtn) {
            useCurrentPageBtn.disabled = !isEnabled;
            if (!isEnabled) {
                useCurrentPageBtn.classList.add('slds-disabled');
            } else {
                useCurrentPageBtn.classList.remove('slds-disabled');
            }
        }
        if (isEnabled) {
            if (defaultPageSelect) defaultPageSelect.disabled = false;
        } else {
            if (defaultPageSelect) defaultPageSelect.disabled = true;
        }
    }
    
    // Update button state based on current page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && useCurrentPageBtn) {
            const url = tabs[0].url;
            const lightningPath = extractLightningPath(url);
            
            if (!lightningPath) {
                useCurrentPageBtn.disabled = true;
                useCurrentPageBtn.textContent = 'Not Lightning';
                useCurrentPageBtn.classList.add('slds-button_disabled');
                useCurrentPageBtn.style.background = '#e0e0e0';
                useCurrentPageBtn.style.color = '#888';
                useCurrentPageBtn.style.borderColor = '#ccc';
            } else {
                useCurrentPageBtn.disabled = false;
                useCurrentPageBtn.textContent = 'Use Current Page';
                useCurrentPageBtn.classList.remove('slds-button_disabled');
                useCurrentPageBtn.style.background = '';
                useCurrentPageBtn.style.color = '';
                useCurrentPageBtn.style.borderColor = '';
            }
        }
    });
});