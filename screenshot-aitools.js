const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/snap/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://127.0.0.1:3000/ai-tools-navigator', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/root/.openclaw/workspace/ai-diary/ai-tools-screenshot.png' });
  await browser.close();
})();
