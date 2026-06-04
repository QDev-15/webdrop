/**
 * Build script — cong-ty-xay-dung
 * Chạy: node build.mjs
 * Output: deploy/
 */

import { execSync }                                              from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, writeFileSync } from 'fs'
import { join, dirname }                                         from 'path'
import { fileURLToPath }                                         from 'url'

const root   = dirname(fileURLToPath(import.meta.url))
const deploy = join(root, 'deploy')

console.log('=== Build: cong-ty-xay-dung ===\n')

// 1. Xóa deploy/ cũ
if (existsSync(deploy)) {
  console.log('[1/5] Xóa thư mục deploy/ cũ...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`[build] ${label}`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// 2. Build website (public site)
console.log('\n[2/5] Build website (React public site)...')
run('npm run build', join(root, 'website'), 'website → dist/')

// 3. Build admin
console.log('\n[3/5] Build admin panel...')
run('npm run build', join(root, 'admin'), 'admin → dist/')

// 4. Tạo cấu trúc deploy/
console.log('\n[4/5] Tổ chức thư mục deploy/...')

mkdirSync(join(deploy, 'admin'),                     { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'),            { recursive: true })
mkdirSync(join(deploy, 'api', 'database'),           { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads',  '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'database', '.gitkeep'), '')

// website/dist/ → deploy/ (bao gồm .htaccess và web.config)
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// admin/dist/ → deploy/admin/
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// api/ → deploy/api/ (bỏ qua database/, uploads/, .git)
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  const src  = join(root, 'api', item)
  const dest = join(deploy, 'api', item)
  cpSync(src, dest, { recursive: true })
}


// 5. Thông báo
console.log('\n[5/5] Hoàn thành!')
console.log('─'.repeat(50))
console.log('Deploy folder: ' + deploy)
console.log('\nCấu trúc deploy/:')
console.log('  index.html, assets/   ← Website public')
console.log('  .htaccess, web.config ← SPA routing (Apache + IIS)')
console.log('  admin/                ← Admin panel')
console.log('  api/                  ← PHP backend + SQLite')
console.log('\nHướng dẫn deploy:')
console.log('  1. Upload toàn bộ nội dung trong deploy/ lên public_html/')
console.log('  2. Chỉnh sửa api/config.php theo thông tin hosting')
console.log('  3. Truy cập website.vn/admin để đăng nhập')
console.log('  4. Tài khoản mặc định: admin@congtyxaydung.vn / Admin@2026')
console.log('─'.repeat(50))
