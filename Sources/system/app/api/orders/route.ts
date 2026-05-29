import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateOrderCode(): string {
  const num = Math.floor(Math.random() * 9000) + 1000
  return `WD-${num}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, company, industry, note, templateSlug, plan, addons, paymentMethod } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
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

    // Tính giá
    const planPrices: Record<string, number> = { starter: 1200000, standard: 2500000, premium: 12000000 }
    const addonPrices: Record<string, number> = { maintenance: 990000, domain: 300000, seo: 1200000 }

    const basePrice = planPrices[plan] || 2500000
    const addonTotal = (addons || []).reduce((sum: number, a: string) => sum + (addonPrices[a] || 0), 0)
    const total = basePrice + addonTotal

    // Tạo order
    let code = generateOrderCode()
    // Đảm bảo code unique
    while (await prisma.order.findUnique({ where: { code } })) {
      code = generateOrderCode()
    }

    const order = await prisma.order.create({
      data: {
        code,
        customerId: customer.id,
        type: 'template',
        title: templateSlug ? `Template: ${templateSlug}` : 'Đặt hàng website',
        price: basePrice,
        total,
        status: 'new',
        note: [note, industry ? `Ngành: ${industry}` : '', addons?.length ? `Addon: ${addons.join(', ')}` : ''].filter(Boolean).join(' | ') || null,
        items: {
          create: [
            { itemType: 'service', itemName: `Gói ${plan}`, qty: 1, unitPrice: basePrice, subtotal: basePrice },
            ...(addons || []).map((a: string) => ({
              itemType: 'addon',
              itemName: a,
              qty: 1,
              unitPrice: addonPrices[a] || 0,
              subtotal: addonPrices[a] || 0,
            })),
          ],
        },
        payments: paymentMethod !== 'consult' ? {
          create: { amount: total, method: paymentMethod === 'bank' ? 'bank' : paymentMethod === 'momo' ? 'momo' : 'bank', status: 'pending' },
        } : undefined,
      },
    })

    return NextResponse.json({ ok: true, code: order.code, orderId: order.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng' }, { status: 500 })
  }
}
