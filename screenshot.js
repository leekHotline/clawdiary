const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/ai-tools', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/root/.openclaw/workspace/ai-diary/screenshot.png' });
  await browser.close();
})();
