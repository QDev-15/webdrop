import { prisma } from '@/lib/prisma'

const DEFAULT_BANK = {
  bankName:    'MB Bank',
  bankCode:    'MB',
  accountNo:   '0988632841',
  accountName: 'NGUYEN HUU QUYNH',
}

const BANK_INFO_KEYS = ['sepay_bank_name', 'sepay_bank_code', 'sepay_account_no', 'sepay_account_name'] as const

export interface SepayBankInfo {
  bankName: string
  bankCode: string
  accountNo: string
  accountName: string
}

export async function getSepayApiKey(): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key: 'sepay_api_key' } })
  return row?.value || process.env.SEPAY_API_KEY || ''
}

export async function getSepayBankInfo(): Promise<SepayBankInfo> {
  const rows = await prisma.setting.findMany({ where: { key: { in: [...BANK_INFO_KEYS] } } })
  const map = Object.fromEntries(rows.map(r => [r.key, r.value || '']))
  const configured = {
    bankName:    map.sepay_bank_name    || '',
    bankCode:    map.sepay_bank_code    || '',
    accountNo:   map.sepay_account_no   || '',
    accountName: map.sepay_account_name || '',
  }
  // Chỉ dùng cấu hình trong DB khi ĐỦ cả 4 trường — tránh trộn lẫn 1 phần
  // giá trị mới với default cũ (VD: đổi bank_code nhưng quên đổi account_no).
  const isFullyConfigured = Object.values(configured).every(v => v !== '')
  return isFullyConfigured ? configured : { ...DEFAULT_BANK }
}

interface SepayBankAccount {
  bank_short_name?: string
  bank_code?: string
  account_number?: string
  account_holder_name?: string
  active?: string | number
}

interface SepayBankAccountsResponse {
  bankaccounts?: SepayBankAccount[]
}

// Gọi API chính chủ của SePay để lấy tài khoản ngân hàng đã liên kết với API Access token
// hiện có — tránh phải nhập tay số TK/tên NH/tên chủ TK trong admin.
export async function fetchSepayBankAccounts(apiKey: string): Promise<SepayBankInfo[]> {
  const res = await fetch('https://my.sepay.vn/userapi/bankaccounts/list', {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`SePay API trả về lỗi HTTP ${res.status}`)
  }

  const data = await res.json() as SepayBankAccountsResponse
  const all = data.bankaccounts ?? []
  // Bỏ tài khoản đã ngừng liên kết (active === '0') — chỉ đồng bộ tài khoản còn hoạt động.
  const accounts = all.filter(a => String(a.active ?? '1') !== '0')
  if (accounts.length === 0) {
    throw new Error('Tài khoản SePay chưa liên kết ngân hàng nào đang hoạt động')
  }

  return accounts.map(a => ({
    bankName:    a.bank_short_name || a.bank_code || '',
    bankCode:    a.bank_code || a.bank_short_name || '',
    accountNo:   a.account_number || '',
    accountName: a.account_holder_name || '',
  }))
}
