// Chuẩn hoá slug admin tự nhập về lowercase-kebab. Query tra slug trong toàn hệ thống đã
// đổi sang case-insensitive (mode: 'insensitive'), nhưng constraint @unique trong Postgres
// vẫn phân biệt hoa/thường — nếu không ép lowercase lúc tạo, admin có thể vô tình tạo 2
// record khác nhau chỉ lệch case (vd "Shop-A" và "shop-a"), khiến findFirst/findUnique
// chọn nhầm record khi tra theo slug không phân biệt hoa/thường.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
