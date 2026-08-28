import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccountSession } from '@/lib/auth'

export async function GET() {
  const session = await getAccountSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const account = await prisma.customerAccount.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, phone: true, avatarUrl: true, createdAt: true },
  })
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ account })
}
