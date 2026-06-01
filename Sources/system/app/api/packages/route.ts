import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const packages = await prisma.servicePackage.findMany({
      where: { status: 'published' },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(packages)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
