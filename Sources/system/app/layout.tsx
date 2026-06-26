import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import Script from 'next/script'
import { prisma } from '@/lib/prisma'
import '../src/styles/globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--sans',
})

const BASE = process.env.NEXT_PUBLIC_URL || 'https://webdrop.store'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a6b52',
}

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl: string | undefined
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'site_favicon' } })
    faviconUrl = row?.value?.trim() || undefined
  } catch { /* use default */ }

  const title = 'webdrop.store — Mẫu web đẹp, triển khai trọn gói'
  const desc  = 'Hơn 30 mẫu website Bootstrap 5 đẹp cho mọi ngành. Bàn giao website hoàn chỉnh React + Admin trong 3–5 ngày làm việc.'

  return {
    metadataBase: new URL(BASE),
    title:        { default: title, template: '%s — webdrop.store' },
    description:  desc,
    robots:       { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
    openGraph: {
      type:        'website',
      locale:      'vi_VN',
      url:         BASE,
      siteName:    'webdrop.store',
      title,
      description: desc,
      images:      [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'webdrop.store' }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description: desc,
      images:      ['/og-default.jpg'],
    },
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
  }
}

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type':    'Organization',
  name:       'webdrop.store',
  url:        BASE,
  logo:       `${BASE}/logo.png`,
  description: 'Cung cấp mẫu website đẹp và dịch vụ triển khai website trọn gói cho doanh nghiệp Việt Nam.',
  contactPoint: {
    '@type':            'ContactPoint',
    contactType:        'customer support',
    availableLanguage:  'Vietnamese',
  },
  address: {
    '@type':          'PostalAddress',
    addressCountry:   'VN',
    addressLocality:  'Hà Nội',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let gaId: string | null = null
  try {
    const row = await prisma.setting.findUnique({ where: { key: 'google_analytics_id' } })
    gaId = row?.value?.trim() || null
  } catch { /* skip if DB unavailable */ }

  return (
    <html lang="vi">
      <body className={dmSans.variable} suppressHydrationWarning>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
