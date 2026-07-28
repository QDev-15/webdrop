import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const SENSITIVE_KEYS = new Set([
  'smtp_password', 'cloudinary_api_secret', 'unsplash_access_key',
  'football_api_key', 'sepay_api_key', 'telegram_bot_token',
])

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await prisma.setting.findMany()
  const settings = Object.fromEntries(rows.map(r => {
    if (session.role !== 'superadmin' && SENSITIVE_KEYS.has(r.key)) return [r.key, '']
    return [r.key, r.value || '']
  }))
  return NextResponse.json({ settings })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { settings } = await req.json()
  if (typeof settings !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  await Promise.all(
    Object.entries(settings as Record<string, string>).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value, group: key.split('_')[0] },
      })
    )
  )

  return NextResponse.json({ ok: true })
}
