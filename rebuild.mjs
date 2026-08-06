#!/usr/bin/env node
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteDir = path.join(__dirname, 'Sources/WebDeploy/shop-the-thao')

console.log('Rebuilding shop-the-thao...\n')

try {
  // Build website
  console.log('[1/3] Building website...')
  execSync('npm run build', { cwd: path.join(siteDir, 'website'), stdio: 'inherit' })

  // Build admin
  console.log('\n[2/3] Building admin...')
  execSync('npm run build', { cwd: path.join(siteDir, 'admin'), stdio: 'inherit' })

  // Run deploy script
  console.log('\n[3/3] Deploying...')
  execSync('node build.mjs', { cwd: siteDir, stdio: 'inherit' })

  console.log('\n✅ Build complete! Website deployed to _output-deploy/')
} catch (err) {
  console.error('\n❌ Build failed:', err.message)
  process.exit(1)
}
