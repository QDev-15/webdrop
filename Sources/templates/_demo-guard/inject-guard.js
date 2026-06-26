/**
 * inject-guard.js
 * Chạy: node inject-guard.js
 * Tự động thêm demo-guard.js vào tất cả HTML file trong Sources/templates/web/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEMPLATES_DIR = path.resolve(__dirname, '../web');
const GUARD_TAG = '<script src="/assets/js/demo-guard.js"></script>';
const GUARD_MARKER = '<!-- wd-guard -->';

function getAllHtmlFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function injectGuard(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Bỏ qua nếu đã inject rồi
  if (content.includes(GUARD_MARKER)) {
    console.log(`  ⏭ Skip (đã có):  ${path.relative(TEMPLATES_DIR, filePath)}`);
    return;
  }

  // Inject trước </body>
  const injected = `  ${GUARD_MARKER}\n  ${GUARD_TAG}\n`;
  if (content.includes('</body>')) {
    content = content.replace('</body>', injected + '</body>');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Injected:      ${path.relative(TEMPLATES_DIR, filePath)}`);
  } else {
    console.log(`  ⚠️  No </body>:   ${path.relative(TEMPLATES_DIR, filePath)}`);
  }
}

// ─── Main ───
console.log('\n🔒 webdrop.store — Demo Guard Injector\n');

const files = getAllHtmlFiles(TEMPLATES_DIR);
console.log(`Tìm thấy ${files.length} HTML files:\n`);

files.forEach(injectGuard);

console.log(`\n✅ Done! Đã xử lý ${files.length} files.`);
console.log('\nNhớ copy demo-guard.js vào mỗi thư mục /assets/js/ của template trước khi deploy.\n');
