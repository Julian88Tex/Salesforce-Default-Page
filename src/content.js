// content.js - Lightning Experience default page redirect after login (v0.43)
// Enhanced Safe Browsing compliant version

(function() {
    'use strict';
    
    const currentUrl = window.location.href;
    const hostname = window.location.hostname;
    
    // Only work with Lightning Experience domains OR contentDoor redirects
    function isLightningExperience() {
        // Allow contentDoor pages (intermediate redirects) even if not in lightning yet
        if (currentUrl.includes('/secur/contentDoor')) {
            return true;
        }
        
        const isLightning = currentUrl.includes('/lightning/') || 
                           hostname.includes('lightning.force.com') ||
                           (hostname.includes('salesforce.com') && currentUrl.includes('/lightning/')) ||
                           currentUrl.includes('/one/one.app');
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
            return true;
        }
        
        // Check for one.app URLs (common after login)
        if (currentUrl.includes('/one/one.app')) {
            return true;
        }
        
        // Check for contentDoor intermediate redirect
        if (currentUrl.includes('/secur/contentDoor')) {
            return true;
        }
        
        return postLoginPaths.some(path => currentUrl.includes(path));
    }
    
    // Check if we came from login or CLI (referrer analysis)
    function isFromLogin() {
        const referrer = document.referrer;
        
        // If no referrer, only treat as login if URL matches /secur/frontdoor.jsp?otp= (CLI support)
        if (!referrer) {
            if (/\/secur\/frontdoor\.jsp\?otp=/.test(window.location.pathname + window.location.search)) {
                return true;
            } else {
                return false;
            }
        }
        
        // Check if referrer is login page, contentDoor, or file.force.com
        if (
            referrer.includes('/login') || 
            referrer.includes('/secur/login') || 
            referrer.includes('login.salesforce.com') ||
            referrer.includes('test.salesforce.com') ||
            referrer.includes('/secur/contentDoor') ||
            referrer.includes('.file.force.com')
        ) {
            return true;
        }
        
        // Check for contentDoor in current URL (intermediate redirect)
        if (currentUrl.includes('/secur/contentDoor')) {
            return true;
        }
        
        // External referrer (not same domain) suggests fresh entry
        try {
            const currentDomain = window.location.hostname;
            const referrerDomain = new URL(referrer).hostname;
            const isExternal = !referrerDomain.includes('salesforce.com') && !referrerDomain.includes('force.com');
            return isExternal;
        } catch (e) {
            return false;
        }
    }
    
    // Get session storage key for this org
    function getOrgSessionKey() {
        return `sf_extension_visited_${hostname}`;
    }
    
    // Check if we've already redirected in this session
    function hasAlreadyRedirected() {
        return sessionStorage.getItem(getOrgSessionKey()) === 'true';
    }
    
    // Mark that we've redirected in this session
    function markAsRedirected() {
        sessionStorage.setItem(getOrgSessionKey(), 'true');
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
        // Only proceed if this is Lightning Experience
        if (!isLightningExperience()) {
            return;
        }
        
        // Only redirect on initial landing pages
        if (!isInitialLanding()) {
            return;
        }
        
        // Only redirect if coming from login or external source
        if (!isFromLogin()) {
            return;
        }
        
        // Don't redirect if we've already done so in this session
        if (hasAlreadyRedirected()) {
            return;
        }
        
        // Get user's default page preference
        chrome.storage.sync.get(['defaultPage', 'redirectEnabled'], function(result) {
            const isEnabled = result.redirectEnabled !== false; // Default to true
            const defaultPage = result.defaultPage || 'deployment';
            
            if (!isEnabled) {
                return;
            }
            
            const targetUrl = getTargetUrl(defaultPage);
            
            // Only redirect if target is different from current
            if (targetUrl !== currentUrl) {
                markAsRedirected();
                window.location.href = targetUrl;
            }
        });
    }
    
    // Initialize redirect with retry mechanism
    function initRedirect() {
        // Try immediate redirect
        performRedirect();
        
        // If DOM is not ready, wait and try again
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(performRedirect, 100);
            });
        } else {
            // DOM is ready, try with a small delay
            setTimeout(performRedirect, 100);
        }
    }
    
    // Start the redirect process
    initRedirect();
    
})();