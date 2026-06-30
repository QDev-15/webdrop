import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { randomUUID } from 'crypto'

function generateOrderCode(): string {
  const ts   = Date.now().toString(36).toUpperCase().slice(-5)
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `WD${ts}${rand}`
}

function generateCvSlug(name: string): string {
  const base = name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 30).replace(/-$/, '')
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}

function calcDiscountAmount(type: string, value: number, price: number): number {
  if (type === 'percent') return Math.round(price * Math.min(value, 100) / 100)
  return Math.min(value, price)
}

const CV_PRICE = 59000
const TOKEN_TTL_HOURS = 72

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, company, note, templateSlug, purchaseType, discountCode: rawCode } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }
    if (purchaseType === 'cv' && !email) {
      return NextResponse.json({ error: 'Email là bắt buộc để đăng nhập CV Manager' }, { status: 400 })
    }

    // ── 1. Tính giá gốc ──────────────────────────────────────
    let type: 'template' | 'website' | 'cv'
    let basePrice: number
    let title: string
    let itemName: string

    if (purchaseType === 'cv') {
      type = 'cv'; basePrice = CV_PRICE
      title = 'CV Builder — Trọn gói'
      itemName = 'CV Builder — Trọn gói (tất cả 10 mẫu)'
    } else {
      type = purchaseType === 'website' ? 'website' : 'template'
      const tmpl = templateSlug
        ? await prisma.template.findFirst({ where: { slug: templateSlug }, select: { price: true, websitePrice: true } })
        : null
      if (type === 'website') {
        basePrice = tmpl?.websitePrice ? Number(tmpl.websitePrice) : 5000000
        title = `Website Gói B${templateSlug ? ` (${templateSlug})` : ''}`
        itemName = 'Website Gói B (web.zip + admin.zip)'
      } else {
        basePrice = tmpl?.price ? Number(tmpl.price) : 499000
        title = `Template: ${templateSlug || 'unknown'}`
        itemName = `Template ZIP: ${templateSlug}`
      }
    }

    // ── 2. Áp dụng mã giảm giá ───────────────────────────────
    let discountAmount = 0
    let finalTotal = basePrice
    let appliedCode: string | null = null

    if (rawCode) {
      const dc = await prisma.discountCode.findUnique({
        where: { code: rawCode.trim().toUpperCase() },
      })
      if (
        dc &&
        dc.isActive &&
        (!dc.expiresAt || dc.expiresAt > new Date()) &&
        (dc.maxUses === null || dc.usedCount < dc.maxUses)
      ) {
        discountAmount = calcDiscountAmount(dc.type, Number(dc.value), basePrice)
        finalTotal = Math.max(0, basePrice - discountAmount)
        appliedCode = dc.code
      }
    }

    const now = new Date()

    // ── 3a. Đơn miễn phí (100% discount) — CV ────────────────
    if (finalTotal === 0 && type === 'cv') {
      if (!email) return NextResponse.json({ error: 'Email là bắt buộc' }, { status: 400 })

      // Kiểm tra user tồn tại và hash password TRƯỚC transaction
      // để tránh bcrypt làm timeout (bcrypt ~200-400ms, default timeout 5s)
      const tempPassword = 'WD' + randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
      const existingUserCheck = await prisma.user.findUnique({ where: { email }, select: { id: true } })
      const hashedPassword = existingUserCheck ? null : hashPassword(tempPassword)

      const order = await prisma.$transaction(async (tx) => {
        let customer = await tx.customer.findFirst({ where: { email } })
        if (!customer) {
          customer = await tx.customer.create({
            data: { name, phone, email, company: company || null, status: 'active' },
          })
        }

        let credentialToken: string

        if (!existingUserCheck) {
          const newUser = await tx.user.create({
            data: { name, email, password: hashedPassword!, role: 'user' },
          })
          const slug = generateCvSlug(name)
          await tx.cvProfile.create({
            data: { userId: newUser.id, slug, templateType: 'classic', data: { create: {} } },
          })
          credentialToken = tempPassword
        } else {
          const existingProfile = await tx.cvProfile.findUnique({ where: { userId: existingUserCheck.id } })
          if (!existingProfile) {
            const slug = generateCvSlug(name)
            await tx.cvProfile.create({
              data: { userId: existingUserCheck.id, slug, templateType: 'classic', data: { create: {} } },
            })
          }
          credentialToken = 'EXISTING_USER'
        }

        const code = generateOrderCode()
        const ord = await tx.order.create({
          data: {
            code, customerId: customer.id, type: 'cv', title,
            price: basePrice, discount: discountAmount, total: 0,
            discountCode: appliedCode,
            status: 'confirmed', paidAt: now,
            downloadToken: credentialToken,
            items: { create: [{ itemType: 'service', itemName, qty: 1, unitPrice: basePrice, subtotal: 0 }] },
            payments: { create: { amount: 0, method: 'bank', status: 'paid', paidAt: now } },
          },
        })

        if (appliedCode) {
          await tx.discountCode.update({ where: { code: appliedCode }, data: { usedCount: { increment: 1 } } })
        }
        await tx.revenue.create({
          data: { orderId: ord.id, amount: 0, month: now.getMonth() + 1, year: now.getFullYear(), note: `CV miễn phí${appliedCode ? ` — mã ${appliedCode}` : ''}` },
        })

        return ord
      }, { timeout: 15000 })

      return NextResponse.json({ ok: true, code: order.code, orderId: order.id })
    }

    // ── 3b. Đơn miễn phí — Template/Website ──────────────────
    if (finalTotal === 0 && (type === 'template' || type === 'website')) {
      const downloadToken  = randomUUID()
      const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 3600 * 1000)

      let customer = email
        ? await prisma.customer.findFirst({ where: { email } })
        : null
      if (!customer) {
        customer = await prisma.customer.create({
          data: { name, phone, email: email || null, company: company || null, status: 'active' },
        })
      }

      const code = generateOrderCode()
      const order = await prisma.$transaction(async (tx) => {
        const ord = await tx.order.create({
          data: {
            code, customerId: customer!.id, type, title,
            price: basePrice, discount: discountAmount, total: 0,
            discountCode: appliedCode,
            status: 'confirmed', paidAt: now,
            downloadToken, tokenExpiresAt, tokenUsedCount: 0,
            note: note || null,
            items: { create: [{ itemType: 'service', itemName, qty: 1, unitPrice: basePrice, subtotal: 0 }] },
            payments: { create: { amount: 0, method: 'bank', status: 'paid', paidAt: now } },
          },
        })

        if (appliedCode) {
          await tx.discountCode.update({ where: { code: appliedCode }, data: { usedCount: { increment: 1 } } })
        }
        await tx.revenue.create({
          data: { orderId: ord.id, amount: 0, month: now.getMonth() + 1, year: now.getFullYear(), note: `Miễn phí${appliedCode ? ` — mã ${appliedCode}` : ''}` },
        })

        return ord
      }, { timeout: 15000 })

      return NextResponse.json({ ok: true, code: order.code, orderId: order.id })
    }

    // ── 4. Đơn thường (có thanh toán) ────────────────────────
    let customer = email
      ? await prisma.customer.findFirst({ where: { email } })
      : null
    if (!customer) {
      customer = await prisma.customer.create({
        data: { name, phone, email: email || null, company: company || null, status: 'active' },
      })
    }

    const code = generateOrderCode()
    const order = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.create({
        data: {
          code, customerId: customer!.id, type, title,
          price: basePrice, discount: discountAmount, total: finalTotal,
          discountCode: appliedCode,
          status: 'new',
          note: note || null,
          items: { create: [{ itemType: 'service', itemName, qty: 1, unitPrice: basePrice, subtotal: finalTotal }] },
          payments: { create: { amount: finalTotal, method: 'bank', status: 'pending' } },
        },
      })
      if (appliedCode) {
        await tx.discountCode.update({ where: { code: appliedCode }, data: { usedCount: { increment: 1 } } })
      }
      return ord
    }, { timeout: 15000 })

    return NextResponse.json({ ok: true, code: order.code, orderId: order.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng' }, { status: 500 })
  }
}
