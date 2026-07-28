import { prisma } from '@/lib/prisma'

interface TelegramConfig {
  botToken: string
  chatId: string
}

async function getTelegramConfig(): Promise<TelegramConfig | null> {
  const rows = await prisma.setting.findMany({ where: { key: { in: ['telegram_bot_token', 'telegram_chat_id'] } } })
  const map = Object.fromEntries(rows.map(r => [r.key, r.value?.trim() || '']))
  const botToken = map['telegram_bot_token']
  const chatId   = map['telegram_chat_id']
  if (!botToken || !chatId) return null
  return { botToken, chatId }
}

// Gửi thông báo tới Telegram của chủ site — dùng khi có liên hệ mới từ website.
// Không throw ra ngoài — lỗi Telegram không được làm hỏng luồng chính (lưu contact vẫn phải thành công).
export async function sendTelegramNotification(text: string): Promise<void> {
  const config = await getTelegramConfig()
  if (!config) return

  try {
    await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: config.chatId, text, parse_mode: 'HTML' }),
    })
  } catch (e) {
    console.error('[telegram] sendTelegramNotification failed:', e)
  }
}

// Tự động dò chat_id từ tin nhắn gần nhất chủ site gửi cho bot (yêu cầu đã bấm Start / nhắn ít nhất 1 lần).
export async function fetchLatestTelegramChat(botToken: string): Promise<{ chatId: string; name: string } | null> {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=1&offset=-1`)
  if (!res.ok) throw new Error(`Telegram API lỗi (${res.status}) — kiểm tra lại Bot Token`)

  const data = await res.json()
  if (!data.ok) throw new Error(data.description || 'Telegram API từ chối request')

  const updates = data.result as Array<{ message?: { chat: { id: number; first_name?: string; username?: string } } }>
  const latest = updates[updates.length - 1]?.message
  if (!latest) return null

  const name = latest.chat.first_name || latest.chat.username || 'Không rõ tên'
  return { chatId: String(latest.chat.id), name }
}
