import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const root   = dirname(fileURLToPath(import.meta.url))
const deploy = join(root, 'deploy')

console.log('=== Build Cà Phê Thời Gian ===\n')

if (existsSync(deploy)) {
  console.log('Dọn dẹp thư mục deploy cũ...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`  ${label}...`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// ⚠️  PHẢI install trước — nếu không có node_modules, 'tsc' không tìm thấy
if (!existsSync(join(root, 'website', 'node_modules'))) {
  console.log('\n[Website] node_modules chưa có, đang cài...')
  run('npm install', join(root, 'website'), 'npm install website')
}
if (!existsSync(join(root, 'admin', 'node_modules'))) {
  console.log('\n[Admin] node_modules chưa có, đang cài...')
  run('npm install', join(root, 'admin'), 'npm install admin')
}

console.log('\n[Website] Đang build...')
run('npm run build', join(root, 'website'), 'Build website SPA')

console.log('\n[Admin] Đang build...')
run('npm run build', join(root, 'admin'), 'Build admin SPA')

console.log('\n[Deploy] Assembling...')

// Tạo cấu trúc deploy
mkdirSync(join(deploy, 'admin'),                     { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'),            { recursive: true })
mkdirSync(join(deploy, 'api', 'database'),           { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads',  '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'database', '.gitkeep'), '')

// website/dist → deploy/ (bao gồm .htaccess + web.config từ website/public/)
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })
console.log('  website/dist → deploy/')

// admin/dist → deploy/admin/
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })
console.log('  admin/dist → deploy/admin/')

// Inject APP_KEY ngẫu nhiên vào config.php
const appKey = randomBytes(32).toString('hex')
const appUrl = process.env.APP_URL || 'http://localhost:8081'
const configContent = readFileSync(join(root, 'api', 'config.php'), 'utf8')
  .replace("'change-this-to-random-32-chars-string'", `'${appKey}'`)
  .replace(/define\('APP_URL',\s*'[^']*'\)/, `define('APP_URL', '${appUrl}')`)
writeFileSync(join(deploy, 'api', 'config.php'), configContent)
console.log(`  api/config.php → deploy/api/ (APP_KEY injected: ${appKey.slice(0, 16)}...)`)
console.log(`  APP_URL: ${appUrl}`)

// api/* → deploy/api/ (bỏ qua database/, uploads/, node_modules, config.php)
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads', 'config.php'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(join(root, 'api', item), join(deploy, 'api', item), { recursive: true })
}
console.log('  api/ → deploy/api/')

console.log('\n=== Build hoàn thành! ===')
console.log(`Deploy folder: ${deploy}`)
console.log('\nHướng dẫn tiếp theo:')
console.log('  1. Upload toàn bộ nội dung trong deploy/ lên public_html/')
console.log('  2. Mở deploy/api/config.php và sửa APP_URL thành URL thực của hosting')
console.log('  3. Truy cập https://yoursite.com/api/health để kiểm tra')
console.log('  4. Đăng nhập admin: https://yoursite.com/admin')
console.log('     Email: sysadmin@admin.com | Mật khẩu: 123456')
