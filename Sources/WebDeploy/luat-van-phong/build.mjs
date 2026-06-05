/**
 * Build script â€” VÄƒn PhÃ²ng Luáº­t SÆ°
 * Cháº¡y: node build.mjs
 * Output: deploy/
 */

import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root   = dirname(fileURLToPath(import.meta.url))
const deploy = join(root, 'deploy')

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
run('npm run build', join(root, 'admin'),   'Build admin')

// Create directories
console.log('  Táº¡o cáº¥u trÃºc deploy...')
mkdirSync(join(deploy, 'admin'),                 { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'),        { recursive: true })
mkdirSync(join(deploy, 'api', 'database'),       { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads',  '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'database', '.gitkeep'), '')

// Copy website/dist â†’ deploy/ (includes .htaccess, web.config from public/)
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// Copy admin/dist â†’ deploy/admin/
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// Copy api â†’ deploy/api/ (skip database, uploads, node_modules)
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads'])
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

