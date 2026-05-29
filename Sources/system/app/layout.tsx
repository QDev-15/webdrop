import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import '../src/styles/globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--sans',
})

export const metadata: Metadata = {
  title: 'webdrop.vn — Mẫu web đẹp, triển khai trọn gói',
  description: 'Hơn 30 mẫu thiết kế hiện đại cho mọi ngành nghề. Thanh toán xong — website hoàn chỉnh trong 3–5 ngày làm việc.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={dmSans.variable} suppressHydrationWarning>{children}</body>
    </html>
  )
}
