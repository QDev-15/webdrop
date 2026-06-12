export const revalidate = 60

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Lịch thi đấu World Cup 2026 | Tỉ số trực tiếp — webdrop.vn',
  description: 'Lịch thi đấu World Cup 2026 cập nhật realtime. Xem tỉ số trực tiếp, kết quả các trận đấu, bảng xếp hạng FIFA World Cup 2026.',
}

import { prisma } from '@/lib/prisma'
import NavBar from '@/components/site/NavBar'
import Footer from '@/components/site/Footer'
import FootballClient from './FootballClient'

async function getYoutubeEmbed(): Promise<string> {
  try {
    const row = await prisma.setting.findFirst({ where: { key: 'football_youtube_embed' } })
    return row?.value?.trim() || ''
  } catch { return '' }
}

export default async function FootballPage() {
  const youtubeEmbed = await getYoutubeEmbed()
  return (
    <>
      <NavBar />
      <FootballClient youtubeEmbed={youtubeEmbed} />
      <Footer />
    </>
  )
}
