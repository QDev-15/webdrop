// Hằng số + helper dùng chung cho toàn bộ trang liên quan tới bất động sản —
// port 1:1 từ assets/js/properties-data.js của template gốc.

export interface Listing {
  id: number
  account_id: number
  title: string
  slug: string
  listing_type: 'ban' | 'cho-thue'
  property_type: string
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  direction: string
  legal_status: string
  furnishing: string
  district: string
  city: string
  address: string
  lat: number
  lng: number
  description: string
  features: string[]
  images: string[]
  tier: string
  status: string
  posted_at: string
  expires_at: string
  created_at: string
  badge: 'moi' | 'hot' | null
  poster: { name: string; role: string; phone: string; avatar: string; slug: number | null }
}

export const TYPE_LABELS: Record<string, string> = {
  'chung-cu': 'Chung cư', 'nha-pho': 'Nhà phố', 'dat-nen': 'Đất nền',
  'biet-thu': 'Biệt thự', 'shophouse': 'Shophouse', 'can-ho-dich-vu': 'Căn hộ dịch vụ',
}
export const DIRECTION_LABELS: Record<string, string> = {
  dong: 'Đông', tay: 'Tây', nam: 'Nam', bac: 'Bắc',
  'dong-nam': 'Đông Nam', 'dong-bac': 'Đông Bắc', 'tay-nam': 'Tây Nam', 'tay-bac': 'Tây Bắc',
}
export const LEGAL_LABELS: Record<string, string> = {
  'so-do': 'Sổ đỏ', 'so-hong': 'Sổ hồng', 'hop-dong-mua-ban': 'Hợp đồng mua bán', 'dang-cho-so': 'Đang chờ sổ',
}
export const FURNISHING_LABELS: Record<string, string> = { 'day-du': 'Đầy đủ nội thất', 'co-ban': 'Nội thất cơ bản', 'tho': 'Nhà thô' }
export const ROLE_LABELS: Record<string, string> = { 'moi-gioi-tu-do': 'Môi giới tự do', 'chinh-chu': 'Chính chủ', 'cong-ty-moi-gioi': 'Công ty môi giới' }
export const TIER_LABELS: Record<string, string> = { 'vip-kim-cuong': 'VIP Kim Cương', 'vip-vang': 'VIP Vàng', 'vip-bac': 'VIP Bạc', 'thuong': 'Tin thường' }
export const TIER_ORDER: Record<string, number> = { 'vip-kim-cuong': 0, 'vip-vang': 1, 'vip-bac': 2, 'thuong': 3 }

export const AREAS = [
  { slug: 'cau-giay-ha-noi', label: 'Cầu Giấy', city: 'Hà Nội' },
  { slug: 'dong-da-ha-noi', label: 'Đống Đa', city: 'Hà Nội' },
  { slug: 'hai-ba-trung-ha-noi', label: 'Hai Bà Trưng', city: 'Hà Nội' },
  { slug: 'tay-ho-ha-noi', label: 'Tây Hồ', city: 'Hà Nội' },
  { slug: 'long-bien-ha-noi', label: 'Long Biên', city: 'Hà Nội' },
  { slug: 'ha-dong-ha-noi', label: 'Hà Đông', city: 'Hà Nội' },
  { slug: 'nam-tu-liem-ha-noi', label: 'Nam Từ Liêm', city: 'Hà Nội' },
  { slug: 'quan-1-hcm', label: 'Quận 1', city: 'TP.HCM' },
  { slug: 'quan-7-hcm', label: 'Quận 7', city: 'TP.HCM' },
  { slug: 'binh-thanh-hcm', label: 'Bình Thạnh', city: 'TP.HCM' },
  { slug: 'thu-duc-hcm', label: 'TP. Thủ Đức', city: 'TP.HCM' },
  { slug: 'tan-binh-hcm', label: 'Tân Bình', city: 'TP.HCM' },
  { slug: 'hai-chau-da-nang', label: 'Hải Châu', city: 'Đà Nẵng' },
  { slug: 'son-tra-da-nang', label: 'Sơn Trà', city: 'Đà Nẵng' },
  { slug: 'ngu-hanh-son-da-nang', label: 'Ngũ Hành Sơn', city: 'Đà Nẵng' },
]

export const PRICE_RANGES_BAN = [
  { v: 'duoi-2ty', label: 'Dưới 2 tỷ', min: 0, max: 2e9 },
  { v: '2-5ty', label: '2 - 5 tỷ', min: 2e9, max: 5e9 },
  { v: '5-10ty', label: '5 - 10 tỷ', min: 5e9, max: 10e9 },
  { v: '10-20ty', label: '10 - 20 tỷ', min: 10e9, max: 20e9 },
  { v: 'tren-20ty', label: 'Trên 20 tỷ', min: 20e9, max: Infinity },
]
export const PRICE_RANGES_THUE = [
  { v: 'duoi-8tr', label: 'Dưới 8 triệu/tháng', min: 0, max: 8e6 },
  { v: '8-15tr', label: '8 - 15 triệu/tháng', min: 8e6, max: 15e6 },
  { v: '15-25tr', label: '15 - 25 triệu/tháng', min: 15e6, max: 25e6 },
  { v: 'tren-25tr', label: 'Trên 25 triệu/tháng', min: 25e6, max: Infinity },
]
export const AREA_RANGES = [
  { v: 'duoi-60', label: 'Dưới 60m²', min: 0, max: 60 },
  { v: '60-100', label: '60 - 100m²', min: 60, max: 100 },
  { v: '100-200', label: '100 - 200m²', min: 100, max: 200 },
  { v: 'tren-200', label: 'Trên 200m²', min: 200, max: Infinity },
]

export function formatPrice(vnd: number, listingType: string): string {
  if (listingType === 'cho-thue') {
    const m = vnd / 1e6
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)} triệu/tháng`
  }
  if (vnd >= 1e9) {
    const t = vnd / 1e9
    return `${t % 1 === 0 ? t.toFixed(0) : t.toFixed(1)} tỷ`
  }
  return `${Math.round(vnd / 1e6)} triệu`
}
export function formatFullVND(vnd: number): string {
  return Math.round(vnd).toLocaleString('vi-VN') + ' đ'
}
export function formatDateVN(d: string): string {
  return new Date(d).toLocaleDateString('vi-VN')
}
export function calcMonthlyPayment(loanAmount: number, annualRatePercent: number, years: number): number {
  const r = (annualRatePercent / 100) / 12
  const n = years * 12
  if (n <= 0) return 0
  if (r === 0) return loanAmount / n
  return loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
}
