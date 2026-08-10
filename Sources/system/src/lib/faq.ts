// FAQ constants shared across admin UI and API

export const FAQ_GROUPS = [
  'mua-tai-template',
  'goi-web-co-ban',
  'goi-theo-yeu-cau',
  'thanh-toan-bao-hanh',
] as const

export const FAQ_GROUP_LABELS: Record<string, string> = {
  'mua-tai-template': 'Mua & Tải Template',
  'goi-web-co-ban': 'Gói Web Cơ Bản',
  'goi-theo-yeu-cau': 'Gói Theo Yêu Cầu',
  'thanh-toan-bao-hanh': 'Thanh Toán & Bảo Hành',
}

export function isValidFaqGroup(groupKey: unknown): groupKey is (typeof FAQ_GROUPS)[number] {
  return typeof groupKey === 'string' && FAQ_GROUPS.includes(groupKey as any)
}
