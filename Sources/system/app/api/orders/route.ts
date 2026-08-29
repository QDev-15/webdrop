import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAccountSession } from '@/lib/auth'
import { randomUUID, randomBytes } from 'crypto'
import { resolveCustomerId, ensureCvProfileForAccount, createOrReuseGuestCvAccount, consumeDiscountCode } from '@/lib/checkoutAccount'
import type { AccountSessionPayload } from '@/lib/auth'

// 12 ký tự ngẫu nhiên MẬT MÃ HỌC (không dùng Math.random()) — order code này bị dùng làm "khoá" gần
// như duy nhất để tra cứu trạng thái đơn công khai (GET /api/orders/[code]/status, không yêu cầu đăng
// nhập) và trả về downloadToken/mật khẩu CV. Trước đây ghép timestamp (dễ đoán theo thời điểm) + 3 ký
// tự Math.random() (~46.656 tổ hợp) — có thể brute-force. Giờ dùng đủ 12 ký tự random từ CSPRNG
// (~36^12 ≈ 4.7×10^18 tổ hợp, ~62 bit) — vẫn khớp giới hạn 5-12 ký tự trong regex webhook Sepay
// (`extractOrderCode` ở app/api/webhooks/sepay/route.ts), không cần đổi regex đó.
function generateOrderCode(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const bytes = randomBytes(12)
  let rand = ''
  for (const b of bytes) rand += chars[b % chars.length]
  return `WD${rand}`
}

function calcDiscountAmount(type: string, value: number, price: number): number {
  if (type === 'percent') return Math.round(price * Math.min(value, 100) / 100)
  return Math.min(value, price)
}

const CV_PRICE = 59000
const TOKEN_TTL_HOURS = 72

interface CartItemInput { slug: string; purchaseType: 'template' | 'website' }

export async function POST(req: NextRequest) {
  try {
    const session = await getAccountSession()
    const body = await req.json()
    const { name, phone, email, company, note, templateSlug, purchaseType, discountCode: rawCode, items: cartItems } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }
    if (purchaseType === 'cv' && !email) {
      return NextResponse.json({ error: 'Email là bắt buộc để đăng nhập CV Manager' }, { status: 400 })
    }

    // ── Giỏ hàng nhiều sản phẩm — nhánh riêng, không đụng logic 1-sản-phẩm bên dưới ──
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      return handleCartOrder(cartItems as CartItemInput[], { name, phone, email, note, discountCode: rawCode }, session)
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

      const order = await prisma.$transaction(async (tx) => {
        const customerId = await resolveCustomerId(tx, session, { name, phone, email, company })

        // Đã đăng nhập → gắn CV thẳng vào tài khoản đang đăng nhập, không tạo tài khoản mới/mật khẩu tạm.
        // Chưa đăng nhập (guest) → giữ hành vi cũ: tìm/tạo tài khoản kèm mật khẩu tạm hiển thị 1 lần.
        // downloadToken có @unique — KHÔNG được dùng chung 1 literal string cho nhiều đơn (sẽ đụng
        // constraint). Trạng thái "tài khoản mới hay đã có sẵn" lưu riêng ở cột newCvAccount.
        let credentialToken: string | null
        let isNewAccount: boolean
        if (session) {
          await ensureCvProfileForAccount(tx, session.id, name)
          credentialToken = null
          isNewAccount = false
        } else {
          const result = await createOrReuseGuestCvAccount(tx, customerId, name, email)
          credentialToken = result.credentialToken
          isNewAccount = result.isNewAccount
        }

        if (appliedCode && !(await consumeDiscountCode(tx, appliedCode))) {
          throw new Error('DISCOUNT_CODE_EXPIRED')
        }

        const code = generateOrderCode()
        const ord = await tx.order.create({
          data: {
            code, customerId, type: 'cv', title,
            price: basePrice, discount: discountAmount, total: 0,
            discountCode: appliedCode,
            status: 'confirmed', paidAt: now,
            downloadToken: credentialToken,
            newCvAccount: isNewAccount,
            items: { create: [{ itemType: 'service', itemName, qty: 1, unitPrice: basePrice, subtotal: 0 }] },
            payments: { create: { amount: 0, method: 'bank', status: 'paid', paidAt: now } },
          },
        })

        await tx.revenue.create({
          data: { orderId: ord.id, amount: 0, month: now.getMonth() + 1, year: now.getFullYear(), note: `CV miễn phí${appliedCode ? ` — mã ${appliedCode}` : ''}` },
        })

        return ord
      }, { timeout: 15000 }).catch(e => {
        if (e instanceof Error && e.message === 'DISCOUNT_CODE_EXPIRED') return null
        throw e
      })

      if (!order) {
        return NextResponse.json({ error: 'Mã giảm giá đã hết lượt sử dụng hoặc hết hạn, vui lòng thử lại.' }, { status: 409 })
      }

      return NextResponse.json({ ok: true, code: order.code, orderId: order.id })
    }

    // ── 3b. Đơn miễn phí — Template/Website ──────────────────
    if (finalTotal === 0 && (type === 'template' || type === 'website')) {
      const downloadToken  = randomUUID()
      const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 3600 * 1000)

      const code = generateOrderCode()
      const order = await prisma.$transaction(async (tx) => {
        const customerId = await resolveCustomerId(tx, session, { name, phone, email, company })

        if (appliedCode && !(await consumeDiscountCode(tx, appliedCode))) {
          throw new Error('DISCOUNT_CODE_EXPIRED')
        }

        const ord = await tx.order.create({
          data: {
            code, customerId, type, title,
            price: basePrice, discount: discountAmount, total: 0,
            discountCode: appliedCode,
            status: 'confirmed', paidAt: now,
            downloadToken, tokenExpiresAt, tokenUsedCount: 0,
            note: note || null,
            items: { create: [{ itemType: 'service', itemName, qty: 1, unitPrice: basePrice, subtotal: 0 }] },
            payments: { create: { amount: 0, method: 'bank', status: 'paid', paidAt: now } },
          },
        })

        await tx.revenue.create({
          data: { orderId: ord.id, amount: 0, month: now.getMonth() + 1, year: now.getFullYear(), note: `Miễn phí${appliedCode ? ` — mã ${appliedCode}` : ''}` },
        })

        return ord
      }, { timeout: 15000 }).catch(e => {
        if (e instanceof Error && e.message === 'DISCOUNT_CODE_EXPIRED') return null
        throw e
      })

      if (!order) {
        return NextResponse.json({ error: 'Mã giảm giá đã hết lượt sử dụng hoặc hết hạn, vui lòng thử lại.' }, { status: 409 })
      }
      return NextResponse.json({ ok: true, code: order.code, orderId: order.id })
    }

    // ── 4. Đơn thường (có thanh toán) ────────────────────────
    const code = generateOrderCode()
    const order = await prisma.$transaction(async (tx) => {
      const customerId = await resolveCustomerId(tx, session, { name, phone, email, company })

      if (appliedCode && !(await consumeDiscountCode(tx, appliedCode))) {
        throw new Error('DISCOUNT_CODE_EXPIRED')
      }

      const ord = await tx.order.create({
        data: {
          code, customerId, type, title,
          price: basePrice, discount: discountAmount, total: finalTotal,
          discountCode: appliedCode,
          status: 'new',
          note: note || null,
          items: { create: [{ itemType: 'service', itemName, qty: 1, unitPrice: basePrice, subtotal: finalTotal }] },
          payments: { create: { amount: finalTotal, method: 'bank', status: 'pending' } },
        },
      })
      return ord
    }, { timeout: 15000 }).catch(e => {
      if (e instanceof Error && e.message === 'DISCOUNT_CODE_EXPIRED') return null
      throw e
    })

    if (!order) {
      return NextResponse.json({ error: 'Mã giảm giá đã hết lượt sử dụng hoặc hết hạn, vui lòng thử lại.' }, { status: 409 })
    }
    return NextResponse.json({ ok: true, code: order.code, orderId: order.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng' }, { status: 500 })
  }
}

// ── Giỏ hàng nhiều sản phẩm — dùng OrderItem có sẵn trong schema, mỗi item lưu slug vào `note`
// để /api/download và /api/orders/[code]/status đọc lại chính xác (không phụ thuộc regex title). ──
async function handleCartOrder(
  cartItems: CartItemInput[],
  info: { name: string; phone: string; email?: string; note?: string; discountCode?: string },
  session: AccountSessionPayload | null
) {
  try {
    const { name, phone, email, note, discountCode: rawCode } = info

    const slugs = cartItems.map(i => i.slug)
    const templates = await prisma.template.findMany({
      where: { slug: { in: slugs } },
      select: { slug: true, name: true, price: true, websitePrice: true, hasWebsite: true },
    })
    const bySlug = new Map(templates.map(t => [t.slug, t]))

    const resolvedItems = cartItems.map(ci => {
      const tmpl = bySlug.get(ci.slug)
      const wantsWebsite = ci.purchaseType === 'website' && !!tmpl?.hasWebsite && !!tmpl?.websitePrice
      const unitPrice = wantsWebsite ? Number(tmpl!.websitePrice) : (tmpl ? Number(tmpl.price) : 0)
      return {
        slug: ci.slug,
        name: tmpl?.name || ci.slug,
        type: (wantsWebsite ? 'website' : 'template') as 'template' | 'website',
        unitPrice,
      }
    })

    const basePrice = resolvedItems.reduce((sum, i) => sum + i.unitPrice, 0)
    if (basePrice <= 0) {
      return NextResponse.json({ error: 'Không xác định được giá sản phẩm trong giỏ hàng' }, { status: 400 })
    }

    const type: 'template' | 'website' = resolvedItems.some(i => i.type === 'website') ? 'website' : 'template'
    const names = resolvedItems.map(i => i.name)
    const title = names.length <= 2 ? names.join(', ') : `${names.slice(0, 2).join(', ')} +${names.length - 2} sản phẩm khác`

    // ── Áp dụng mã giảm giá trên tổng giỏ hàng ──
    let discountAmount = 0
    let finalTotal = basePrice
    let appliedCode: string | null = null

    if (rawCode) {
      const dc = await prisma.discountCode.findUnique({ where: { code: rawCode.trim().toUpperCase() } })
      if (dc && dc.isActive && (!dc.expiresAt || dc.expiresAt > new Date()) && (dc.maxUses === null || dc.usedCount < dc.maxUses)) {
        discountAmount = calcDiscountAmount(dc.type, Number(dc.value), basePrice)
        finalTotal = Math.max(0, basePrice - discountAmount)
        appliedCode = dc.code
      }
    }

    const now = new Date()
    const code = generateOrderCode()
    const orderItemsData = resolvedItems.map(i => ({
      itemType: i.type, itemName: i.name, qty: 1, unitPrice: i.unitPrice, subtotal: i.unitPrice, note: i.slug,
    }))

    // ── Đơn miễn phí 100% ──
    if (finalTotal === 0) {
      const downloadToken  = randomUUID()
      const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 3600 * 1000)

      const order = await prisma.$transaction(async (tx) => {
        const customerId = await resolveCustomerId(tx, session, { name, phone, email })

        if (appliedCode && !(await consumeDiscountCode(tx, appliedCode))) {
          throw new Error('DISCOUNT_CODE_EXPIRED')
        }

        const ord = await tx.order.create({
          data: {
            code, customerId, type, title,
            price: basePrice, discount: discountAmount, total: 0,
            discountCode: appliedCode, status: 'confirmed', paidAt: now,
            downloadToken, tokenExpiresAt, tokenUsedCount: 0, note: note || null,
            items: { create: orderItemsData.map(it => ({ ...it, subtotal: 0 })) },
            payments: { create: { amount: 0, method: 'bank', status: 'paid', paidAt: now } },
          },
        })
        await tx.revenue.create({
          data: { orderId: ord.id, amount: 0, month: now.getMonth() + 1, year: now.getFullYear(), note: `Giỏ hàng miễn phí${appliedCode ? ` — mã ${appliedCode}` : ''}` },
        })
        return ord
      }, { timeout: 15000 }).catch(e => {
        if (e instanceof Error && e.message === 'DISCOUNT_CODE_EXPIRED') return null
        throw e
      })

      if (!order) {
        return NextResponse.json({ error: 'Mã giảm giá đã hết lượt sử dụng hoặc hết hạn, vui lòng thử lại.' }, { status: 409 })
      }
      return NextResponse.json({ ok: true, code: order.code, orderId: order.id })
    }

    // ── Đơn thường (chờ thanh toán) ──
    const order = await prisma.$transaction(async (tx) => {
      const customerId = await resolveCustomerId(tx, session, { name, phone, email })

      if (appliedCode && !(await consumeDiscountCode(tx, appliedCode))) {
        throw new Error('DISCOUNT_CODE_EXPIRED')
      }

      const ord = await tx.order.create({
        data: {
          code, customerId, type, title,
          price: basePrice, discount: discountAmount, total: finalTotal,
          discountCode: appliedCode, status: 'new', note: note || null,
          items: { create: orderItemsData },
          payments: { create: { amount: finalTotal, method: 'bank', status: 'pending' } },
        },
      })
      return ord
    }, { timeout: 15000 }).catch(e => {
      if (e instanceof Error && e.message === 'DISCOUNT_CODE_EXPIRED') return null
      throw e
    })

    if (!order) {
      return NextResponse.json({ error: 'Mã giảm giá đã hết lượt sử dụng hoặc hết hạn, vui lòng thử lại.' }, { status: 409 })
    }
    return NextResponse.json({ ok: true, code: order.code, orderId: order.id })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Lỗi tạo đơn hàng' }, { status: 500 })
  }
}
