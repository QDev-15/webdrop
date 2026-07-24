export function fmtPrice(n: number): string {
  return n.toLocaleString('vi-VN') + '₫'
}

export const CAT_LABELS: Record<string, string> = {
  'ao-thun': 'Áo Thun',
  'ao-so-mi': 'Áo Sơ Mi',
  'quan-jean': 'Quần Jean',
  'vay-dam': 'Váy & Đầm',
  'ao-khoac': 'Áo Khoác',
}

export const BADGE_LABELS: Record<string, string> = { hot: 'Nổi bật', new: 'Mới', sale: 'Giảm giá' }

export function catLabel(slug: string): string {
  return CAT_LABELS[slug] || slug
}

export function badgeLabel(b: string): string {
  return BADGE_LABELS[b] || b
}

// colors lưu dạng "Tên:#hex" (mỗi sản phẩm AMI chỉ có đúng 1 màu) — tách ra { name, hex }.
export function parseColor(colors: string): { name: string; hex: string } | null {
  if (!colors) return null
  const [name, hex] = colors.split(':')
  if (!name) return null
  return { name, hex: hex || '#ccc' }
}

// sizes/theme lưu dạng padded pipe "|XS|S|M|" — tách thành mảng sạch.
export function parsePadded(v: string): string[] {
  return (v || '').split('|').map(s => s.trim()).filter(Boolean)
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'%3E%3Crect width='600' height='800' fill='%23f0ede8'/%3E%3C/svg%3E"

export function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.onerror = null
  e.currentTarget.src = PLACEHOLDER_IMG
}
