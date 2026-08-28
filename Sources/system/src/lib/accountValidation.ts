// Validation/normalization dùng chung cho toàn bộ route /api/account/* — tránh lệch chuẩn
// giữa register/login/profile (vd SĐT có khoảng trắng lúc đăng ký nhưng không có lúc đăng nhập).

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_RE = /^(0|\+84)[0-9]{9,10}$/

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s.-]/g, '')
}
