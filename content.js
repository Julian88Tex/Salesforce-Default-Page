// content.js - Lightning Experience default page redirect after login (v0.16)

(function() {
    'use strict';
    
    console.log('Salesforce Lightning Default Page: Content script loaded');
    
    const currentUrl = window.location.href;
    const hostname = window.location.hostname;
    
    // Only work with Lightning Experience domains OR contentDoor redirects
    function isLightningExperience() {
        // Allow contentDoor pages (intermediate redirects) even if not in lightning yet
        if (currentUrl.includes('/secur/contentDoor')) {
            console.log('Is contentDoor redirect page');
            return true;
        }
        
        const isLightning = currentUrl.includes('/lightning/') || 
                           hostname.includes('lightning.force.com') ||
                           (hostname.includes('salesforce.com') && currentUrl.includes('/lightning/')) ||
                           currentUrl.includes('/one/one.app');
        console.log('Is Lightning Experience:', isLightning, 'URL:', currentUrl);
        return isLightning;
    }
    
    // Check if this is a post-login landing (home page or setup home)
    function isInitialLanding() {
        const postLoginPaths = [
            '/lightning/page/home',
            '/lightning/setup/SetupOneHome/home',
            '/lightning/n/',
            '/lightning/o/',
            '/lightning/setup/',
            '/one/one.app',
            '/secur/contentDoor'  // Intermediate redirect page
        ];
        
        // Check for URLs that end with just /lightning/ (root lightning)
        if (currentUrl.endsWith('/lightning/') || currentUrl.endsWith('/lightning')) {
            console.log('Initial landing: Root lightning URL');
            return true;
        }
        
        // Check for one.app URLs (common after login)
        if (currentUrl.includes('/one/one.app')) {
            console.log('Initial landing: one.app URL');
            return true;
        }
        
        // Check for contentDoor intermediate redirect
        if (currentUrl.includes('/secur/contentDoor')) {
            console.log('Initial landing: contentDoor intermediate page');
            return true;
        }
        
        const isLanding = postLoginPaths.some(path => currentUrl.includes(path));
        console.log('Is initial landing:', isLanding, 'Checked paths:', postLoginPaths);
        return isLanding;
    }
    
    // Check if we came from login or CLI (referrer analysis)
    function isFromLogin() {
        const referrer = document.referrer;
        console.log('Referrer:', referrer);
        
        // No referrer usually means direct access (like SF CLI)
        if (!referrer) {
            console.log('No referrer - likely direct access or CLI');
            return true;
        }
        
        // Check if referrer is login page
        if (referrer.includes('/login') || 
            referrer.includes('/secur/login') || 
            referrer.includes('login.salesforce.com') ||
            referrer.includes('/secur/contentDoor')) {  // Also from contentDoor
            console.log('Came from login page or contentDoor');
            return true;
        }
        
        // Check for contentDoor in current URL (intermediate redirect)
        if (currentUrl.includes('/secur/contentDoor')) {
            console.log('Currently on contentDoor - treating as login flow');
            return true;
        }
        
        // External referrer (not same domain) suggests fresh entry
        try {
            const currentDomain = window.location.hostname;
            const referrerDomain = new URL(referrer).hostname;
            const isExternal = !referrerDomain.includes('salesforce.com') && !referrerDomain.includes('force.com');
            console.log('External referrer check:', isExternal, 'Current:', currentDomain, 'Referrer:', referrerDomain);
            return isExternal;
        } catch (e) {
            console.log('Error parsing referrer URL:', e);
            return false;
        }
    }
    
    // Get session storage key for this org
    function getOrgSessionKey() {
        return `sf_extension_visited_${hostname}`;
    }
    
    // Check if we've already redirected in this session
    function hasAlreadyRedirected() {
        const hasRedirected = sessionStorage.getItem(getOrgSessionKey()) === 'true';
        console.log('Already redirected in this session:', hasRedirected);
        return hasRedirected;
    }
    
    // Mark that we've redirected in this session
    function markAsRedirected() {
        sessionStorage.setItem(getOrgSessionKey(), 'true');
        console.log('Marked as redirected for this session');
    }
    
    // Build the target URL based on user preference
    function getTargetUrl(defaultPage) {
        const baseUrl = window.location.origin;
        
        // Handle common page shortcuts
        const shortcuts = {
            'deployment': '/lightning/setup/DeployStatus/home',
            'users': '/lightning/setup/ManageUsers/home',
            'profiles': '/lightning/setup/EnhancedProfiles/home',
            'permsets': '/lightning/setup/PermSets/home',
            'flows': '/lightning/setup/Flows/home',
            'apex': '/lightning/setup/ApexClasses/home',
            'objects': '/lightning/setup/ObjectManager/home',
            'home': '/lightning/page/home'
        };
        
        // If it's a shortcut, use the full path
        if (shortcuts[defaultPage]) {
            return baseUrl + shortcuts[defaultPage];
        }
        
        // If it already starts with /lightning/, use as-is
        if (defaultPage.startsWith('/lightning/')) {
            return baseUrl + defaultPage;
        }
        
        // If it's a full URL, use as-is
        if (defaultPage.startsWith('http')) {
            return defaultPage;
        }
        
        // Otherwise, assume it's a lightning path
        return baseUrl + '/lightning/' + defaultPage.replace(/^\/+/, '');
    }
    
    // Main redirect function
    function performRedirect() {
        console.log('Attempting redirect...');
        
        // Only proceed if this is Lightning Experience
        if (!isLightningExperience()) {
            console.log('Not Lightning Experience, skipping');
            return;
        }
        
        // Only redirect on initial landing pages
        if (!isInitialLanding()) {
            console.log('Not initial landing page, skipping');
            return;
        }
        
        // Only redirect if coming from login or external source
        if (!isFromLogin()) {
            console.log('Not from login or external source, skipping');
            return;
        }
        
        // Don't redirect if we've already done so in this session
        if (hasAlreadyRedirected()) {
            console.log('Already redirected in this session, skipping');
            return;
        }
        
        console.log('All conditions met, proceeding with redirect...');
        
        // Get user's default page preference
        chrome.storage.sync.get(['defaultPage', 'redirectEnabled'], function(result) {
            console.log('Storage result:', result);
            
            const isEnabled = result.redirectEnabled !== false; // Default to true
            const defaultPage = result.defaultPage || 'deployment';
            
            if (!isEnabled) {
                console.log('Extension disabled, skipping redirect');
                return;
            }
            
            // Mark as redirected to prevent future redirects in this session
            markAsRedirected();
            
            const targetUrl = getTargetUrl(defaultPage);
            console.log('Salesforce Lightning Default Page: Redirecting to', targetUrl);
            
            // Use replace to avoid back button issues
            window.location.replace(targetUrl);
        });
    }
    
    // Execute redirect with appropriate timing
    function initRedirect() {
        console.log('Initializing redirect check...');
        
        // For contentDoor pages, wait a bit longer as they auto-redirect
        const delay = currentUrl.includes('/secur/contentDoor') ? 1000 : 500;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log(`DOM loaded, checking redirect in ${delay}ms`);
                setTimeout(performRedirect, delay);
            });
        } else {
            console.log(`DOM already loaded, checking redirect in ${delay}ms`);
            setTimeout(performRedirect, delay);
        }
    }
    
    // Start the process
    initRedirect();
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Received message:', message);
        
        if (message.action === 'testRedirect') {
            // Clear session storage to allow testing
            sessionStorage.removeItem(getOrgSessionKey());
            console.log('Testing redirect - cleared session storage');
            setTimeout(performRedirect, 100);
        }
        sendResponse({status: 'ok'});
    });
    
})();