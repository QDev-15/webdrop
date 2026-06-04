/**
 * Build script — Văn Phòng Luật Sư
 * Chạy: node build.mjs
 * Output: deploy/
 */

import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root   = dirname(fileURLToPath(import.meta.url))
const deploy = join(root, 'deploy')

console.log('🔨 Luật Văn Phòng — Build bắt đầu...\n')

// Clean deploy
if (existsSync(deploy)) {
  console.log('  Xóa thư mục deploy cũ...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`  ${label}...`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// Install deps if needed
if (!existsSync(join(root, 'website', 'node_modules'))) {
  run('npm install', join(root, 'website'), 'Cài đặt dependencies website')
}
if (!existsSync(join(root, 'admin', 'node_modules'))) {
  run('npm install', join(root, 'admin'), 'Cài đặt dependencies admin')
}

// Build
run('npm run build', join(root, 'website'), 'Build website')
run('npm run build', join(root, 'admin'),   'Build admin')

// Create directories
console.log('  Tạo cấu trúc deploy...')
mkdirSync(join(deploy, 'admin'),                 { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'),        { recursive: true })
mkdirSync(join(deploy, 'api', 'database'),       { recursive: true })

// Copy website/dist → deploy/ (includes .htaccess, web.config from public/)
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// Copy admin/dist → deploy/admin/
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// Copy api → deploy/api/ (skip database, uploads, node_modules)
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(join(root, 'api', item), join(deploy, 'api', item), { recursive: true })
}

console.log('\n✅ Build hoàn tất!')
console.log('📁 Output: ' + deploy)
console.log('\nHướng dẫn deploy:')
console.log('  1. Upload toàn bộ nội dung trong deploy/ lên public_html/')
console.log('  2. Chỉnh sửa deploy/api/config.php theo thông tin hosting')
console.log('  3. Truy cập website.vn/admin để đăng nhập')
console.log('  4. Tài khoản mặc định: admin@luatvanphong.vn / Admin@123')
