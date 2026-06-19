/**
 * Build script â€” VÄƒn PhÃ²ng Luáº­t SÆ°
 * Cháº¡y: node build.mjs
 * Output: deploy/
 */

import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const root = dirname(fileURLToPath(import.meta.url))
const slug = "_output" // basename(root)
const deploy = join(dirname(root), `${slug}-deploy`)

console.log('ðŸ”¨ Luáº­t VÄƒn PhÃ²ng â€” Build báº¯t Ä‘áº§u...\n')

// Clean deploy
if (existsSync(deploy)) {
  console.log('  XÃ³a thÆ° má»¥c deploy cÅ©...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`  ${label}...`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// Install deps if needed
if (!existsSync(join(root, 'website', 'node_modules'))) {
  run('npm install', join(root, 'website'), 'CÃ i Ä‘áº·t dependencies website')
}
if (!existsSync(join(root, 'admin', 'node_modules'))) {
  run('npm install', join(root, 'admin'), 'CÃ i Ä‘áº·t dependencies admin')
}

// Build
run('npm run build', join(root, 'website'), 'Build website')
run('npm run build', join(root, 'admin'), 'Build admin')
run('npm run build', join(root, 'admin'), 'Build admin')

// Create directories
console.log('  Táº¡o cáº¥u trÃºc deploy...')
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

// Copy website/dist â†’ deploy/ (includes .htaccess, web.config from public/)
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// Copy admin/dist â†’ deploy/admin/
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// Inject APP_KEY và APP_URL vào config.php
const appKey = randomBytes(32).toString('hex')
const appUrl = process.env.APP_URL || 'http://localhost:8081'
const configSrc = readFileSync(join(root, 'api', 'config.php'), 'utf8')
const appKey = randomBytes(32).toString('hex')
const appUrl = process.env.APP_URL || 'http://localhost:8081'
const configSrc = readFileSync(join(root, 'api', 'config.php'), 'utf8')
const configOut = configSrc
  .replace(/define\(‘APP_KEY’,\s*’[^’]*’\)/, `define(‘APP_KEY’, ‘${appKey}’)`)
  .replace(/define\(‘APP_URL’,\s*’[^’]*’\)/, `define(‘APP_URL’, ‘${appUrl}’)`)
writeFileSync(join(deploy, 'api', 'config.php'), configOut)
writeFileSync(join(deploy, 'api', 'config.php'), configOut)
console.log(`  APP_KEY: ${appKey.substring(0, 8)}...`)
console.log(`  APP_URL: ${appUrl}`)

// Copy api → deploy/api/ (skip database, uploads, node_modules, config.php đã inject riêng)
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads', 'config.php'])
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads', 'config.php'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(join(root, 'api', item), join(deploy, 'api', item), { recursive: true })
}

console.log('\nâœ… Build hoÃ n táº¥t!')
console.log('ðŸ“ Output: ' + deploy)
console.log('\nHÆ°á»›ng dáº«n deploy:')
console.log('  1. Upload toÃ n bá»™ ná»™i dung trong deploy/ lÃªn public_html/')
console.log('  2. Chá»‰nh sá»­a deploy/api/config.php theo thÃ´ng tin hosting')
console.log('  3. Truy cáº­p website.vn/admin Ä‘á»ƒ Ä‘Äƒng nháº­p')
console.log('  4. TÃ i khoáº£n máº·c Ä‘á»‹nh: sysadmin@admin.com / 123456')

