// Danh sách tham chiếu cố định — khớp nguyên văn assets/js/products-data.js của template gốc
// (CATEGORY_LABELS/MATERIAL_LABELS/STYLE_LABELS/THEME_LABELS). Facet cấp catalog, không cần
// bảng DB riêng — sản phẩm chỉ lưu slug rồi tra cứu label tại đây.

export const CATEGORY_LABELS: Record<string, string> = { nam: 'Đồng hồ Nam', nu: 'Đồng hồ Nữ', unisex: 'Unisex' }

export const MATERIALS = [
  { slug: 'da', name: 'Dây da' },
  { slug: 'kim-loai', name: 'Dây kim loại' },
  { slug: 'cao-su', name: 'Dây cao su' },
  { slug: 'vai', name: 'Dây vải (NATO)' },
]

export const STYLES = [
  { slug: 'co-dien', name: 'Cổ điển' },
  { slug: 'the-thao', name: 'Thể thao' },
  { slug: 'sang-trong', name: 'Sang trọng' },
  { slug: 'smartwatch', name: 'Smartwatch' },
]

export const BRANDS = ['CASIO', 'SEIKO', 'CITIZEN', 'ORIENT', 'TISSOT', 'FOSSIL', 'MVMT', 'TIMEX', 'LONGINES', 'DANIEL WELLINGTON']

export const MAX_PRICE = 45000000 // trần slider — khớp template gốc (san-pham.html)

export function materialName(slug: string): string {
  return MATERIALS.find(m => m.slug === slug)?.name ?? slug
}

export function styleName(slug: string): string {
  return STYLES.find(s => s.slug === slug)?.name ?? slug
}

export function fmtVND(n: number): string {
  return n.toLocaleString('vi-VN') + '₫'
}
