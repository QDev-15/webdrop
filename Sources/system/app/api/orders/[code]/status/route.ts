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
      items:         { select: { itemType: true, itemName: true, note: true } },
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

  // Đơn cũ (1 sản phẩm, trước khi có giỏ hàng) — OrderItem.note trống, suy ra slug từ order.title
  const legacySlug = extractSlug(order.title)
  const items = order.items.map(it => ({
    slug: it.note || legacySlug,
    type: it.itemType === 'website' ? 'website' as const : 'template' as const,
    name: it.itemName,
  }))

  return NextResponse.json({
    paid:  true,
    token: order.downloadToken,
    type:  order.type,
    slug:  legacySlug,
    items,
  })
}

function extractSlug(title: string): string {
  const m = title.match(/Template:\s*(.+)/) ?? title.match(/Website Gói B \((.+)\)/)
  return m?.[1]?.trim() ?? ''
}
