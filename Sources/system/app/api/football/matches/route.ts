import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function vnDateOffset(days: number): string {
  const d = new Date(Date.now() + 7 * 3600000)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  const sp       = new URL(req.url).searchParams
  const dateFrom = sp.get('dateFrom') || vnDateOffset(-3)
  const dateTo   = sp.get('dateTo')   || vnDateOffset(14)

  const row    = await prisma.setting.findFirst({ where: { key: 'football_api_key' } }).catch(() => null)
  const apiKey = row?.value?.trim()

  if (!apiKey) return NextResponse.json({ matches: [], noKey: true })

  try {
    const url = `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`
    const res = await fetch(url, { headers: { 'X-Auth-Token': apiKey }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ matches: [], apiError: res.status })
    const data = await res.json()
    return NextResponse.json({ matches: data.matches ?? [] })
  } catch {
    return NextResponse.json({ matches: [], fetchError: true })
  }
}
