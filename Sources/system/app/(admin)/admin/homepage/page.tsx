import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import HomepageClient from './HomepageClient'
import { Suspense } from 'react'

const HP_KEYS = [
  // Visibility toggles
  'hp_show_howitworks', 'hp_show_whyus', 'hp_show_pricing',
  'hp_show_reviews', 'hp_show_clients', 'hp_show_cta', 'hp_show_banner', 'hp_show_templates',
  // How It Works
  'hp_howitworks_eyebrow', 'hp_howitworks_title', 'hp_howitworks_title_em',
  'hp_howitworks_subtitle', 'hp_howitworks_image', 'hp_howitworks_steps',
  // Why Us
  'hp_whyus_eyebrow', 'hp_whyus_title', 'hp_whyus_title_em',
  'hp_whyus_subtitle', 'hp_whyus_image', 'hp_whyus_caption', 'hp_whyus_caption_sub', 'hp_whyus_items',
  // Reviews
  'hp_reviews_eyebrow', 'hp_reviews_title', 'hp_reviews_title_em',
  'hp_reviews_subtitle', 'hp_reviews_items',
  // Clients
  'hp_clients_title', 'hp_clients_items',
  // CTA
  'hp_cta_title', 'hp_cta_subtitle',
  'hp_cta_btn1_label', 'hp_cta_btn1_target',
  'hp_cta_btn2_label', 'hp_cta_btn2_target',
  // Banner
  'hp_banner_image', 'hp_banner_subtitle', 'hp_banner_title',
]

async function HomepageData() {
  const rows = await prisma.setting.findMany({ where: { key: { in: HP_KEYS } } })
  const settings: Record<string, string> = {}
  for (const r of rows) settings[r.key] = r.value ?? ''
  return <HomepageClient initialSettings={settings} />
}

export default function AdminHomepagePage() {
  return (
    <AdminLayout title="Trang Chủ">
      <Suspense fallback={<AdminLoadingPage type="form" />}>
        <HomepageData />
      </Suspense>
    </AdminLayout>
  )
}
