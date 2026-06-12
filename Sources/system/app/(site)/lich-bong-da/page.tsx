export const revalidate = 60

import type { Metadata } from 'next'

const BASE = process.env.NEXT_PUBLIC_URL || 'https://webdrop.vn'

export const metadata: Metadata = {
  title: 'Lịch thi đấu World Cup 2026 | Tỉ số trực tiếp',
  description: 'Lịch thi đấu World Cup 2026 cập nhật realtime. Xem tỉ số trực tiếp, kết quả trận đấu, bảng xếp hạng FIFA World Cup 2026 tại Mỹ, Canada, Mexico.',
  keywords: ['lịch World Cup 2026', 'tỉ số WC 2026', 'kết quả bóng đá', 'world cup 2026 lịch thi đấu', 'xem bóng đá trực tiếp'],
  alternates: { canonical: `${BASE}/lich-bong-da` },
  openGraph: {
    title:       'Lịch thi đấu World Cup 2026 — Tỉ số trực tiếp',
    description: 'Lịch thi đấu World Cup 2026 cập nhật realtime. Xem tỉ số trực tiếp, kết quả, bảng xếp hạng.',
    url:         `${BASE}/lich-bong-da`,
    type:        'website',
    images:      [{ url: '/og-wc2026.jpg', width: 1200, height: 630, alt: 'Lịch thi đấu World Cup 2026' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Lịch thi đấu World Cup 2026 — Tỉ số trực tiếp',
    description: 'Cập nhật realtime tỉ số, lịch trận, bảng xếp hạng World Cup 2026.',
  },
}

import { prisma } from '@/lib/prisma'
import Footer from '@/components/site/Footer'
import RevealObserver from '@/components/site/RevealObserver'
import FootballClient from './FootballClient'

async function getYoutubeEmbed(): Promise<string> {
  try {
    const row = await prisma.setting.findFirst({ where: { key: 'football_youtube_embed' } })
    return row?.value?.trim() || ''
  } catch { return '' }
}

const SPORTS_EVENT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type':    'SportsEvent',
  name:       'FIFA World Cup 2026',
  startDate:  '2026-06-11',
  endDate:    '2026-07-19',
  location: {
    '@type': 'Place',
    name:    'Hoa Kỳ, Canada, Mexico',
    address: { '@type': 'PostalAddress', addressCountry: 'US' },
  },
  organizer:  { '@type': 'Organization', name: 'FIFA', url: 'https://www.fifa.com' },
  url:        `${BASE}/lich-bong-da`,
  description: 'Lịch thi đấu và tỉ số trực tiếp FIFA World Cup 2026.',
}

export default async function FootballPage() {
  const youtubeEmbed = await getYoutubeEmbed()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SPORTS_EVENT_SCHEMA) }} />
      <RevealObserver />
      <FootballClient youtubeEmbed={youtubeEmbed} />
      <Footer />
    </>
  )
}
