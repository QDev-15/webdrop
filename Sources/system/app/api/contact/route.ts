import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, service, message } = await req.json()
    if (!name || !phone) return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })

    await prisma.contact.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        subject: service || 'Liên hệ từ website',
        message: message || '',
        status: 'new',
      },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
