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

const DEFAULT_TITLE = 'webdrop.store — Mẫu web đẹp, triển khai trọn gói'
const DEFAULT_DESC  = 'Hơn 30 mẫu website Bootstrap 5 đẹp cho mọi ngành. Bàn giao website hoàn chỉnh React + Admin trong 3–5 ngày làm việc.'

export async function generateMetadata(): Promise<Metadata> {
  let faviconUrl: string | undefined
  let title = DEFAULT_TITLE
  let desc  = DEFAULT_DESC
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ['site_favicon', 'meta_title', 'meta_description'] } },
    })
    const map = Object.fromEntries(rows.map(r => [r.key, r.value?.trim() || '']))
    faviconUrl = map['site_favicon'] || undefined
    if (map['meta_title'])       title = map['meta_title']
    if (map['meta_description']) desc  = map['meta_description']
  } catch { /* use defaults */ }

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
  let gtmId: string | null = null
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ['google_analytics_id', 'gtm_id'] } },
    })
    const map = Object.fromEntries(rows.map(r => [r.key, r.value?.trim() || '']))
    gaId  = map['google_analytics_id'] || null
    gtmId = map['gtm_id'] || null
  } catch { /* skip if DB unavailable */ }

  return (
    <html lang="vi">
      <head>
        {/* Google Tag Manager — head snippet */}
        {gtmId && (
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}
      </head>
      <body className={dmSans.variable} suppressHydrationWarning>
        {/* Google Tag Manager — noscript fallback */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0" width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        {/* GA4 trực tiếp — chỉ dùng khi không có GTM */}
        {!gtmId && gaId && (
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
