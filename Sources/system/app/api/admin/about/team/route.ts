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

    const team = await prisma.teamMember.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(team)
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching team members:', err)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()

    const { name, title, bio, image, sortOrder } = body

    if (!name || !title || !bio) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        title,
        bio,
        image,
        sortOrder: sortOrder || 0,
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error creating team member:', err)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
