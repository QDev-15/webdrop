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

console.log('=== Forum Cong Dong — Build ===\n')

if (existsSync(deploy)) {
  console.log('Xoa thu muc deploy cu...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`  ${label}...`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// Check node_modules truoc khi build
if (!existsSync(join(root, 'website', 'node_modules'))) {
  console.log('\n[Website] Cai dat dependencies...')
  run('npm install', join(root, 'website'), 'npm install website')
}
if (!existsSync(join(root, 'admin', 'node_modules'))) {
  console.log('\n[Admin] Cai dat dependencies...')
  run('npm install', join(root, 'admin'), 'npm install admin')
}

console.log('\n[1/2] Build website...')
run('npm run build', join(root, 'website'), 'Build website')

console.log('\n[2/2] Build admin...')
run('npm run build', join(root, 'admin'), 'Build admin')

console.log('\nTao cau truc deploy...')
mkdirSync(join(deploy, 'admin'), { recursive: true })
mkdirSync(join(deploy, 'admin'), { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'), { recursive: true })
mkdirSync(join(deploy, 'api', 'database'), { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads', '.gitkeep'), '')
mkdirSync(join(deploy, 'api', 'uploads'), { recursive: true })
mkdirSync(join(deploy, 'api', 'database'), { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads', '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'database', '.gitkeep'), '')

// website/dist -> deploy/ (bao gom .htaccess + web.config tu website/public/)
console.log('Copy website dist...')
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// admin/dist -> deploy/admin/
console.log('Copy admin dist...')
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// Inject APP_KEY ngau nhien vao config.php
console.log('Tao config.php voi APP_KEY ngau nhien...')
const appKey = randomBytes(32).toString('hex')
const appUrl = process.env.APP_URL || 'http://localhost:8081'
const configContent = readFileSync(join(root, 'api', 'config.php'), 'utf8')
  .replace("'change-this-to-random-32-chars-string'", `'${appKey}'`)
  .replace(/define\('APP_URL',\s*'[^']*'\)/, `define('APP_URL', '${appUrl}')`)
writeFileSync(join(deploy, 'api', 'config.php'), configContent)
console.log(`  APP_KEY: ${appKey.slice(0, 8)}...${appKey.slice(-8)} (64 chars)`)
console.log(`  APP_URL: ${appUrl}`)

// api/* -> deploy/api/ (bo qua database/, uploads/, node_modules, config.php)
console.log('Copy API PHP...')
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

console.log('\n=== Build hoan tat! ===')
console.log(`Thu muc deploy: ${deploy}`)
console.log('\nTiep theo:')
console.log('  1. Upload tat ca file trong deploy/ len public_html/')
console.log('  2. Mo api/config.php va sua APP_URL thanh URL thuc cua website')
console.log('  3. Kiem tra: https://your-domain.com/api/health')
console.log('  4. Dang nhap admin: https://your-domain.com/admin')
console.log('     Xem README.md de biet thong tin dang nhap mac dinh.')
