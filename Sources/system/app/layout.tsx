import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--sans',
})

export const metadata: Metadata = {
  title: 'webdrop.vn',
  description: 'Template & Website Business',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={dmSans.variable}>{children}</body>
    </html>
  )
}
