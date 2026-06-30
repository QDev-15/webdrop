import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function calcDiscount(type: string, value: number, price: number): number {
  if (type === 'percent') return Math.round(price * Math.min(value, 100) / 100)
  return Math.min(value, price) // fixed — không giảm quá giá gốc
}

export async function POST(req: NextRequest) {
  try {
    const { code, price } = await req.json()
    if (!code || typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
    }

    const dc = await prisma.discountCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    })

    if (!dc) return NextResponse.json({ error: 'Mã khuyến mại không tồn tại' }, { status: 404 })
    if (!dc.isActive) return NextResponse.json({ error: 'Mã này đã bị vô hiệu hóa' }, { status: 400 })
    if (dc.expiresAt && dc.expiresAt < new Date()) return NextResponse.json({ error: 'Mã này đã hết hạn' }, { status: 400 })
    if (dc.maxUses !== null && dc.usedCount >= dc.maxUses) return NextResponse.json({ error: 'Mã này đã hết lượt sử dụng' }, { status: 400 })

    const discountAmount = calcDiscount(dc.type, Number(dc.value), price)
    const finalPrice = Math.max(0, price - discountAmount)

    return NextResponse.json({
      ok: true,
      code: dc.code,
      type: dc.type,
      value: Number(dc.value),
      discountAmount,
      finalPrice,
      isFree: finalPrice === 0,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
