// Nhãn hiển thị + danh mục khu vực — khớp 1-1 với dữ liệu seed trong Database.php (rule 1a).

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  'chung-cu': 'Căn hộ chung cư',
  'nha-pho': 'Nhà phố',
  'dat-nen': 'Đất nền',
  'biet-thu': 'Biệt thự',
  'shophouse': 'Shophouse',
  'can-ho-dich-vu': 'Căn hộ dịch vụ',
}

export const DIRECTION_LABELS: Record<string, string> = {
  'dong': 'Đông', 'tay': 'Tây', 'nam': 'Nam', 'bac': 'Bắc',
  'dong-nam': 'Đông Nam', 'dong-bac': 'Đông Bắc', 'tay-nam': 'Tây Nam', 'tay-bac': 'Tây Bắc',
}

export const LEGAL_LABELS: Record<string, string> = {
  'so-do': 'Sổ đỏ', 'so-hong': 'Sổ hồng',
  'hop-dong-mua-ban': 'Hợp đồng mua bán', 'dang-cho-so': 'Đang chờ sổ',
}

export const FURNISHING_LABELS: Record<string, string> = {
  'day-du': 'Đầy đủ nội thất', 'co-ban': 'Nội thất cơ bản', 'tho': 'Nhà thô / đất trống',
}

export const BADGE_LABELS: Record<string, string> = {
  'moi': 'Mới đăng', 'hot': 'Hot', 'da-ban': 'Đã giao dịch', 'dang-giao-dich': 'Đang giao dịch',
}

export interface District { code: string; name: string }

export const DISTRICTS: District[] = [
  { code: 'quan-1', name: 'Quận 1' },
  { code: 'quan-3', name: 'Quận 3' },
  { code: 'quan-4', name: 'Quận 4' },
  { code: 'quan-7', name: 'Quận 7' },
  { code: 'quan-8', name: 'Quận 8' },
  { code: 'quan-10', name: 'Quận 10' },
  { code: 'quan-12', name: 'Quận 12' },
  { code: 'binh-thanh', name: 'Bình Thạnh' },
  { code: 'phu-nhuan', name: 'Phú Nhuận' },
  { code: 'tan-binh', name: 'Tân Bình' },
  { code: 'go-vap', name: 'Gò Vấp' },
  { code: 'nha-be', name: 'Nhà Bè' },
  { code: 'thu-duc', name: 'TP. Thủ Đức' },
  { code: 'binh-chanh', name: 'Bình Chánh' },
  { code: 'cu-chi', name: 'Củ Chi' },
]

export function districtLabel(code: string): string {
  return DISTRICTS.find(d => d.code === code)?.name ?? code
}

export interface PriceRange { value: string; label: string; min: number; max: number }

export const PRICE_RANGES_BAN: PriceRange[] = [
  { value: 'lt2', label: 'Dưới 2 tỷ', min: 0, max: 2e9 },
  { value: '2-5', label: '2 - 5 tỷ', min: 2e9, max: 5e9 },
  { value: '5-10', label: '5 - 10 tỷ', min: 5e9, max: 10e9 },
  { value: '10-20', label: '10 - 20 tỷ', min: 10e9, max: 20e9 },
  { value: 'gt20', label: 'Trên 20 tỷ', min: 20e9, max: Infinity },
]

export const PRICE_RANGES_THUE: PriceRange[] = [
  { value: 'lt5', label: 'Dưới 5 triệu/tháng', min: 0, max: 5e6 },
  { value: '5-10', label: '5 - 10 triệu/tháng', min: 5e6, max: 10e6 },
  { value: '10-20', label: '10 - 20 triệu/tháng', min: 10e6, max: 20e6 },
  { value: 'gt20', label: 'Trên 20 triệu/tháng', min: 20e6, max: Infinity },
]

export interface AreaRange { value: string; label: string; min: number; max: number }

export const AREA_RANGES: AreaRange[] = [
  { value: 'lt50', label: 'Dưới 50m²', min: 0, max: 50 },
  { value: '50-80', label: '50 - 80m²', min: 50, max: 80 },
  { value: '80-120', label: '80 - 120m²', min: 80, max: 120 },
  { value: 'gt120', label: 'Trên 120m²', min: 120, max: Infinity },
]

export function formatPrice(value: number, unit: string): string {
  if (unit === 'tỷ') return (value / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ'
  if (unit === 'triệu') return Math.round(value / 1e6).toLocaleString('vi-VN') + ' triệu'
  if (unit === 'triệu/tháng') return Math.round(value / 1e6).toLocaleString('vi-VN') + ' triệu/tháng'
  if (unit === 'đ/tháng') return Math.round(value).toLocaleString('vi-VN') + ' đ/tháng'
  return value.toLocaleString('vi-VN') + ' đ'
}

export function formatVND(n: number): string {
  return Math.round(n).toLocaleString('vi-VN')
}

export function nearbyAmenities(districtName: string): string[] {
  return [
    `Chợ dân sinh khu vực ${districtName} — khoảng 500m`,
    `Trường tiểu học / THCS lân cận — khoảng 700m`,
    `Siêu thị / cửa hàng tiện lợi — khoảng 900m`,
    `Bệnh viện, phòng khám khu vực — khoảng 1.2km`,
    `Tuyến xe buýt công cộng — khoảng 300m`,
  ]
}

export function calcMonthlyPayment(loanAmount: number, annualRatePercent: number, years: number): number {
  const r = (annualRatePercent / 100) / 12
  const n = years * 12
  if (r === 0) return loanAmount / n
  return loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
}
