/**
 * Build script â€” cong-ty-xay-dung
 * Cháº¡y: node build.mjs
 * Output: deploy/
 */

import { execSync }                                              from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, writeFileSync } from 'fs'
import { join, dirname }                                         from 'path'
import { fileURLToPath }                                         from 'url'

const root   = dirname(fileURLToPath(import.meta.url))
const deploy = join(root, 'deploy')

console.log('=== Build: cong-ty-xay-dung ===\n')

// 1. XÃ³a deploy/ cÅ©
if (existsSync(deploy)) {
  console.log('[1/5] XÃ³a thÆ° má»¥c deploy/ cÅ©...')
  rmSync(deploy, { recursive: true, force: true })
}

const run = (cmd, cwd, label) => {
  console.log(`[build] ${label}`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// 2. Build website (public site)
console.log('\n[2/5] Build website (React public site)...')
run('npm run build', join(root, 'website'), 'website â†’ dist/')

// 3. Build admin
console.log('\n[3/5] Build admin panel...')
run('npm run build', join(root, 'admin'), 'admin â†’ dist/')

// 4. Táº¡o cáº¥u trÃºc deploy/
console.log('\n[4/5] Tá»• chá»©c thÆ° má»¥c deploy/...')

mkdirSync(join(deploy, 'admin'),                     { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'),            { recursive: true })
mkdirSync(join(deploy, 'api', 'database'),           { recursive: true })
writeFileSync(join(deploy, 'api', 'uploads',  '.gitkeep'), '')
writeFileSync(join(deploy, 'api', 'database', '.gitkeep'), '')

// website/dist/ â†’ deploy/ (bao gá»“m .htaccess vÃ  web.config)
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// admin/dist/ â†’ deploy/admin/
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// api/ â†’ deploy/api/ (bá» qua database/, uploads/, .git)
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  const src  = join(root, 'api', item)
  const dest = join(deploy, 'api', item)
  cpSync(src, dest, { recursive: true })
}


// 5. ThÃ´ng bÃ¡o
console.log('\n[5/5] HoÃ n thÃ nh!')
console.log('â”€'.repeat(50))
console.log('Deploy folder: ' + deploy)
console.log('\nCáº¥u trÃºc deploy/:')
console.log('  index.html, assets/   â† Website public')
console.log('  .htaccess, web.config â† SPA routing (Apache + IIS)')
console.log('  admin/                â† Admin panel')
console.log('  api/                  â† PHP backend + SQLite')
console.log('\nHÆ°á»›ng dáº«n deploy:')
console.log('  1. Upload toÃ n bá»™ ná»™i dung trong deploy/ lÃªn public_html/')
console.log('  2. Chá»‰nh sá»­a api/config.php theo thÃ´ng tin hosting')
console.log('  3. Truy cáº­p website.vn/admin Ä‘á»ƒ Ä‘Äƒng nháº­p')
console.log('  4. TÃ i khoáº£n máº·c Ä‘á»‹nh: sysadmin@admin.com / 123456')
console.log('â”€'.repeat(50))

