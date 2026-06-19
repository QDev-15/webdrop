import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname, basename } from 'path'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const root = dirname(fileURLToPath(import.meta.url))
const slug = "_output" // basename(root)
const deploy = join(dirname(root), `${slug}-deploy`)

console.log('=== Agency Web Build ===\n')

if (existsSync(deploy)) {
  console.log('Xoa thu muc deploy cu...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`  ${label}...`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// ⚠️  PHAI install truoc — neu khong co node_modules, 'tsc' se khong tim thay
if (!existsSync(join(root, 'website', 'node_modules'))) {
  console.log('\n[1/4] Cai dat dependencies website...')
  run('npm install', join(root, 'website'), 'npm install website')
} else {
  console.log('[1/4] node_modules website san sang')
}

if (!existsSync(join(root, 'admin', 'node_modules'))) {
  console.log('[2/4] Cai dat dependencies admin...')
  run('npm install', join(root, 'admin'), 'npm install admin')
} else {
  console.log('[2/4] node_modules admin san sang')
}

console.log('\n[3/4] Build website...')
run('npm run build', join(root, 'website'), 'Build website SPA')

console.log('\n[4/4] Build admin...')
run('npm run build', join(root, 'admin'), 'Build admin SPA')

// ─── TAO THU MUC ────────────────────────────────────────────────────────────
console.log('\nTao cau truc thu muc deploy...')
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

// ─── COPY FILES ─────────────────────────────────────────────────────────────
console.log('Copy website dist -> deploy/...')
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

console.log('Copy admin dist -> deploy/admin/...')
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// ─── INJECT APP_KEY ──────────────────────────────────────────────────────────
console.log('Generate APP_KEY va copy config.php...')
const appKey = randomBytes(32).toString('hex')
const appUrl = process.env.APP_URL || 'http://localhost:8081'
const configContent = readFileSync(join(root, 'api', 'config.php'), 'utf8')
  .replace("'change-this-to-random-32-chars-string'", `'${appKey}'`)
  .replace(/define\('APP_URL',\s*'[^']*'\)/, `define('APP_URL', '${appUrl}')`)
writeFileSync(join(deploy, 'api', 'config.php'), configContent)
console.log(`  APP_KEY: ${appKey.substring(0, 8)}...${appKey.substring(56)} (64 chars)`)
console.log(`  APP_URL: ${appUrl}`)

// ─── COPY API ────────────────────────────────────────────────────────────────
console.log('Copy api/ -> deploy/api/...')
// config.php da inject rieng, khong copy lai
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads', 'config.php'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(join(root, 'api', item), join(deploy, 'api', item), { recursive: true })
}

console.log('\n=== Build hoan thanh! ===')
console.log(`\nThu muc deploy: ${deploy}`)
console.log('\nHuong dan deploy:')
console.log('  1. Upload toan bo noi dung trong deploy/ len public_html/')
console.log('  2. Mo api/config.php, sua APP_URL thanh URL that')
console.log('  3. Kiem tra: https://yoursite.com/api/health')
console.log('  4. Dang nhap admin: /admin | sysadmin@admin.com / 123456')
