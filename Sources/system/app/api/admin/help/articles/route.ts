import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    throw new Error('Unauthorized')
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    const article = await prisma.helpArticle.create({ data: body })
    return NextResponse.json(article)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    const q = request.nextUrl.searchParams.get('q')
    const where = q ? { title: { contains: q } } : {}
    const articles = await prisma.helpArticle.findMany({ where, include: { category: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(articles)
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
