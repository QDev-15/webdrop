export function fmt(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ'
}

export function stars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(Math.max(0, 5 - full - half))
}

export const BADGE_LABEL: Record<string, string> = { hot: 'HOT', sale: 'SALE', new: 'MỚI' }

export const CATEGORY_LABEL: Record<string, string> = {
  'dien-thoai': 'Điện thoại',
  'tai-nghe': 'Tai nghe',
  'sac-cap': 'Sạc & Cáp',
  'op-lung': 'Ốp lưng & Phụ kiện',
}
