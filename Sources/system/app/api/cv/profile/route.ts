import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccountSession as getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.cvProfile.findUnique({
    where: { accountId: session.id },
    include: { data: true },
  })

  if (!profile) return NextResponse.json({ error: 'CV profile not found' }, { status: 404 })
  return NextResponse.json({ profile })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const allowed = ['templateType', 'slug', 'isPublic']
  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) data[key] = body[key]
  }

  if ('slug' in data) {
    const slug = String(data.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    if (slug.length < 3 || slug.length > 50) {
      return NextResponse.json({ error: 'Slug phải từ 3 đến 50 ký tự' }, { status: 400 })
    }
    data.slug = slug
  }

  try {
    const profile = await prisma.cvProfile.update({
      where: { accountId: session.id },
      data,
    })
    return NextResponse.json({ profile })
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err?.code === 'P2002') return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 409 })
    if (err?.code === 'P2025') return NextResponse.json({ error: 'Profile không tồn tại' }, { status: 404 })
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
