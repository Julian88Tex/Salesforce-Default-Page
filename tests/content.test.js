const UrlLogic = require('../src/content-logic');

describe('Content Script Logic', () => {

  describe('isLightningExperience', () => {
    it('should return true for lightning URLs', () => {
      expect(UrlLogic.isLightningExperience('https://my.domain.lightning.force.com/lightning/page/home', 'my.domain.lightning.force.com')).toBe(true);
      expect(UrlLogic.isLightningExperience('https://my.domain.my.salesforce.com/one/one.app', 'my.domain.my.salesforce.com')).toBe(true);
      expect(UrlLogic.isLightningExperience('https://my.domain.my.salesforce.com/secur/contentDoor', 'my.domain.my.salesforce.com')).toBe(true);
    });

    it('should return false for classic URLs', () => {
      expect(UrlLogic.isLightningExperience('https://my.domain.my.salesforce.com/home/home.jsp', 'my.domain.my.salesforce.com')).toBe(false);
    });
  });

  describe('isInitialLanding', () => {
    it('should return true for post-login landing pages', () => {
      expect(UrlLogic.isInitialLanding('https://a.b.com/lightning/page/home')).toBe(true);
      expect(UrlLogic.isInitialLanding('https://a.b.com/lightning/setup/SetupOneHome/home')).toBe(true);
      expect(UrlLogic.isInitialLanding('https://a.b.com/secur/contentDoor')).toBe(true);
      expect(UrlLogic.isInitialLanding('https://a.b.com/one/one.app')).toBe(true);
    });

    it('should return false for other pages', () => {
      expect(UrlLogic.isInitialLanding('https://a.b.com/lightning/r/Account/someId/view')).toBe(false);
    });
  });

  describe('getTargetUrl', () => {
    const origin = 'https://example.com';

    it('should handle shortcuts', () => {
      expect(UrlLogic.getTargetUrl(origin, 'deployment')).toBe('https://example.com/lightning/setup/DeployStatus/home');
    });

    it('should handle full paths', () => {
      expect(UrlLogic.getTargetUrl(origin, '/lightning/setup/Users/home')).toBe('https://example.com/lightning/setup/Users/home');
    });

    it('should handle full URLs', () => {
      expect(UrlLogic.getTargetUrl(origin, 'https://another.com/path')).toBe('https://another.com/path');
    });

    it('should handle custom relative paths', () => {
      expect(UrlLogic.getTargetUrl(origin, 'my/custom/page')).toBe('https://example.com/lightning/my/custom/page');
    });
  });

}); 