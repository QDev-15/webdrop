import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

function stripBomPhpFiles(dir) {
  if (!existsSync(dir)) return
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) { stripBomPhpFiles(full); continue }
    if (!name.endsWith('.php')) continue
    const buf = readFileSync(full)
    if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
      writeFileSync(full, buf.subarray(3))
      console.log('  BOM stripped:', name)
    }
  }
}

const root = dirname(fileURLToPath(import.meta.url))
let isTest = true
const productDir = join(root, '..', '..', 'products', 'basic', basename(root), 'deploy')
const test = join(dirname(root), `_output-deploy`)

let deploy = test;
if (isTest == false) {
    deploy = productDir
}

console.log('=== Build VietFinance Website ===')

if (existsSync(deploy)) {
  console.log('  Xoa thu muc deploy cu...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`  ${label}...`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// Kiem tra va cai dat dependencies
if (!existsSync(join(root, 'website', 'node_modules'))) {
  run('npm install', join(root, 'website'), 'Cai dat dependencies website')
}
if (!existsSync(join(root, 'admin', 'node_modules'))) {
  run('npm install', join(root, 'admin'), 'Cai dat dependencies admin')
}

// Build
run('npm run build', join(root, 'website'), 'Build website')
run('npm run build', join(root, 'admin'), 'Build admin')

// Tao cau truc thu muc deploy
console.log('  Tao cau truc deploy...')
mkdirSync(join(deploy, 'admin'), { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'), { recursive: true })
mkdirSync(join(deploy, 'api', 'database'), { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads', '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'database', '.gitkeep'), '')

// Copy website dist → deploy root
console.log('  Copy website dist...')
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })
// Force-write .htaccess — Apache có thể lock file này khi đang serve, cpSync sẽ skip
const htaccessSrc = join(root, 'website', 'dist', '.htaccess')
if (existsSync(htaccessSrc)) {
  writeFileSync(join(deploy, '.htaccess'), readFileSync(htaccessSrc))
  console.log('  Force-write .htaccess...')
}

// Copy admin dist → deploy/admin
console.log('  Copy admin dist...')
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// Inject APP_KEY ngau nhien vao config.php
console.log('  Tao config.php voi APP_KEY ngau nhien...')
const appKey = randomBytes(32).toString('hex')
const appUrl = process.env.APP_URL || 'http://localhost:8081'
const configContent = readFileSync(join(root, 'api', 'config.php'), 'utf8')
  .replace("'change-this-to-random-32-chars-string'", `'${appKey}'`)
  .replace(/define\('APP_URL',\s*'[^']*'\)/, `define('APP_URL', '${appUrl}')`)
writeFileSync(join(deploy, 'api', 'config.php'), configContent)
console.log(`  APP_URL: ${appUrl}`)

// Copy api/* → deploy/api (bo qua database, uploads, config.php da inject rieng)
console.log('  Copy PHP backend...')
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads', 'config.php'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(join(root, 'api', item), join(deploy, 'api', item), { recursive: true })
}

// Strip BOM khoi tat ca PHP files trong deploy/api (tranh 500 error)
console.log('  Strip BOM khoi PHP files...')
stripBomPhpFiles(join(deploy, 'api'))

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
console.log('=== BUILD THANH CONG! ===')
console.log(`  Thu muc deploy: ${deploy}`)
console.log('  APP_KEY da duoc tao tu dong.')
console.log('')
console.log('  HUONG DAN DEPLOY:')
console.log('  1. Upload toan bo thu muc deploy/ len public_html/')
console.log('  2. Mo api/config.php, sua APP_URL thanh URL that cua website')
console.log('  3. Truy cap /api/health de kiem tra')

// huong-dan-cai-dat.html → deploy/
if (existsSync(join(root, 'huong-dan-cai-dat.html'))) {
  cpSync(join(root, 'huong-dan-cai-dat.html'), join(deploy, 'huong-dan-cai-dat.html'))
  console.log('  Copy huong-dan-cai-dat.html...')
}

console.log('  4. Dang nhap admin: /admin | sysadmin@admin.com / 123456')
