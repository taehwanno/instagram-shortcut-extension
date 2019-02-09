import * as path from 'path';
import * as puppeteer from 'puppeteer';

const extensionPath = path.join(__dirname, '../dist');

describe('Instagram Shortcut Extension', () => {
  it('should properly install extension', async () => {
    const browser = await puppeteer.launch({
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
      dumpio: true,
      /**
       * Chrome headless doesn't support extensions.
       * @see https://github.com/GoogleChrome/puppeteer/issues/659
       * @see https://bugs.chromium.org/p/chromium/issues/detail?id=706008#c5
       */
      headless: false,
    });
    expect(browser).toBeTruthy();
    await browser.close();
  });
});
