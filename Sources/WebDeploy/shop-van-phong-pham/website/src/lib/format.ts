export function fmt(n: number): string {
  return n.toLocaleString('vi-VN') + '₫'
}

export function stars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(Math.max(0, 5 - full - half))
}

export const CATEGORY_LABEL: Record<string, string> = {
  'but-viet': 'Bút viết',
  'so-tay': 'Sổ tay & giấy note',
  'file-kep': 'File & kẹp tài liệu',
  'dung-cu': 'Dụng cụ văn phòng',
  'balo-tui': 'Balo & túi laptop',
}

export const CATEGORY_LABEL_SHORT: Record<string, string> = {
  'but-viet': 'Bút',
  'so-tay': 'Sổ tay',
  'file-kep': 'File',
  'dung-cu': 'Dụng cụ',
  'balo-tui': 'Balo',
}
