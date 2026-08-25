export interface UnitType {
  id: number
  name: string
  slug: string
  type_tag: string
  bedrooms: number
  bathrooms: number
  area: number
  price_from: number
  direction: string
  floor_range: string
  block: string
  view_desc: string
  status: string
  badge: string
  floor_plan_image: string
  gallery: string[]
  description: string
  features: string[]
  is_featured: number
  sort_order: number
}

export const DIRECTION_LABELS: Record<string, string> = {
  'dong': 'Đông', 'tay': 'Tây', 'nam': 'Nam', 'bac': 'Bắc',
  'dong-nam': 'Đông Nam', 'tay-nam': 'Tây Nam',
  'dong-bac': 'Đông Bắc', 'tay-bac': 'Tây Bắc',
  'dong-nam-tay-bac': 'Đông Nam & Tây Bắc (2 mặt thoáng)',
}

export const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  'con-hang': { label: 'Còn hàng', cls: 'ok' },
  'sap-mo-ban': { label: 'Sắp mở bán', cls: 'soon' },
  'het-hang': { label: 'Hết hàng', cls: 'sold' },
}

export const TYPE_LABELS: Record<string, string> = {
  '1pn': '1PN', '2pn': '2PN', '3pn': '3PN', 'duplex': 'Duplex', 'penthouse': 'Penthouse',
}

// Định dạng tiền tệ kiểu Việt Nam — giữ đúng thuật toán từ template gốc (units-data.js)
export function formatVND(value: number): string {
  if (value >= 1e9) {
    const v = Math.round((value / 1e9) * 100) / 100
    return (v % 1 === 0 ? v.toFixed(0) : v.toFixed(2).replace(/0$/, '')) + ' tỷ'
  }
  if (value >= 1e6) return Math.round(value / 1e6) + ' triệu'
  return value.toLocaleString('vi-VN') + ' đ'
}

export function formatFullVND(value: number): string {
  return Math.round(value).toLocaleString('vi-VN') + ' đ'
}

// Tính trả góp hàng tháng (amortization chuẩn) — giữ đúng thuật toán từ template gốc
export function calcMonthlyPayment(loanAmount: number, annualRatePercent: number, years: number): number {
  const r = (annualRatePercent / 100) / 12
  const n = years * 12
  if (n <= 0) return 0
  if (r === 0) return loanAmount / n
  return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// Parse "min-max" hoặc "n" thành khoảng tầng
export function parseFloorRange(str: string): [number, number] {
  const parts = String(str).split('-').map(Number)
  if (parts.length === 1) return [parts[0], parts[0]]
  return [parts[0], parts[1]]
}

// Lấy loại căn tương tự (round-robin theo typeTag, fallback toàn bộ) — giữ đúng thuật toán template gốc
export function getRelatedUnits(all: UnitType[], current: UnitType, count = 3): UnitType[] {
  let pool = all.filter(u => u.slug !== current.slug && u.type_tag === current.type_tag)
  if (pool.length < count) {
    const rest = all.filter(u => u.slug !== current.slug && u.type_tag !== current.type_tag)
    pool = pool.concat(rest)
  }
  return pool.slice(0, count)
}
