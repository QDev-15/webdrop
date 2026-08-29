import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']
const MAX_SIZE_MB   = 10

interface CloudinarySettings {
  cloudName: string
  apiKey:    string
  apiSecret: string
  folder:    string
}

async function getCloudinarySettings(): Promise<CloudinarySettings | null> {
  const rows = await prisma.setting.findMany({
    where: { key: { in: ['cloudinary_cloud_name', 'cloudinary_api_key', 'cloudinary_api_secret', 'cloudinary_folder'] } },
  })
  const s = Object.fromEntries(rows.map(r => [r.key, r.value?.trim() || '']))
  if (!s.cloudinary_cloud_name || !s.cloudinary_api_key || !s.cloudinary_api_secret) return null
  return {
    cloudName: s.cloudinary_cloud_name,
    apiKey:    s.cloudinary_api_key,
    apiSecret: s.cloudinary_api_secret,
    folder:    s.cloudinary_folder || 'webdrop',
  }
}

function signCloudinary(params: Record<string, string | number>, apiSecret: string): string {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  return createHash('sha1').update(sorted + apiSecret).digest('hex')
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cfg = await getCloudinarySettings()
  if (!cfg) {
    return NextResponse.json(
      { error: 'Chưa cấu hình Cloudinary. Vào Cài đặt → Cloudinary để thêm credentials.' },
      { status: 400 }
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch (e) {
    console.error('[upload] formData parse error:', e)
    return NextResponse.json({ error: 'Không đọc được file upload.' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Không tìm thấy file.' }, { status: 400 })
  }

  // Validate trước khi đọc buffer
  const mimeType = file.type || 'image/jpeg'
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return NextResponse.json({ error: `Định dạng không hỗ trợ: ${mimeType}. Chỉ hỗ trợ JPG, PNG, WEBP, GIF, SVG.` }, { status: 400 })
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `File quá lớn (tối đa ${MAX_SIZE_MB}MB).` }, { status: 400 })
  }

  // Đọc toàn bộ nội dung file vào buffer — tránh lỗi stream đã consumed
  let arrayBuffer: ArrayBuffer
  try {
    arrayBuffer = await file.arrayBuffer()
  } catch (e) {
    console.error('[upload] arrayBuffer read error:', e)
    return NextResponse.json({ error: 'Không đọc được nội dung file.' }, { status: 400 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const paramsToSign = { folder: cfg.folder, timestamp }
  const signature    = signCloudinary(paramsToSign, cfg.apiSecret)

  // Tạo Blob mới từ buffer — không tái dùng File gốc
  const blob = new Blob([arrayBuffer], { type: mimeType })

  const uploadData = new FormData()
  uploadData.append('file',      blob, file.name || 'upload')
  uploadData.append('api_key',   cfg.apiKey)
  uploadData.append('timestamp', String(timestamp))
  uploadData.append('signature', signature)
  uploadData.append('folder',    cfg.folder)

  let res: Response
  try {
    res = await fetch(
      `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`,
      { method: 'POST', body: uploadData, cache: 'no-store' }
    )
  } catch (e) {
    console.error('[upload] fetch to Cloudinary failed:', e)
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: `Lỗi kết nối Cloudinary: ${msg}` }, { status: 500 })
  }

  let data: Record<string, unknown>
  try {
    data = await res.json()
  } catch {
    return NextResponse.json({ error: `Cloudinary trả về response không hợp lệ (status ${res.status})` }, { status: 500 })
  }

  if (!res.ok) {
    const msg = (data?.error as { message?: string })?.message || 'Upload thất bại'
    console.error('[upload] Cloudinary error:', res.status, msg)
    if (res.status === 401) {
      return NextResponse.json({ error: 'API Key hoặc Secret không đúng. Kiểm tra lại trong Cài đặt → Cloudinary.' }, { status: 400 })
    }
    return NextResponse.json({ error: `Cloudinary: ${msg}` }, { status: 500 })
  }

  return NextResponse.json({
    url:      data.secure_url as string,
    publicId: data.public_id  as string,
    width:    data.width      as number,
    height:   data.height     as number,
    format:   data.format     as string,
    bytes:    data.bytes      as number,
  })
}
