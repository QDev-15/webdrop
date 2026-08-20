import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    throw new Error('Unauthorized')
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const values = await prisma.companyValue.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(values)
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching company values:', err)
    return NextResponse.json({ error: 'Failed to fetch company values' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()

    const { title, description, icon, sortOrder } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const value = await prisma.companyValue.create({
      data: {
        title,
        description,
        icon,
        sortOrder: sortOrder || 0,
      },
    })

    return NextResponse.json(value, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating company value:', err)
    return NextResponse.json({ error: 'Failed to create company value' }, { status: 500 })
  }
}
