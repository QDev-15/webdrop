import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function getAccessKey(): Promise<string | null> {
  const row = await prisma.setting.findUnique({ where: { key: 'unsplash_access_key' } })
  return row?.value?.trim() || null
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q    = searchParams.get('q')?.trim()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)

  if (!q) return NextResponse.json({ results: [], total: 0, total_pages: 0 })

  const accessKey = await getAccessKey()
  if (!accessKey) {
    return NextResponse.json(
      { error: 'Chưa cấu hình Unsplash Access Key. Vào Cài đặt → Tích hợp để thêm.' },
      { status: 400 }
    )
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=12&page=${page}&orientation=landscape`

  let res: Response
  try {
    res = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      next: { revalidate: 60 },
    })
  } catch {
    return NextResponse.json({ error: 'Không thể kết nối đến Unsplash. Thử lại sau.' }, { status: 500 })
  }

  if (!res.ok) {
    if (res.status === 401) {
      return NextResponse.json({ error: 'Access Key không hợp lệ. Kiểm tra lại trong Cài đặt → Tích hợp.' }, { status: 400 })
    }
    if (res.status === 403) {
      return NextResponse.json({ error: 'Đã vượt giới hạn request Unsplash (50 req/giờ). Thử lại sau.' }, { status: 429 })
    }
    return NextResponse.json({ error: 'Lỗi kết nối Unsplash. Thử lại sau.' }, { status: 500 })
  }

  const data = await res.json()

  return NextResponse.json({
    results: (data.results ?? []).map((p: Record<string, unknown>) => {
      const urls  = p.urls  as Record<string, string>
      const links = p.links as Record<string, string>
      const user  = p.user  as Record<string, unknown>
      const uLinks = user?.links as Record<string, string>
      return {
        id:               p.id as string,
        thumb:            urls.small,
        regular:          urls.regular,
        alt:              (p.alt_description || p.description || '') as string,
        author:           user?.name as string,
        authorUrl:        uLinks?.html as string,
        downloadLocation: links?.download_location as string,
      }
    }),
    total:       data.total       ?? 0,
    total_pages: data.total_pages ?? 0,
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { downloadLocation } = await req.json()
  if (!downloadLocation || typeof downloadLocation !== 'string') {
    return NextResponse.json({ error: 'Missing downloadLocation' }, { status: 400 })
  }

  const accessKey = await getAccessKey()
  if (!accessKey) return NextResponse.json({ ok: true })

  try {
    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    })
  } catch {
    // fire-and-forget — không block user nếu lỗi
  }

  return NextResponse.json({ ok: true })
}
