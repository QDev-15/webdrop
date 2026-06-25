import { NextRequest, NextResponse } from 'next/server'

async function measureImageWidth(url: string): Promise<number> {
  if (url.includes('unsplash.com')) {
    const m = url.match(/[?&]w=(\d+)/)
    return m ? parseInt(m[1]) : 1200
  }
  try {
    const res = await fetch(url, {
      headers: { Range: 'bytes=0-1023' },
      signal: AbortSignal.timeout(3000),
    })
    const b = new Uint8Array(await res.arrayBuffer())
    // PNG: width at bytes 16-19
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47 && b.length >= 24) {
      return (b[16] << 24 | b[17] << 16 | b[18] << 8 | b[19]) >>> 0
    }
    // JPEG: scan for SOF0–SOF3 marker
    for (let i = 2; i + 9 < b.length; i++) {
      if (b[i] === 0xFF && b[i + 1] >= 0xC0 && b[i + 1] <= 0xC3) {
        return (b[i + 7] << 8) | b[i + 8]
      }
    }
  } catch { /* ignore */ }
  return 0
}

export async function GET(req: NextRequest) {
  const demoUrl = req.nextUrl.searchParams.get('url')
  if (!demoUrl) return NextResponse.json([], { status: 400 })

  try {
    const res = await fetch(demoUrl, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) return NextResponse.json([])
    const html = await res.text()
    const base = new URL(demoUrl)
    const seen = new Set<string>()
    const candidates: string[] = []

    const re = /(?:src|data-src)=["']([^"'\s]+)["']/gi
    let m: RegExpExecArray | null
    while ((m = re.exec(html)) !== null) {
      const raw = m[1]
      if (!raw || raw.startsWith('data:') || raw.startsWith('#')) continue
      try {
        const abs = new URL(raw, base).href
        if (
          /\.(jpe?g|png|webp)(\?|$)/i.test(abs) ||
          abs.includes('unsplash.com') ||
          abs.includes('images.pexels.com')
        ) {
          if (/favicon|logo-sm|icon-\d{2}\./.test(abs)) continue
          if (!seen.has(abs)) { seen.add(abs); candidates.push(abs) }
        }
      } catch { /* skip */ }
    }

    const results = await Promise.all(
      candidates.map(async url => ({ url, w: await measureImageWidth(url) }))
    )
    const images = results
      .filter(({ w }) => w >= 400)
      .map(({ url }) => url)
      .slice(0, 5)

    return NextResponse.json(images, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
    })
  } catch {
    return NextResponse.json([])
  }
}
