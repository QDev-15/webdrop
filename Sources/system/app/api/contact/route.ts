import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification } from '@/lib/telegram'

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

    sendTelegramNotification(
      `📩 <b>Liên hệ mới từ website</b>\n👤 ${name}\n📞 ${phone}` +
      (email ? `\n✉️ ${email}` : '') +
      (service ? `\n📋 ${service}` : '') +
      `\n💬 ${message || '(không có nội dung)'}`
    ).catch(() => {})

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
