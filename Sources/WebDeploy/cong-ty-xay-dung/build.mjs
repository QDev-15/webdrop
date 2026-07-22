import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const root = dirname(fileURLToPath(import.meta.url))
let isTest = true
const productDir = join(root, '..', '..', 'products', 'basic', basename(root), 'deploy')
const test = join(dirname(root), `_output-deploy`)

let deploy = test;
if (isTest == false) {
    deploy = productDir
}

console.log('=== Build: Công Ty Xây Dựng ===')
console.log('')

if (existsSync(deploy)) {
  console.log('Xóa thư mục deploy cũ...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`  ${label}...`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// Install dependencies nếu chưa có
if (!existsSync(join(root, 'website', 'node_modules'))) {
  console.log('Cài đặt dependencies website...')
  run('npm install', join(root, 'website'), 'npm install website')
}
if (!existsSync(join(root, 'admin', 'node_modules'))) {
  console.log('Cài đặt dependencies admin...')
  run('npm install', join(root, 'admin'), 'npm install admin')
}

console.log('\nBuild React website...')
run('npm run build', join(root, 'website'), 'Build website')

console.log('\nBuild React admin...')
run('npm run build', join(root, 'admin'), 'Build admin')

console.log('\nTạo cấu trúc thư mục deploy...')
mkdirSync(join(deploy, 'admin'), { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'), { recursive: true })
mkdirSync(join(deploy, 'api', 'database'), { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads', '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'uploads', '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'database', '.gitkeep'), '')

// website/dist → deploy/ (bao gồm .htaccess + web.config từ website/public/)
console.log('Copy website dist...')
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// admin/dist → deploy/admin/
console.log('Copy admin dist...')
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// Inject APP_KEY ngẫu nhiên vào config.php
console.log('Inject APP_KEY vào config.php...')
const appKey = randomBytes(32).toString('hex')
const appUrl = process.env.APP_URL || 'http://localhost:8081'
const configContent = readFileSync(join(root, 'api', 'config.php'), 'utf8')
  .replace("'change-this-to-random-32-chars-string'", `'${appKey}'`)
  .replace(/define\('APP_URL',\s*'[^']*'\)/, `define('APP_URL', '${appUrl}')`)
writeFileSync(join(deploy, 'api', 'config.php'), configContent)
console.log(`  APP_URL: ${appUrl}`)

// api/* → deploy/api/ (bỏ qua database/, uploads/, node_modules, config.php đã inject riêng)
console.log('Copy API files...')
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads', 'config.php'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(join(root, 'api', item), join(deploy, 'api', item), { recursive: true })
}

// favicon.ico → deploy/
if (existsSync(join(root, 'favicon.ico'))) {
  cpSync(join(root, 'favicon.ico'), join(deploy, 'favicon.ico'))
  console.log('  Copy favicon.ico...')
}
// README.md → deploy/
if (existsSync(join(root, 'README.md'))) {
  cpSync(join(root, 'README.md'), join(deploy, 'README.md'))
  console.log('  Copy README.md...')
}

console.log('')
console.log('=== BUILD THÀNH CÔNG! ===')
console.log(`Thư mục deploy: ${deploy}`)
console.log('')
console.log('Các bước tiếp theo:')
console.log(`1. Upload toàn bộ nội dung trong ${deploy}/ lên public_html/`)
console.log(`2. Mở ${deploy}/api/config.php và sửa APP_URL thành URL thực của website`)
console.log(`1. Upload toàn bộ nội dung trong ${deploy}/ lên public_html/`)
console.log(`2. Mở ${deploy}/api/config.php và sửa APP_URL thành URL thực của website`)
console.log('3. Truy cập https://yoursite.com/api/health để kiểm tra')
console.log('4. Đăng nhập admin: /admin  |  sysadmin@admin.com  |  123456')
