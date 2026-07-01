import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const order = await prisma.order.findUnique({
    where: { code },
    select: {
      paidAt:        true,
      downloadToken: true,
      type:          true,
      title:         true,
      customer:      { select: { email: true } },
    },
  })

  if (!order) {
    return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 })
  }

  if (!order.paidAt) {
    return NextResponse.json({ paid: false })
  }

  if (order.type === 'cv') {
    const isExisting = order.downloadToken === 'EXISTING_USER'
    return NextResponse.json({
      paid:         true,
      type:         'cv',
      email:        order.customer.email ?? '',
      password:     isExisting ? null : order.downloadToken,
      existingUser: isExisting,
    })
  }

  const slug = extractSlug(order.title)
  return NextResponse.json({
    paid:  true,
    token: order.downloadToken,
    type:  order.type,
    slug,
  })
}

function extractSlug(title: string): string {
  const m = title.match(/Template:\s*(.+)/) ?? title.match(/Website Gói B \((.+)\)/)
  return m?.[1]?.trim() ?? ''
}
