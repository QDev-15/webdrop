import { NextRequest, NextResponse } from 'next/server'
import archiver from 'archiver'
import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

// Thư mục gốc Sources/ (lên 1 cấp từ system/)
const SOURCES_DIR = join(process.cwd(), '..')

// Tìm thư mục template theo slug (quét 2 cấp: web/{Category}/{slug})
function findTemplateDir(slug: string): string | null {
  const webDir = join(SOURCES_DIR, 'templates', 'web')
  if (!existsSync(webDir)) return null

  // Thử tìm trực tiếp
  const direct = join(webDir, slug)
  if (existsSync(direct) && statSync(direct).isDirectory()) return direct

  // Quét qua từng category
  for (const entry of readdirSync(webDir)) {
    const catPath = join(webDir, entry)
    if (!statSync(catPath).isDirectory()) continue
    const nested = join(catPath, slug)
    if (existsSync(nested) && statSync(nested).isDirectory()) return nested
  }
  return null
}

// Tạo ReadableStream từ archiver (bridge Node.js stream → Web Stream)
function zipDirectories(entries: { src: string; dest: string }[], extraFiles?: { src: string; name: string }[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      const archive = archiver('zip', { zlib: { level: 6 } })

      archive.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)))
      archive.on('end',  ()              => controller.close())
      archive.on('error', (err: Error)   => controller.error(err))

      for (const { src, dest } of entries) {
        archive.directory(src, dest)
      }
      if (extraFiles) {
        for (const { src, name } of extraFiles) {
          if (existsSync(src)) archive.file(src, { name })
        }
      }
      archive.finalize()
    },
  })
}

// Trích xuất template slug từ order title
function extractSlug(title: string): string {
  // Title dạng "Template: {slug}" hoặc "Website Gói B ({slug})"
  const m = title.match(/Template:\s*(.+)/) ?? title.match(/Website Gói B \((.+)\)/)
  return m?.[1]?.trim() ?? ''
}

const TOKEN_MAX_USES = 5

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tokenParam = searchParams.get('token')
  const file       = searchParams.get('file') // 'template' | 'web' | 'admin'

  if (!tokenParam || !file) {
    return NextResponse.json({ error: 'Thiếu tham số token hoặc file' }, { status: 400 })
  }
  if (!['template', 'web', 'admin'].includes(file)) {
    return NextResponse.json({ error: 'file phải là template | web | admin' }, { status: 400 })
  }

  // Xác minh token
  let order
  try {
    order = await prisma.order.findUnique({ where: { downloadToken: tokenParam } })
  } catch {
    return NextResponse.json({ error: 'Lỗi DB' }, { status: 500 })
  }
  if (!order) {
    return NextResponse.json({ error: 'Link không hợp lệ hoặc đã hết hạn' }, { status: 404 })
  }
  if (!order.paidAt) {
    return NextResponse.json({ error: 'Đơn hàng chưa được thanh toán' }, { status: 403 })
  }
  if (order.tokenExpiresAt && order.tokenExpiresAt < new Date()) {
    return NextResponse.json({ error: 'Link đã hết hạn (72 giờ). Liên hệ hỗ trợ để được cấp lại.' }, { status: 410 })
  }
  if (order.tokenUsedCount >= TOKEN_MAX_USES) {
    return NextResponse.json({ error: `Link đã dùng tối đa ${TOKEN_MAX_USES} lần. Liên hệ hỗ trợ để được cấp lại.` }, { status: 429 })
  }

  // Kiểm tra loại đơn khớp với file yêu cầu
  if (file === 'template' && order.type !== 'template') {
    return NextResponse.json({ error: 'Đơn hàng này không bao gồm file template' }, { status: 403 })
  }
  if ((file === 'web' || file === 'admin') && order.type !== 'website') {
    return NextResponse.json({ error: 'Đơn hàng này không bao gồm gói website' }, { status: 403 })
  }

  // Tăng số lần dùng
  await prisma.order.update({
    where: { id: order.id },
    data:  { tokenUsedCount: { increment: 1 } },
  })

  let stream: ReadableStream<Uint8Array>
  let filename: string

  // ── Template download ──
  if (file === 'template') {
    const slug = extractSlug(order.title)
    if (!slug) return NextResponse.json({ error: 'Không xác định được template slug' }, { status: 400 })

    const templateDir = findTemplateDir(slug)
    if (!templateDir) {
      return NextResponse.json({ error: `Template "${slug}" không tìm thấy` }, { status: 404 })
    }

    stream   = zipDirectories([{ src: templateDir, dest: slug }])
    filename = `${slug}.zip`
  }

  // ── Website standard — deploy-ready package theo slug ──
  else {
    const slug = extractSlug(order.title)
    if (!slug) return NextResponse.json({ error: 'Không xác định được template slug' }, { status: 400 })

    const deployDir = join(SOURCES_DIR, 'products', 'basic', slug)
    if (!existsSync(deployDir)) {
      return NextResponse.json({ error: `Gói website "${slug}" chưa sẵn sàng` }, { status: 503 })
    }

    stream   = zipDirectories([{ src: deployDir, dest: slug }])
    filename = `${slug}.zip`
  }

  return new Response(stream, {
    headers: {
      'Content-Type':        'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control':       'no-store',
    },
  })
}
