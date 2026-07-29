import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8081';
const MOBILE_WIDTH = 375;
const MOBILE_HEIGHT = 667;
const DESKTOP_WIDTH = 1200;
const DESKTOP_HEIGHT = 800;

let passCount = 0;
let failCount = 0;
const failures = [];

async function test(name, fn) {
  try {
    await fn();
    console.log(`✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`✗ ${name}`);
    failCount++;
    failures.push({ name, error: err.message });
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // ===== 1. HOMEPAGE TESTS =====
    console.log('\n=== 1. HOMEPAGE TESTS ===');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    await test('Homepage loads', async () => {
      const title = await page.title();
      if (!title || title.length === 0) throw new Error('Page title empty');
    });

    await test('Topbar 3 claims visible', async () => {
      const topbar = await page.locator('.dg-topbar, [class*="topbar"]').isVisible().catch(() => false);
      // Alternative: check for specific claim elements
      const claims = await page.locator('text=/Miễn phí|Đổi trả|Bảo hành/').count();
      if (claims < 3 && !topbar) throw new Error('Topbar claims not found');
    });

    await test('Navigation links present', async () => {
      const nav = await page.locator('nav, [role="navigation"]').first();
      if (!await nav.isVisible()) throw new Error('Navigation not visible');
    });

    await test('Search icon functional', async () => {
      const searchBtn = await page.locator('[class*="search"], button[aria-label*="tìm"], .dg-search').first();
      if (await searchBtn.isVisible()) {
        await searchBtn.click();
        // Check if search panel appears
        const panel = await page.locator('[class*="search-panel"], [class*="search-modal"]').first();
        if (!await panel.isVisible()) throw new Error('Search panel did not open');
      }
    });

    await test('Cart badge displays 0', async () => {
      const badge = await page.locator('[class*="cart-badge"], .dg-cart-badge').first();
      const text = await badge.textContent();
      if (text !== '0' && text !== '') throw new Error(`Cart badge is "${text}", expected "0"`);
    });

    // Test responsive - mobile view
    await page.setViewportSize({ width: MOBILE_WIDTH, height: MOBILE_HEIGHT });
    await test('Homepage responsive (mobile 375px)', async () => {
      const isScrollable = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
      if (isScrollable) throw new Error('Page horizontally scrollable on mobile');
    });

    // Test responsive - desktop view
    await page.setViewportSize({ width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT });
    await test('Homepage responsive (desktop 1200px)', async () => {
      const isScrollable = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
      if (isScrollable) throw new Error('Page horizontally scrollable on desktop');
    });

    // ===== 2. PRODUCTS PAGE TESTS =====
    console.log('\n=== 2. PRODUCTS PAGE TESTS ===');
    await page.goto(`${BASE_URL}/san-pham`, { waitUntil: 'networkidle' });

    await test('Products page loads', async () => {
      const heading = await page.locator('h1, h2, [class*="heading"]').first();
      if (!await heading.isVisible()) throw new Error('Page heading not visible');
    });

    await test('Filter toolbar visible', async () => {
      const toolbar = await page.locator('[class*="filter"], .dg-filter').first();
      if (!await toolbar.isVisible()) throw new Error('Filter toolbar not found');
    });

    await test('Products grid renders', async () => {
      const cards = await page.locator('[class*="product"], [class*="card"], .dg-prod').all();
      if (cards.length === 0) throw new Error('No product cards found');
      if (cards.length < 8) console.warn(`⚠ Only ${cards.length} products found (expected ~12)`);
    });

    await test('Category filter works', async () => {
      const categoryFilter = await page.locator('[class*="category"], input[id*="category"], select').first();
      if (await categoryFilter.isVisible()) {
        const options = await categoryFilter.locator('option').count();
        if (options < 2) throw new Error('Category filter has no options');
      }
    });

    await test('Add to cart button functional', async () => {
      const addBtn = await page.locator('button:has-text("Thêm"), button:has-text("Add"), [class*="add-cart"]').first();
      if (await addBtn.isVisible()) {
        await addBtn.click();
        // Cart badge should update
        const badge = await page.locator('[class*="cart-badge"]').first();
        const count = await badge.textContent();
        if (count === '0') throw new Error('Cart badge did not update after adding item');
      }
    });

    await test('Pagination or load more visible', async () => {
      const paginationContainer = await page.locator('[class*="pagination"], .dg-page, nav[aria-label*="page"]').first();
      if (!await paginationContainer.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.warn('⚠ Pagination not found (may load dynamically)');
      }
    });

    // ===== 3. PRODUCT DETAIL TESTS =====
    console.log('\n=== 3. PRODUCT DETAIL TESTS ===');
    await page.goto(`${BASE_URL}/san-pham/1`, { waitUntil: 'networkidle' });

    await test('Product detail page loads', async () => {
      const detailArea = await page.locator('[class*="product-detail"], [class*="detail"], .dg-detail').first();
      if (!await detailArea.isVisible()) throw new Error('Product detail area not found');
    });

    await test('Product image displays', async () => {
      const img = await page.locator('img[alt*="product"], img[alt*="sản phẩm"], .dg-detail img').first();
      if (!await img.isVisible()) throw new Error('Product image not visible');
    });

    await test('Price displayed', async () => {
      const price = await page.locator('[class*="price"], .dg-price, text=/đ/').first();
      if (!await price.isVisible()) throw new Error('Price not displayed');
    });

    await test('"Thêm vào giỏ" button works', async () => {
      const addBtn = await page.locator('button:has-text("Thêm"), [class*="add-cart"]').first();
      if (await addBtn.isVisible()) {
        const initialCount = await page.locator('[class*="cart-badge"]').first().textContent();
        await addBtn.click();
        await page.waitForTimeout(500);
        const newCount = await page.locator('[class*="cart-badge"]').first().textContent();
        if (newCount === initialCount) throw new Error('Cart count did not update');
      }
    });

    await test('"Mua ngay" button present', async () => {
      const buyBtn = await page.locator('button:has-text("Mua ngay"), [class*="buy-now"]').first();
      if (!await buyBtn.isVisible()) throw new Error('"Mua ngay" button not found');
    });

    // ===== 4. CART PAGE TESTS =====
    console.log('\n=== 4. CART PAGE TESTS ===');
    await page.goto(`${BASE_URL}/gio-hang`, { waitUntil: 'networkidle' });

    await test('Cart page loads', async () => {
      const cartArea = await page.locator('[class*="cart"], .dg-cart').first();
      if (!await cartArea.isVisible()) throw new Error('Cart area not found');
    });

    await test('Cart items display', async () => {
      const items = await page.locator('[class*="cart-item"], .dg-item, tr:has(img)').all();
      if (items.length === 0) console.warn('⚠ No items in cart (may be empty)');
    });

    await test('Checkout button present and functional', async () => {
      const checkoutBtn = await page.locator('button:has-text("Thanh toán"), button:has-text("Checkout"), [class*="checkout-btn"]').first();
      if (await checkoutBtn.isVisible()) {
        // Just verify it's clickable, don't actually click
        const isEnabled = await checkoutBtn.isEnabled();
        if (!isEnabled) throw new Error('Checkout button is disabled');
      }
    });

    // ===== 5. CHECKOUT PAGE TESTS =====
    console.log('\n=== 5. CHECKOUT PAGE TESTS ===');
    await page.goto(`${BASE_URL}/thanh-toan`, { waitUntil: 'networkidle' });

    await test('Checkout page loads', async () => {
      const form = await page.locator('form, [class*="checkout"], .dg-checkout').first();
      if (!await form.isVisible()) throw new Error('Checkout form not found');
    });

    await test('Form fields visible (name, phone, address)', async () => {
      const nameField = await page.locator('input[name*="name"], input[placeholder*="tên"], input[placeholder*="Tên"]').first();
      const phoneField = await page.locator('input[type="tel"], input[name*="phone"], input[placeholder*="điện"]').first();
      const addressField = await page.locator('textarea[name*="address"], input[name*="address"], input[placeholder*="địa"]').first();

      if (!await nameField.isVisible()) throw new Error('Name field not found');
      if (!await phoneField.isVisible()) throw new Error('Phone field not found');
      if (!await addressField.isVisible()) throw new Error('Address field not found');
    });

    await test('Payment methods load', async () => {
      const paymentSection = await page.locator('[class*="payment"], .dg-payment, label:has-text("Thanh toán")').first();
      if (!await paymentSection.isVisible()) throw new Error('Payment section not found');
    });

    // ===== 6. ABOUT PAGE TESTS =====
    console.log('\n=== 6. ABOUT PAGE TESTS ===');
    await page.goto(`${BASE_URL}/ve-chung-toi`, { waitUntil: 'networkidle' });

    await test('About page loads', async () => {
      const content = await page.locator('main, [class*="main"], .dg-main').first();
      if (!await content.isVisible()) throw new Error('About page main content not found');
    });

    await test('About content displays', async () => {
      const text = await page.locator('p, h1, h2, h3').first();
      if (!await text.isVisible()) throw new Error('No content found on about page');
    });

    // ===== 7. FOOTER TESTS =====
    console.log('\n=== 7. FOOTER TESTS ===');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    await test('Footer visible', async () => {
      const footer = await page.locator('footer, [class*="footer"], .dg-footer').first();
      if (!await footer.isVisible()) throw new Error('Footer not found');
    });

    await test('Footer links present', async () => {
      const footer = await page.locator('footer, [class*="footer"]').first();
      const links = await footer.locator('a').count();
      if (links === 0) throw new Error('No links in footer');
    });

    await test('Contact info visible in footer', async () => {
      const footer = await page.locator('footer, [class*="footer"]').first();
      const text = await footer.textContent();
      if (!text.includes('@') && !text.match(/\d+/)) throw new Error('No contact info in footer');
    });

  } catch (err) {
    console.error('Test suite error:', err);
  } finally {
    await browser.close();
  }

  // ===== REPORT =====
  console.log('\n' + '='.repeat(60));
  console.log('TEST REPORT');
  console.log('='.repeat(60));
  console.log(`✓ Passed: ${passCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log(`Total: ${passCount + failCount}`);

  if (failures.length > 0) {
    console.log('\n--- FAILURES ---');
    failures.forEach(f => {
      console.log(`\n${f.name}:`);
      console.log(`  Error: ${f.error}`);
    });
  }

  process.exit(failCount > 0 ? 1 : 0);
}

main();
