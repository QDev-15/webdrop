import { NextRequest, NextResponse } from 'next/server'
import { getCvSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const MAX_SIZE   = 32 * 1024 * 1024 // imgBB hỗ trợ tối đa 32MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff']

export async function POST(req: NextRequest) {
  const session = await getCvSession()
  if (!session) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey || apiKey.startsWith('your_')) {
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development'
          ? 'Chưa có IMGBB_API_KEY trong .env. Lấy miễn phí tại https://imgbb.com/api'
          : 'Dịch vụ upload chưa sẵn sàng, vui lòng thử lại sau.' },
      { status: 503 }
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Không đọc được file upload' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Thiếu file ảnh' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Chỉ chấp nhận ảnh JPG, PNG, WebP, GIF, BMP hoặc TIFF' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Ảnh quá lớn — tối đa 32MB' }, { status: 400 })
  }

  // Chuyển file → base64 để gửi lên imgBB
  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')

  const body = new URLSearchParams()
  body.append('image', base64)
  body.append('name', `cv-avatar-${session.id}-${Date.now()}`)

  let result: { data: { url: string; display_url: string }; success: boolean }
  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body,
    })
    result = await res.json()
    if (!res.ok || !result.success) {
      console.error('[imgBB error]', result)
      return NextResponse.json({ error: 'Upload thất bại, vui lòng thử lại' }, { status: 500 })
    }
  } catch (e) {
    console.error('[imgBB fetch error]', e)
    return NextResponse.json({ error: 'Lỗi kết nối đến dịch vụ upload' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, url: result.data.display_url })
}
