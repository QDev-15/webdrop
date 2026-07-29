import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect console errors
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warn') {
      console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  // Collect JS errors
  page.on('pageerror', err => {
    console.log('[JS ERROR]', err.message);
    console.log(err.stack);
  });

  try {
    console.log('Loading homepage...');
    await page.goto('http://localhost:8081/', { waitUntil: 'networkidle' });

    await page.waitForTimeout(2000);

    const html = await page.content();
    console.log('\n=== PAGE CONTENT ===');
    console.log(html.substring(0, 2000));

    console.log('\n=== INSPECTING PAGE ===');
    const rootContent = await page.locator('#root').innerHTML();
    console.log('Root innerHTML:', rootContent.substring(0, 500));

    console.log('\n=== CHECKING FOR ELEMENTS ===');
    const headings = await page.locator('h1, h2, h3').all();
    console.log(`Found ${headings.length} headings`);
    for (let i = 0; i < Math.min(3, headings.length); i++) {
      const text = await headings[i].textContent();
      console.log(`  H?: ${text}`);
    }

    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons`);

    const navs = await page.locator('nav, [role="navigation"]').all();
    console.log(`Found ${navs.length} navs`);

    const allText = await page.textContent('body');
    console.log('\n=== PAGE TEXT (first 500 chars) ===');
    console.log(allText.substring(0, 500));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

main();
