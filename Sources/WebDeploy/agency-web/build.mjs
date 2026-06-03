import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root   = dirname(fileURLToPath(import.meta.url))
const deploy = join(root, 'deploy')

console.log('\n=== AGENCY WEB — BUILD & PACKAGE ===\n')

// ── Xoá deploy cũ ────────────────────────────────────────────────────────────
if (existsSync(deploy)) {
  console.log('Xoa deploy cu...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit', shell: true })

// ── Build website (public site) ───────────────────────────────────────────────
console.log('[1/2] Build public site (website/)...\n')
run('npm run build', join(root, 'website'))

// ── Build admin panel ─────────────────────────────────────────────────────────
console.log('\n[2/2] Build admin panel (admin/)...\n')
run('npm run build', join(root, 'admin'))

// ── Assemble deploy folder ────────────────────────────────────────────────────
console.log('\nAssemble deploy/ ...')

mkdirSync(join(deploy, 'admin'),              { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'),     { recursive: true })
mkdirSync(join(deploy, 'api', 'database'),    { recursive: true })

// website/dist/* → deploy/  (root public site)
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// admin/dist/* → deploy/admin/
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// api/* → deploy/api/  (skip node_modules, .git, database/, uploads/)
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(
    join(root, 'api', item),
    join(deploy, 'api', item),
    { recursive: true }
  )
}

console.log('\n=== BUILD COMPLETE ===')
console.log('  Output: deploy/  — upload noi dung nay len public_html')
console.log('\nTRUOC KHI UPLOAD:')
console.log('  1. Mo deploy/api/config.php')
console.log('     → Dien APP_URL (domain that) va APP_KEY (chuoi ngau nhien)')
console.log('  2. Upload TOAN BO noi dung deploy/ len public_html/')
console.log('  3. Truy cap domain — DB tu dong tao va seed du lieu mac dinh')
console.log('  4. Admin: /admin  |  Login: admin@company.vn / Admin@2026\n')
