import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const profile = await prisma.cvProfile.findUnique({
    where: { slug },
    include: { data: true },
  })

  if (!profile || !profile.isPublic) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    profile: { templateType: profile.templateType, slug: profile.slug },
    data: profile.data,
  })
}
