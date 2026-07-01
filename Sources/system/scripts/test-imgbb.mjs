/**
 * Test kết nối imgBB
 * Chạy: node scripts/test-imgbb.mjs
 */
import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

config({ path: '.env' })

const apiKey = process.env.IMGBB_API_KEY

console.log('\n── imgBB Upload Test ──')

if (!apiKey || apiKey.startsWith('your_')) {
  console.error('❌ Chưa có IMGBB_API_KEY trong .env')
  console.error('   Lấy miễn phí tại: https://api.imgbb.com')
  process.exit(1)
}
console.log(`✓ API Key: ${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`)

// Upload ảnh test (1x1 pixel PNG, base64)
const px1 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

console.log('\n[1] Upload test image (1×1 px PNG)...')
const body = new URLSearchParams()
body.append('image', px1)
body.append('name', 'webdrop-imgbb-test')

try {
  const res  = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body })
  const data = await res.json()

  if (!res.ok || !data.success) {
    console.error('❌ Upload thất bại:', JSON.stringify(data, null, 2))
    process.exit(1)
  }

  console.log(`✓ Upload OK`)
  console.log(`  URL:         ${data.data.url}`)
  console.log(`  Display URL: ${data.data.display_url}`)
  console.log(`  Delete URL:  ${data.data.delete_url}`)
  console.log('\n✅ imgBB hoạt động bình thường!\n')
} catch (e) {
  console.error('❌ Lỗi:', e.message)
  process.exit(1)
}
