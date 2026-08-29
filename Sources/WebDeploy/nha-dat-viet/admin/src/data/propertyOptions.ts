// Danh mục dùng chung cho Property List/Form — khớp đúng nhãn/khoá dùng ở website (rule 1a).

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
  '': 'Không gắn nhãn', 'moi': 'Mới đăng', 'hot': 'Hot', 'da-ban': 'Đã giao dịch', 'dang-giao-dich': 'Đang giao dịch',
}

export const DISTRICTS: { code: string; name: string }[] = [
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
