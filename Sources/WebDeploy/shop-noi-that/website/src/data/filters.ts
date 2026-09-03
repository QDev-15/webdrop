// Danh sách tham chiếu cố định — khớp nguyên văn assets/js/products-data.js của template gốc.
// Đây là facet cấp catalog (không phải entity CRUD riêng) nên không cần bảng DB — sản phẩm
// chỉ lưu SLUG (material/room) hoặc "Tên:#hex" (colors) rồi tra cứu label/hex tại đây.

export const MATERIALS = [
  { slug: 'go-tu-nhien', name: 'Gỗ tự nhiên' },
  { slug: 'go-cong-nghiep', name: 'Gỗ công nghiệp' },
  { slug: 'kim-loai', name: 'Kim loại' },
  { slug: 'vai-boc', name: 'Vải bọc' },
  { slug: 'da', name: 'Da' },
  { slug: 'may-tre', name: 'Mây tre đan' },
  { slug: 'khac', name: 'Khác' },
]

export const COLOR_SWATCHES = [
  { name: 'Nâu gỗ', hex: '#8b5e3c' },
  { name: 'Trắng kem', hex: '#f3ece1' },
  { name: 'Đen', hex: '#242424' },
  { name: 'Xám', hex: '#9a9691' },
  { name: 'Be', hex: '#d8c7ac' },
  { name: 'Xanh rêu', hex: '#5c6b4f' },
]

export const ROOMS = [
  { slug: 'phong-khach', name: 'Phòng khách' },
  { slug: 'phong-an', name: 'Phòng ăn' },
  { slug: 'phong-ngu', name: 'Phòng ngủ' },
  { slug: 'phong-lam-viec', name: 'Phòng làm việc' },
  { slug: 'ban-cong-san-vuon', name: 'Ban công & sân vườn' },
]

export const MAX_PRICE = 18000000 // trần slider — khớp template gốc

export function materialName(slug: string): string {
  return MATERIALS.find(m => m.slug === slug)?.name ?? slug
}

export function roomName(slug: string): string {
  return ROOMS.find(r => r.slug === slug)?.name ?? slug
}

// products.colors lưu "Tên:#hex" (1 phần tử) — tách lấy tên + hex để vẽ swatch.
export function parseProductColor(colors: string): { name: string; hex: string } | null {
  const first = (colors || '').split('|')[0]
  if (!first) return null
  const [name, hex] = first.split(':')
  if (!name) return null
  return { name, hex: hex || COLOR_SWATCHES.find(c => c.name === name)?.hex || '#8b5e3c' }
}

export function fmtVND(n: number): string {
  return n.toLocaleString('vi-VN') + '₫'
}
