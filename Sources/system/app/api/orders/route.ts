import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateOrderCode(): string {
  const ts   = Date.now().toString(36).toUpperCase().slice(-5)
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `WD-${ts}${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, company, note, templateSlug, purchaseType } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    const type = purchaseType === 'website' ? 'website' : 'template'

    // Fetch giá từ DB — không tin giá từ client
    let price: number
    if (type === 'website') {
      const goiB = await prisma.servicePackage.findFirst({ where: { code: 'GOI_B' }, select: { priceFrom: true } })
      price = goiB?.priceFrom ? Number(goiB.priceFrom) : 5000000
    } else {
      const tmpl = templateSlug
        ? await prisma.template.findFirst({ where: { slug: templateSlug }, select: { price: true } })
        : null
      price = tmpl?.price ? Number(tmpl.price) : 499000
    }

    // Upsert customer
    let customer = email
      ? await prisma.customer.findFirst({ where: { email } })
      : null

    if (!customer) {
      customer = await prisma.customer.create({
        data: { name, phone, email: email || null, company: company || null, status: 'active' },
      })
    }

    const code = generateOrderCode()

    const order = await prisma.order.create({
      data: {
        code,
        customerId: customer.id,
        type,
        title: type === 'website'
          ? `Website Gói B${templateSlug ? ` (${templateSlug})` : ''}`
          : `Template: ${templateSlug || 'unknown'}`,
        price,
        total: price,
        status: 'new',
        note: note || null,
        items: {
          create: [{
            itemType: 'service',
            itemName: type === 'website' ? 'Website Gói B (web.zip + admin.zip)' : `Template ZIP: ${templateSlug}`,
            qty: 1,
            unitPrice: price,
            subtotal: price,
          }],
        },
        payments: {
          create: { amount: price, method: 'bank', status: 'pending' },
        },
      },
    })

    return NextResponse.json({ ok: true, code: order.code, orderId: order.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng' }, { status: 500 })
  }
}
