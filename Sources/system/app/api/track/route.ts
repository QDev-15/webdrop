import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

const BOT_RE = /bot|crawler|spider|crawling|facebookexternalhit|Googlebot|baiduspider|YandexBot|Slurp|DuckDuckBot/i

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json()
    if (!path || typeof path !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const ua = req.headers.get('user-agent') || ''
    if (BOT_RE.test(ua)) return NextResponse.json({ ok: true })

    const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || req.headers.get('x-real-ip')
      || 'unknown'

    const ipHash = createHash('sha256').update(rawIp).digest('hex').slice(0, 16)

    await prisma.pageView.create({
      data: {
        path: path.slice(0, 500),
        referrer: referrer ? String(referrer).slice(0, 500) : null,
        ipHash,
        userAgent: ua.slice(0, 300),
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
