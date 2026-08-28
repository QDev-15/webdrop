import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccountSession as getSession } from '@/lib/auth'

const ALLOWED_FIELDS = [
  'fullName', 'jobTitle', 'avatarUrl', 'summary',
  'email', 'phone', 'location', 'website',
  'linkedin', 'github', 'twitter',
  'experience', 'education', 'skills',
  'projects', 'certifications', 'languages',
]

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.cvProfile.findUnique({
    where: { accountId: session.id },
    include: { data: true },
  })

  if (!profile) return NextResponse.json({ error: 'CV profile not found' }, { status: 404 })
  return NextResponse.json({ data: profile.data })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.cvProfile.findUnique({ where: { accountId: session.id } })
  if (!profile) return NextResponse.json({ error: 'CV profile not found' }, { status: 404 })

  const body = await req.json()
  const updateData: Record<string, unknown> = {}
  for (const key of ALLOWED_FIELDS) {
    if (key in body) updateData[key] = body[key]
  }

  const data = await prisma.cvData.upsert({
    where: { cvId: profile.id },
    update: updateData,
    create: { cvId: profile.id, ...updateData },
  })

  return NextResponse.json({ data })
}
