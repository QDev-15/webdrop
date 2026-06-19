import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const BOM = Buffer.from([0xEF, 0xBB, 0xBF])
function stripBomDir(dir) {
  let count = 0
  function walk(d) {
    for (const name of readdirSync(d)) {
      const full = join(d, name)
      if (statSync(full).isDirectory()) { walk(full); continue }
      if (!name.endsWith('.php')) continue
      const buf = readFileSync(full)
      if (buf.slice(0, 3).equals(BOM)) { writeFileSync(full, buf.slice(3)); count++ }
    }
  }
  walk(dir)
  if (count) console.log(`  Strip BOM: ${count} file(s) fixed`)
}

const root = dirname(fileURLToPath(import.meta.url))
const slug = "_output" // basename(root)
const deploy = join(dirname(root), `${slug}-deploy`)

console.log('=== tiem-banh-ngot — Build Script ===')
console.log('')

if (existsSync(deploy)) {
  console.log('Xóa thư mục deploy cũ...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`  ${label}...`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// ── Kiểm tra và cài đặt dependencies ──────────────────────────────────────────
console.log('[1/4] Kiểm tra dependencies...')
if (!existsSync(join(root, 'website', 'node_modules'))) {
  run('npm install', join(root, 'website'), 'Cài đặt dependencies website')
} else {
  console.log('  website/node_modules đã tồn tại.')
}
if (!existsSync(join(root, 'admin', 'node_modules'))) {
  run('npm install', join(root, 'admin'), 'Cài đặt dependencies admin')
} else {
  console.log('  admin/node_modules đã tồn tại.')
}

// ── Build React apps ──────────────────────────────────────────────────────────
console.log('')
console.log('[2/4] Build React apps...')
run('npm run build', join(root, 'website'), 'Build website')
run('npm run build', join(root, 'admin'), 'Build admin')
run('npm run build', join(root, 'admin'), 'Build admin')

// ── Tạo cấu trúc thư mục deploy ──────────────────────────────────────────────
console.log('')
console.log('[3/4] Tạo cấu trúc deploy...')
mkdirSync(join(deploy, 'admin'), { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'), { recursive: true })
mkdirSync(join(deploy, 'api', 'database'), { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads', '.gitkeep'), '')
mkdirSync(join(deploy, 'admin'), { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'), { recursive: true })
mkdirSync(join(deploy, 'api', 'database'), { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads', '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'database', '.gitkeep'), '')

// website/dist → deploy/ (bao gồm .htaccess + web.config từ website/public/)
console.log('  Copy website dist...')
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// admin/dist → deploy/admin/
console.log('  Copy admin dist...')
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// Inject APP_KEY và APP_URL vào config.php
console.log('  Inject APP_KEY + APP_URL vào config.php...')
const appKey = randomBytes(32).toString('hex')
const appUrl = process.env.APP_URL || 'http://localhost:8081'
const configSrc = readFileSync(join(root, 'api', 'config.php'), 'utf8')
const configOut = configSrc
  .replace(/define\('APP_KEY',\s*'[^']*'\)/, `define('APP_KEY', '${appKey}')`)
  .replace(/define\('APP_URL',\s*'[^']*'\)/, `define('APP_URL', '${appUrl}')`)
writeFileSync(join(deploy, 'api', 'config.php'), configOut)
console.log(`  APP_KEY đã được tạo: ${appKey.substring(0, 8)}...`)
console.log(`  APP_URL: ${appUrl}`)

// api/* → deploy/api/ (bỏ qua database, uploads, node_modules, config.php đã inject riêng)
console.log('  Copy API backend...')
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads', 'config.php'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(join(root, 'api', item), join(deploy, 'api', item), { recursive: true })
}
stripBomDir(join(deploy, 'api'))

// README.md → deploy/
if (existsSync(join(root, 'README.md'))) {
  cpSync(join(root, 'README.md'), join(deploy, 'README.md'))
  console.log('  Copy README.md...')
}

// ── Hoàn thành ────────────────────────────────────────────────────────────────
console.log('')
console.log('[4/4] Hoàn thành!')
console.log('')
console.log(`Thư mục deploy đã sẵn sàng: ../${slug}-deploy/`)
console.log(`Thư mục deploy đã sẵn sàng: ../${slug}-deploy/`)
console.log('')
console.log('Các bước tiếp theo:')
console.log(`  1. Upload toàn bộ nội dung trong ../${slug}-deploy/ lên public_html/ của hosting`)
console.log(`  2. Mở ../${slug}-deploy/api/config.php và sửa APP_URL thành URL thực của website`)
console.log(`  1. Upload toàn bộ nội dung trong ../${slug}-deploy/ lên public_html/ của hosting`)
console.log(`  2. Mở ../${slug}-deploy/api/config.php và sửa APP_URL thành URL thực của website`)
console.log('  3. Kiểm tra: https://yourdomain.com/api/health')
console.log('  4. Đăng nhập admin: https://yourdomain.com/admin')
console.log('     Xem tài khoản mặc định trong README.md')
console.log('')
