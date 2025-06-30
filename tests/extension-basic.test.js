const path = require('path');
const fs = require('fs');

describe('Salesforce Default Page Extension', () => {
  beforeAll(async () => {
    // Go to a blank page to start
    await page.goto('about:blank');
  });

  it('loads the extension popup and displays the version', async () => {
    // Find the extension id by looking for the manifest.json
    const targets = await browser.targets();
    const extensionTarget = targets.find(
      (target) => target.type() === 'background_page' || target.type() === 'service_worker'
    );
    expect(extensionTarget).toBeDefined();

    // Get the extension ID
    const extensionUrl = extensionTarget.url() || '';
    const [, , extensionId] = extensionUrl.split('/');
    expect(extensionId).toBeDefined();

    // Open the popup page
    const popupHtml = `chrome-extension://${extensionId}/popup.html`;
    await page.goto(popupHtml);
    await expect(page).toMatch('Salesforce Default Page');
    await expect(page).toMatch(/v\d+\.\d+/);
  });

  it('has a privacy policy file', () => {
    const privacyPath = path.join(__dirname, '../PRIVACY_POLICY.md');
    expect(fs.existsSync(privacyPath)).toBe(true);
    const content = fs.readFileSync(privacyPath, 'utf8');
    expect(content).toMatch(/Privacy Policy/);
  });
}); 