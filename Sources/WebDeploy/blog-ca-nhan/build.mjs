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

console.log('Bat dau build Blog Ca Nhan...')

if (existsSync(deploy)) {
  rmSync(deploy, { recursive: true, force: true })
  console.log('  Da xoa thu muc deploy cu')
}

const run = (cmd, cwd, label) => {
  console.log(`  ${label}...`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// ⚠️ PHẢI install truoc — neu khong co node_modules, 'tsc' khong tim thay
if (!existsSync(join(root, 'website', 'node_modules'))) {
  run('npm install', join(root, 'website'), 'Cai dat dependencies website')
}
if (!existsSync(join(root, 'admin', 'node_modules'))) {
  run('npm install', join(root, 'admin'), 'Cai dat dependencies admin')
}

run('npm run build', join(root, 'website'), 'Build website')
run('npm run build', join(root, 'admin'), 'Build admin')

// Tao cau truc deploy
mkdirSync(join(deploy, 'admin'), { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'), { recursive: true })
mkdirSync(join(deploy, 'api', 'database'), { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads', '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'database', '.gitkeep'), '')

// website/dist → deploy/ (bao gom .htaccess + web.config tu website/public/)
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })
console.log('  Da copy website build → deploy/')

// admin/dist → deploy/admin/
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })
console.log('  Da copy admin build → deploy/admin/')

// Inject APP_KEY ngau nhien vao config.php
const appKey = randomBytes(32).toString('hex')
const appUrl = process.env.APP_URL || 'http://localhost:8081'
const configContent = readFileSync(join(root, 'api', 'config.php'), 'utf8')
  .replace("'change-this-to-random-32-chars-string'", `'${appKey}'`)
  .replace(/define\('APP_URL',\s*'[^']*'\)/, `define('APP_URL', '${appUrl}')`)
writeFileSync(join(deploy, 'api', 'config.php'), configContent)
console.log(`  Da tao APP_KEY: ${appKey.slice(0, 16)}...`)
console.log(`  APP_URL: ${appUrl}`)

// api/* → deploy/api/ (bo qua database/, uploads/, config.php da inject rieng)
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads', 'config.php'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(join(root, 'api', item), join(deploy, 'api', item), { recursive: true })
}

// Strip BOM khoi PHP files trong deploy/api/ (BOM lam hong JSON response)
function stripBomFromPhpFiles(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, item.name)
    if (item.isDirectory()) {
      stripBomFromPhpFiles(fullPath)
    } else if (item.name.endsWith('.php')) {
      const buf = readFileSync(fullPath)
      if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        writeFileSync(fullPath, buf.subarray(3))
        console.log(`  BOM stripped: ${item.name}`)
      }
    }
  }
}
stripBomFromPhpFiles(join(deploy, 'api'))
console.log('  BOM check PHP files: done')

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
console.log('  Da copy API PHP → deploy/api/')

console.log('\nBuild thanh cong!')
console.log(`Thu muc deploy: ${deploy}`)
console.log('\nCac buoc tiep theo:')
console.log('  1. Upload toan bo noi dung trong deploy/ len public_html/')
console.log('  2. Sua api/config.php: APP_URL = URL that cua website')
console.log('  3. Kiem tra: https://your-domain.com/api/health')
console.log('  4. Dang nhap admin: https://your-domain.com/admin')
console.log('     Email: sysadmin@admin.com | Mat khau: 123456')
