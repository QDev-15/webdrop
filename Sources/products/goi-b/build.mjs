import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = dirname(fileURLToPath(import.meta.url))
const deploy = join(root, 'deploy')

console.log('\n=== GOI B — BUILD & PACKAGE ===\n')

// ── Xoá deploy cũ ──────────────────────────────────────────────────────────
if (existsSync(deploy)) {
  console.log('Xoa deploy cu...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit', shell: true })

// ── Build website (public site) ────────────────────────────────────────────
console.log('[1/2] Build public site...\n')
run('npm run build', join(root, 'website'))

// ── Build frontend (admin panel) ───────────────────────────────────────────
console.log('\n[2/2] Build admin panel...\n')
run('npm run build', join(root, 'frontend'))

// ── Assemble deploy folder ─────────────────────────────────────────────────
console.log('\nAssemble deploy folder...')

mkdirSync(join(deploy, 'admin'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'), { recursive: true })
mkdirSync(join(deploy, 'api', 'database'), { recursive: true })

// website/dist/* → deploy/ (root)
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// frontend/dist/* → deploy/admin/
cpSync(join(root, 'frontend', 'dist'), join(deploy, 'admin'), { recursive: true })

// backend/* → deploy/api/ (bỏ qua node_modules)
const skip = new Set(['node_modules', '.git'])
for (const item of readdirSync(join(root, 'backend'))) {
  if (skip.has(item)) continue
  cpSync(
    join(root, 'backend', item),
    join(deploy, 'api', item),
    { recursive: true }
  )
}

// ── Done ───────────────────────────────────────────────────────────────────
console.log('\n=== DONE ===')
console.log('  deploy/  — upload noi dung nay len public_html')
console.log('\nTRUOC KHI UPLOAD:')
console.log('  1. Mo deploy/api/config.php — dien APP_URL, APP_KEY')
console.log('  2. Chay schema SQL lan dau: deploy/api/schema.sql')
console.log('  3. Upload toan bo noi dung deploy/ len public_html\n')
