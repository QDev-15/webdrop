import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8098';
const errors = [];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
});
page.on('pageerror', err => errors.push(`[pageerror] ${err.message}`));

await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });

// Login
await page.fill('input[type="email"]', 'sysadmin@admin.com');
await page.fill('input[type="password"]', '123456');
await page.click('button[type="submit"]');
await page.waitForURL(`${BASE}/admin/`, { timeout: 10000 }).catch(() => {});
await page.waitForTimeout(800);

await page.screenshot({ path: 'C:\\Users\\QuynhNH\\AppData\\Local\\Temp\\claude\\d--Data-Projects-AIProject-webdrop\\fa2b4281-9ea0-41de-b98f-4bde48521ee3\\scratchpad\\dashboard-desktop.png', fullPage: true });

// Check navbar exists, no sidebar
const hasSidebar = await page.$('.admin-sidebar');
const hasNavbar = await page.$('.bp-navbar');
console.log('hasSidebar:', !!hasSidebar, 'hasNavbar:', !!hasNavbar);

// Click through nav links
const navTargets = [
  { sel: 'a[href="/admin/products"]', label: 'products' },
  { sel: 'a[href="/admin/customers"]', label: 'customers' },
  { sel: 'a[href="/admin/stock-imports"]', label: 'stock-imports' },
  { sel: 'a[href="/admin/stocktake"]', label: 'stocktake' },
  { sel: 'a[href="/admin/reports"]', label: 'reports' },
];

for (const t of navTargets) {
  await page.click(t.sel);
  await page.waitForTimeout(500);
  const url = page.url();
  console.log(`clicked ${t.label} -> ${url}`);
}

// Test "more" dropdown
await page.hover('.admin-navbar-more-btn');
await page.waitForTimeout(300);
await page.click('.admin-navbar-more-menu a[href="/admin/settings"]');
await page.waitForTimeout(500);
console.log('after settings click ->', page.url());

// Go to customers page, check tier badges
await page.click('a[href="/admin/customers"]');
await page.waitForTimeout(600);
const badgeCount = await page.$$eval('.tier-badge', els => els.length);
const badgeColors = await page.$$eval('.tier-badge', els => els.slice(0, 5).map(e => ({
  cls: e.className,
  bg: getComputedStyle(e).backgroundColor,
  text: e.textContent,
})));
console.log('tier badges found:', badgeCount);
console.log(JSON.stringify(badgeColors, null, 2));
await page.screenshot({ path: 'C:\\Users\\QuynhNH\\AppData\\Local\\Temp\\claude\\d--Data-Projects-AIProject-webdrop\\fa2b4281-9ea0-41de-b98f-4bde48521ee3\\scratchpad\\customers-desktop.png', fullPage: true });

// Check Products page Save button color (btn-accent)
await page.click('a[href="/admin/products"]');
await page.waitForTimeout(600);
const btnColor = await page.$eval('.btn-accent', el => getComputedStyle(el).backgroundColor).catch(() => 'NOT FOUND');
console.log('btn-accent bg color:', btnColor);

// Mobile responsive check
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/admin/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const toggleVisible = await page.$eval('.admin-navbar-toggle', el => getComputedStyle(el).display).catch(() => 'NOT FOUND');
console.log('mobile toggle display:', toggleVisible);
const menuVisibleBefore = await page.$eval('.admin-navbar-menu', el => getComputedStyle(el).display).catch(() => 'NOT FOUND');
console.log('mobile menu display before click:', menuVisibleBefore);
await page.screenshot({ path: 'C:\\Users\\QuynhNH\\AppData\\Local\\Temp\\claude\\d--Data-Projects-AIProject-webdrop\\fa2b4281-9ea0-41de-b98f-4bde48521ee3\\scratchpad\\dashboard-mobile-closed.png' });

await page.click('.admin-navbar-toggle');
await page.waitForTimeout(400);
const menuVisibleAfter = await page.$eval('.admin-navbar-menu', el => getComputedStyle(el).display).catch(() => 'NOT FOUND');
console.log('mobile menu display after click:', menuVisibleAfter);
await page.screenshot({ path: 'C:\\Users\\QuynhNH\\AppData\\Local\\Temp\\claude\\d--Data-Projects-AIProject-webdrop\\fa2b4281-9ea0-41de-b98f-4bde48521ee3\\scratchpad\\dashboard-mobile-open.png' });

// click a mobile nav link
await page.click('.admin-navbar-menu a[href="/admin/customers"]');
await page.waitForTimeout(500);
console.log('mobile nav click -> url:', page.url());
const menuAfterNav = await page.$eval('.admin-navbar-menu', el => getComputedStyle(el).display).catch(() => 'NOT FOUND');
console.log('mobile menu display after nav click (should auto-close):', menuAfterNav);

console.log('=== CONSOLE/PAGE ERRORS ===');
console.log(errors.length === 0 ? 'NONE' : errors.join('\n'));

await browser.close();
