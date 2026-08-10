import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(team)
  } catch (err: any) {
    console.error('Error fetching team members:', err)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}
