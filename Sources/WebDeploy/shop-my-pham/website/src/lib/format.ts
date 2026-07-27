// Format tiền theo đúng helper mpFmt() của template gốc — dùng 'đ' (không phải '₫').
export function fmtPrice(n: number): string {
  return n.toLocaleString('vi-VN') + 'đ'
}

export const CAT_LABELS: Record<string, string> = {
  'cham-soc-da': 'Chăm Sóc Da',
  'trang-diem': 'Trang Điểm',
  'cham-soc-toc': 'Chăm Sóc Tóc',
  'nuoc-hoa': 'Nước Hoa',
  'dung-cu-lam-dep': 'Dụng Cụ Làm Đẹp',
}

export const SKIN_TYPE_LABELS: Record<string, string> = {
  'da-dau': 'Da dầu',
  'da-kho': 'Da khô',
  'da-hon-hop': 'Da hỗn hợp',
  'da-nhay-cam': 'Da nhạy cảm',
  'moi-loai-da': 'Mọi loại da',
}

export const THEME_LABELS: Record<string, string> = {
  'ban-chay': 'Bán chạy nhất',
  'hang-moi': 'Hàng mới về',
  'giam-gia': 'Đang giảm giá',
}

export const BADGE_LABELS: Record<string, string> = { hot: 'Hot', new: 'Mới', sale: 'Sale' }
export const BADGE_COLORS: Record<string, string> = { hot: '#d97706', new: '#22c55e', sale: '#e24b4a' }

export function catLabel(slug: string): string {
  return CAT_LABELS[slug] || slug
}

export function badgeLabel(b: string): string {
  return BADGE_LABELS[b] || b
}

// skin_type/theme lưu dạng padded pipe "|da-dau|da-hon-hop|" — tách thành mảng sạch.
export function parsePadded(v: string): string[] {
  return (v || '').split('|').map(s => s.trim()).filter(Boolean)
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'%3E%3Crect width='600' height='800' fill='%23f5ebe8'/%3E%3C/svg%3E"

export function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.onerror = null
  e.currentTarget.src = PLACEHOLDER_IMG
}
