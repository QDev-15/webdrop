import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const values = await prisma.companyValue.findMany({
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(values)
  } catch (err: any) {
    console.error('Error fetching company values:', err)
    return NextResponse.json({ error: 'Failed to fetch company values' }, { status: 500 })
  }
}
