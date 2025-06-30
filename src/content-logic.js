// content-logic.js - Pure functions for the Salesforce Default Page extension

const UrlLogic = {
  isLightningExperience: (url, hostname) => {
    if (url.includes('/secur/contentDoor')) {
      return true;
    }
    return url.includes('/lightning/') ||
           hostname.includes('lightning.force.com') ||
           (hostname.includes('salesforce.com') && url.includes('/lightning/')) ||
           url.includes('/one/one.app');
  },

  isInitialLanding: (url) => {
    const postLoginPaths = [
      '/lightning/page/home',
      '/lightning/setup/SetupOneHome/home',
      '/lightning/n/',
      '/lightning/o/',
      '/lightning/setup/',
      '/one/one.app',
      '/secur/contentDoor'
    ];
    if (url.endsWith('/lightning/') || url.endsWith('/lightning')) {
      return true;
    }
    if (url.includes('/one/one.app') || url.includes('/secur/contentDoor')) {
      return true;
    }
    return postLoginPaths.some(path => url.includes(path));
  },

  getTargetUrl: (origin, defaultPage) => {
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
    if (shortcuts[defaultPage]) {
      return origin + shortcuts[defaultPage];
    }
    if (defaultPage.startsWith('/lightning/')) {
      return origin + defaultPage;
    }
    if (defaultPage.startsWith('http')) {
      return defaultPage;
    }
    return origin + '/lightning/' + defaultPage.replace(/^\/+/, '');
  }
};

// Export for testing in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UrlLogic;
} 