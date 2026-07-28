import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { fetchLatestTelegramChat } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({})) as { botToken?: string }
  const botToken = (body.botToken || '').trim()
  if (!botToken) {
    return NextResponse.json({ error: 'Chưa nhập Bot Token' }, { status: 400 })
  }

  try {
    const chat = await fetchLatestTelegramChat(botToken)
    if (!chat) {
      return NextResponse.json({ error: 'Chưa tìm thấy tin nhắn nào — mở Telegram, bấm Start (hoặc nhắn bất kỳ tin gì) cho bot rồi thử lại.' }, { status: 404 })
    }
    return NextResponse.json({ ok: true, chatId: chat.chatId, name: chat.name })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Không kết nối được với Telegram'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
