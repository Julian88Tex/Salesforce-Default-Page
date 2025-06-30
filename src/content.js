// content.js - Lightning Experience default page redirect after login (v0.44)
// Enhanced Safe Browsing compliant version

(function() {
    'use strict';
    
    // All pure logic is in content-logic.js, loaded via manifest.json
    // This file handles the browser-specific parts.

    const currentUrl = window.location.href;
    const hostname = window.location.hostname;
    
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
    
    // Main redirect function
    function performRedirect() {
        // Only proceed if this is Lightning Experience
        if (!UrlLogic.isLightningExperience(currentUrl, hostname)) {
            return;
        }
        
        // Only redirect on initial landing pages
        if (!UrlLogic.isInitialLanding(currentUrl)) {
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
            
            const targetUrl = UrlLogic.getTargetUrl(window.location.origin, defaultPage);
            
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