import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const template = await prisma.template.findUnique({
      where: { slug, status: 'published' },
      include: { industry: { select: { name: true, slug: true } } },
    })
    if (!template) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json(template)
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
