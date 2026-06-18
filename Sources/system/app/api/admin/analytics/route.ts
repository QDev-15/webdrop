import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days = Math.min(90, Math.max(1, parseInt(searchParams.get('days') || '30')))

  const now = new Date()
  const since = new Date(now)
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)

  const weekStart = new Date(now)
  weekStart.setDate(weekStart.getDate() - 7)
  weekStart.setHours(0, 0, 0, 0)

  const [viewsToday, viewsWeek, views, recent] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.pageView.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      select: { path: true, referrer: true, ipHash: true, userAgent: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.pageView.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: { path: true, referrer: true, userAgent: true, createdAt: true },
    }),
  ])

  // Unique visitors (distinct ipHash)
  const uniqueVisitors = new Set(views.map(v => v.ipHash).filter(Boolean)).size

  // Top pages
  const pageCounts: Record<string, number> = {}
  for (const v of views) pageCounts[v.path] = (pageCounts[v.path] || 0) + 1
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }))

  // Top referrers (group by hostname)
  const refCounts: Record<string, number> = {}
  for (const v of views) {
    if (!v.referrer) continue
    let key = v.referrer
    try { key = new URL(v.referrer).hostname.replace(/^www\./, '') } catch { key = key.slice(0, 40) }
    refCounts[key] = (refCounts[key] || 0) + 1
  }
  const topReferrers = Object.entries(refCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([referrer, count]) => ({ referrer, count }))

  // Daily chart
  const dailyCounts: Record<string, number> = {}
  for (const v of views) {
    const day = v.createdAt.toISOString().slice(0, 10)
    dailyCounts[day] = (dailyCounts[day] || 0) + 1
  }
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date(since)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    return { date: key, count: dailyCounts[key] || 0 }
  })

  // Hourly chart (today only)
  const hourlyCounts: Record<number, number> = {}
  for (const v of views) {
    if (v.createdAt >= todayStart) {
      const h = v.createdAt.getHours()
      hourlyCounts[h] = (hourlyCounts[h] || 0) + 1
    }
  }
  const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: hourlyCounts[h] || 0 }))

  return NextResponse.json({
    summary: {
      today: viewsToday,
      week: viewsWeek,
      period: views.length,
      unique: uniqueVisitors,
    },
    topPages,
    topReferrers,
    daily,
    hourly,
    recent,
  })
}
