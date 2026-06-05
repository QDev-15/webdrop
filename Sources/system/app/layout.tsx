import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { prisma } from '@/lib/prisma'
import '../src/styles/globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--sans',
})

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl: string | undefined
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'site_favicon' } })
    faviconUrl = row?.value?.trim() || undefined
  } catch { /* use default */ }

  return {
    title: {
      default: 'webdrop.vn — Mẫu web đẹp, triển khai trọn gói',
      template: '%s',
    },
    description: 'Hơn 30 mẫu thiết kế hiện đại cho mọi ngành nghề. Thanh toán xong — website hoàn chỉnh trong 3–5 ngày làm việc.',
    ...(faviconUrl && { icons: { icon: faviconUrl } }),
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={dmSans.variable} suppressHydrationWarning>{children}</body>
    </html>
  )
}
