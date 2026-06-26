/**
 * build-demo.js — webdrop.store
 *
 * Tạo bản DEMO (có guard) từ bản GỐC (clean).
 * Bản gốc Sources/templates/web/ KHÔNG bị thay đổi.
 *
 * Cấu trúc hỗ trợ:
 *   Sources/templates/web/[Category]/[slug]/   (nested)
 *   Sources/templates/web/[slug]/              (flat)
 *
 * Output: dist/demo/[Category]/[slug]/  hoặc  dist/demo/[slug]/
 *
 * Cách dùng:
 *   node build-demo.js              → build tất cả
 *   node build-demo.js Restaurants  → build cả category
 *   node build-demo.js Restaurants/nha-hang-cao-cap  → build 1 template
 */

const fs   = require('fs');
const path = require('path');

const SRC_DIR  = path.resolve(__dirname, '../web');
const DIST_DIR = path.resolve(__dirname, '../../../dist/demo');
const GUARD_JS = path.resolve(__dirname, 'demo-guard.js');
const GUARD_COMMENT = '<!-- wd-guard -->';
const GUARD_SCRIPT  = '<script src="assets/js/demo-guard.js"></script>';

// ─── Helpers ──────────────────────────────────────────────────────────────

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function injectGuardIntoHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes(GUARD_COMMENT)) return; // đã inject rồi
  html = html.replace(
    '</body>',
    `  ${GUARD_COMMENT}\n  ${GUARD_SCRIPT}\n</body>`
  );
  fs.writeFileSync(filePath, html, 'utf8');
}

function injectAll(dir) {
  let count = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) count += injectAll(p);
    else if (e.name.endsWith('.html')) { injectGuardIntoHtml(p); count++; }
  }
  return count;
}

function copyGuardJs(templateDistDir) {
  const jsDir = path.join(templateDistDir, 'assets', 'js');
  fs.mkdirSync(jsDir, { recursive: true });
  fs.copyFileSync(GUARD_JS, path.join(jsDir, 'demo-guard.js'));
}

// Tìm tất cả thư mục template (chứa index.html trực tiếp)
function findTemplates(dir, relBase) {
  const templates = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const fullPath = path.join(dir, e.name);
    const relPath  = relBase ? `${relBase}/${e.name}` : e.name;
    const hasIndex = fs.existsSync(path.join(fullPath, 'index.html'));
    if (hasIndex) {
      templates.push({ src: fullPath, rel: relPath });
    } else {
      // Đây là category folder → đệ quy xuống
      templates.push(...findTemplates(fullPath, relPath));
    }
  }
  return templates;
}

function buildTemplate({ src, rel }) {
  const dest = path.join(DIST_DIR, rel);

  // 1. Copy bản gốc → dist/demo/[rel]
  copyDir(src, dest);

  // 2. Copy demo-guard.js vào assets/js/
  copyGuardJs(dest);

  // 3. Inject guard vào tất cả .html trong bản copy
  const count = injectAll(dest);

  console.log(`  ✅  ${rel.padEnd(40)} (${count} pages)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────

const arg = process.argv[2]; // optional: filter

console.log('\n🔨  webdrop.store — Demo Build\n');
console.log(`    Source : Sources/templates/web/`);
console.log(`    Output : dist/demo/\n`);

// Tìm tất cả templates
let templates = findTemplates(SRC_DIR, '');

// Filter nếu có argument
if (arg) {
  templates = templates.filter(t => t.rel.startsWith(arg));
  if (templates.length === 0) {
    console.log(`  ❌  Không tìm thấy template nào khớp với: "${arg}"\n`);
    process.exit(1);
  }
}

// Build từng template
templates.forEach(buildTemplate);

console.log(`\n  ✨  Xong! Đã build ${templates.length} templates → dist/demo/`);
console.log('\n  Deploy:\n    netlify deploy --dir=dist/demo --prod\n');
