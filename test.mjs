import puppeteer from 'puppeteer';
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    try {
        await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle2', timeout: 5000 });
    } catch (e) { }
    await browser.close();
})();
