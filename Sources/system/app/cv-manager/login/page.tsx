import { redirect } from 'next/navigation'
import { getAccountSession } from '@/lib/auth'

export const metadata = { title: 'Đăng nhập — webdrop.store' }

// CV Manager giờ dùng chung hệ thống tài khoản khách hàng (/login) — trang này chỉ còn
// tác dụng điều hướng cho các link cũ trỏ vào /cv-manager/login.
export default async function CvLoginPage() {
  const session = await getAccountSession()
  redirect(session ? '/cv-manager/edit' : '/login?redirect=/cv-manager/edit')
}
