import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccountSession } from '@/lib/auth'

export async function GET() {
  const session = await getAccountSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cvProfile = await prisma.cvProfile.findUnique({
    where: { accountId: session.id },
    select: { id: true, slug: true, templateType: true, isPublic: true, updatedAt: true },
  })

  return NextResponse.json({ cvProfile })
}
