import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const root = dirname(fileURLToPath(import.meta.url))
const slug = "_output" // basename(root)
const deploy = join(dirname(root), `${slug}-deploy`)

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
run('npm run build', join(root, 'admin'), 'Build admin')

// Tao cau truc thu muc deploy
console.log('  Tao cau truc deploy...')
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

// Copy website dist → deploy root
console.log('  Copy website dist...')
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

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

console.log('')
console.log('=== BUILD THANH CONG! ===')
console.log(`  Thu muc deploy: ${deploy}`)
console.log('  APP_KEY da duoc tao tu dong.')
console.log('')
console.log('  HUONG DAN DEPLOY:')
console.log('  1. Upload toan bo thu muc deploy/ len public_html/')
console.log('  2. Mo api/config.php, sua APP_URL thanh URL that cua website')
console.log('  3. Truy cap /api/health de kiem tra')
console.log('  4. Dang nhap admin: /admin | sysadmin@admin.com / 123456')
