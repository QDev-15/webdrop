import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { fetchSepayBankAccounts } from '@/lib/sepay'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'superadmin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({})) as { apiKey?: string }
  const apiKey = (body.apiKey || '').trim()
  if (!apiKey) {
    return NextResponse.json({ error: 'Chưa nhập SePay API Access' }, { status: 400 })
  }

  try {
    const accounts = await fetchSepayBankAccounts(apiKey)
    const [account] = accounts
    const warning = accounts.length > 1
      ? `Tài khoản SePay có ${accounts.length} ngân hàng đang liên kết — đã chọn tài khoản đầu tiên (${account.bankName} ${account.accountNo}), kiểm tra lại nếu không đúng.`
      : undefined
    return NextResponse.json({ ok: true, bank: account, warning })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Không kết nối được với SePay'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
