import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    throw new Error('Unauthorized')
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const valueId = parseInt(id)

    if (isNaN(valueId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const value = await prisma.companyValue.findUnique({
      where: { id: valueId },
    })

    if (!value) {
      return NextResponse.json({ error: 'Company value not found' }, { status: 404 })
    }

    return NextResponse.json(value)
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching company value:', err)
    return NextResponse.json({ error: 'Failed to fetch company value' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const valueId = parseInt(id)

    if (isNaN(valueId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await req.json()
    const { title, description, icon, sortOrder } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const value = await prisma.companyValue.update({
      where: { id: valueId },
      data: {
        title,
        description,
        icon,
        sortOrder: sortOrder ?? undefined,
      },
    })

    return NextResponse.json(value)
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Company value not found' }, { status: 404 })
    }
    console.error('Error updating company value:', err)
    return NextResponse.json({ error: 'Failed to update company value' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const valueId = parseInt(id)

    if (isNaN(valueId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    await prisma.companyValue.delete({
      where: { id: valueId },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Company value not found' }, { status: 404 })
    }
    console.error('Error deleting company value:', err)
    return NextResponse.json({ error: 'Failed to delete company value' }, { status: 500 })
  }
}
