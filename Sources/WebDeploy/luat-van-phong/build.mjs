/**
 * Build script -- Văn Phòng Luật Sư
 * Chạy: node build.mjs
 * Output: _output-deploy/
 */

import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const root = dirname(fileURLToPath(import.meta.url))
let isTest = false
const productDir = join(root, '..', '..', 'products', 'basic', basename(root), 'deploy')
const test = join(dirname(root), `_output-deploy`)

let deploy = test;
if (isTest == false) {
    deploy = productDir
}

console.log('Luat Van Phong -- Build bat dau...\n')

// Strip BOM khoi PHP files trong deploy/api/
function stripBomPhp(dir) {
  if (!existsSync(dir)) return
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, item.name)
    if (item.isDirectory()) { stripBomPhp(full); continue }
    if (!item.name.endsWith('.php')) continue
    const buf = readFileSync(full)
    if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
      writeFileSync(full, buf.subarray(3))
      console.log(`  Strip BOM: ${item.name}`)
    }
  }
}

// Clean deploy
if (existsSync(deploy)) {
  console.log('  Xoa thu muc deploy cu...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`  ${label}...`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// Install deps if needed
if (!existsSync(join(root, 'website', 'node_modules'))) {
  run('npm install', join(root, 'website'), 'Cai dat dependencies website')
}
if (!existsSync(join(root, 'admin', 'node_modules'))) {
  run('npm install', join(root, 'admin'), 'Cai dat dependencies admin')
}

// Build
run('npm run build', join(root, 'website'), 'Build website')
run('npm run build', join(root, 'admin'), 'Build admin')

// Create directories
console.log('  Tao cau truc deploy...')
mkdirSync(join(deploy, 'admin'), { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'), { recursive: true })
mkdirSync(join(deploy, 'api', 'database'), { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads', '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'database', '.gitkeep'), '')

// Copy website/dist -> deploy/
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// Copy admin/dist -> deploy/admin/
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// Inject APP_KEY va APP_URL vao config.php
const appKey = randomBytes(32).toString('hex')
const appUrl = process.env.APP_URL || 'http://localhost:8081'
const configSrc = readFileSync(join(root, 'api', 'config.php'), 'utf8')
const configOut = configSrc
  .replace(/define\('APP_KEY',\s*'[^']*'\)/, `define('APP_KEY', '${appKey}')`)
  .replace(/define\('APP_URL',\s*'[^']*'\)/, `define('APP_URL', '${appUrl}')`)
writeFileSync(join(deploy, 'api', 'config.php'), configOut)
console.log(`  APP_KEY: ${appKey.substring(0, 8)}...`)
console.log(`  APP_URL: ${appUrl}`)

// Copy api -> deploy/api/ (skip database, uploads, node_modules, config.php da inject rieng)
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads', 'config.php'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(join(root, 'api', item), join(deploy, 'api', item), { recursive: true })
}

// Strip BOM khoi PHP files sau khi copy
stripBomPhp(join(deploy, 'api'))

// favicon.ico -> deploy/
if (existsSync(join(root, 'favicon.ico'))) {
  cpSync(join(root, 'favicon.ico'), join(deploy, 'favicon.ico'))
  console.log('  Copy favicon.ico...')
}

// README.md -> deploy/
if (existsSync(join(root, 'README.md'))) {
  cpSync(join(root, 'README.md'), join(deploy, 'README.md'))
  console.log('  Copy README.md...')
}

console.log('\nBuild hoan tat!')
console.log('Output: ' + deploy)
console.log('\nHuong dan deploy:')
console.log('  1. Upload toan bo noi dung trong deploy/ len public_html/')
console.log('  2. Chinh sua deploy/api/config.php theo thong tin hosting')
console.log('  3. Truy cap website.vn/admin de dang nhap')
console.log('  4. Tai khoan mac dinh: sysadmin@admin.com / 123456')
