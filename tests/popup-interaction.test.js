const puppeteer = require('puppeteer');

describe('Salesforce Default Page Popup UI', () => {
  let page;
  let extensionId;

  beforeAll(async () => {
    const targets = await browser.targets();
    const extensionTarget = targets.find(target => target.type() === 'background_page' || target.type() === 'service_worker');
    if (!extensionTarget) {
        throw new Error("Could not find extension background page. Check that the extension loaded correctly.");
    }
    const extensionUrl = extensionTarget.url() || '';
    [, , extensionId] = extensionUrl.split('/');
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
  });

  afterEach(async () => {
    await page.close();
  });

  it('should save the selected page when changed', async () => {
    await page.waitForSelector('#defaultPageSelect');
    await page.select('#defaultPageSelect', 'users');

    const storedData = await page.evaluate(() => {
      return new Promise(resolve => {
        chrome.storage.sync.get('defaultPage', (result) => {
          resolve(result);
        });
      });
    });
    expect(storedData.defaultPage).toBe('users');
  });

  it('should show and save custom page input', async () => {
    await page.waitForSelector('#defaultPageSelect');
    await page.select('#defaultPageSelect', 'custom');
    
    await page.waitForSelector('#customPageGroup.show', { visible: true });
    
    await page.type('#customPageInput', '/lightning/setup/ObjectManager/home');
    
    const storedData = await page.evaluate(() => {
      return new Promise(resolve => {
        chrome.storage.sync.get('defaultPage', (result) => {
          resolve(result);
        });
      });
    });
    
    expect(storedData.defaultPage).toBe('/lightning/setup/ObjectManager/home');
  });

  it('should toggle the redirect off and disable inputs', async () => {
    await page.waitForSelector('#activeToggle');
    await page.click('#activeToggle'); // Turn it off

    const storedData = await page.evaluate(() => {
        return new Promise(resolve => {
            chrome.storage.sync.get('redirectEnabled', (result) => {
                resolve(result);
            });
        });
    });
    expect(storedData.redirectEnabled).toBe(false);

    const isSelectDisabled = await page.$eval('#defaultPageSelect', el => el.disabled);
    expect(isSelectDisabled).toBe(true);
  });
}); 