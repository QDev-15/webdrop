import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      where: { status: 'published' },
      include: { industry: { select: { name: true, slug: true } } },
      orderBy: { salesCount: 'desc' },
    })
    return NextResponse.json(templates)
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
