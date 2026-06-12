import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const row    = await prisma.setting.findFirst({ where: { key: 'football_api_key' } }).catch(() => null)
  const apiKey = row?.value?.trim()

  if (!apiKey) return NextResponse.json({ standings: [], noKey: true })

  try {
    const res = await fetch('https://api.football-data.org/v4/competitions/WC/standings', {
      headers: { 'X-Auth-Token': apiKey },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json({ standings: [], apiError: res.status })
    const data = await res.json()
    return NextResponse.json({ standings: data.standings ?? [] })
  } catch {
    return NextResponse.json({ standings: [], fetchError: true })
  }
}
