import { execSync } from 'child_process'
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root   = dirname(fileURLToPath(import.meta.url))
const deploy = join(root, 'deploy')

// Clean deploy folder
if (existsSync(deploy)) rmSync(deploy, { recursive: true, force: true })

const run = (cmd, cwd) => {
  console.log(`\n> ${cmd}`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: true })
}

// Install dependencies if needed
const websiteNM = join(root, 'website', 'node_modules')
const adminNM   = join(root, 'admin', 'node_modules')

if (!existsSync(websiteNM)) {
  console.log('\nInstalling website dependencies...')
  run('npm install', join(root, 'website'))
}
if (!existsSync(adminNM)) {
  console.log('\nInstalling admin dependencies...')
  run('npm install', join(root, 'admin'))
}

// Build
console.log('\nBuilding website...')
run('npm run build', join(root, 'website'))

console.log('\nBuilding admin...')
run('npm run build', join(root, 'admin'))

// Assemble deploy/
console.log('\nAssembling deploy folder...')

mkdirSync(join(deploy, 'admin'),                    { recursive: true })
mkdirSync(join(deploy, 'api', 'src', 'controllers'), { recursive: true })
mkdirSync(join(deploy, 'api', 'uploads'),            { recursive: true })
mkdirSync(join(deploy, 'api', 'database'),           { recursive: true })

// website/dist → deploy/ (includes .htaccess, web.config from public/)
cpSync(join(root, 'website', 'dist'), deploy, { recursive: true })

// admin/dist → deploy/admin/
cpSync(join(root, 'admin', 'dist'), join(deploy, 'admin'), { recursive: true })

// api/* → deploy/api/ (skip database/, uploads/, node_modules)
const skipApi = new Set(['node_modules', '.git', 'database', 'uploads'])
for (const item of readdirSync(join(root, 'api'))) {
  if (skipApi.has(item)) continue
  cpSync(join(root, 'api', item), join(deploy, 'api', item), { recursive: true })
}

console.log('\n✓ Build complete! Deploy folder ready at: ' + deploy)
console.log('\nTo deploy: upload the "deploy" folder contents to your hosting public_html/')
console.log('Default admin login: admin@agency.vn / Admin@2026')
