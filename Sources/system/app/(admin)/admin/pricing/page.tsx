import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import { Suspense } from 'react'
import PricingTabs from './PricingTabs'

const BG_LABEL: Record<string, string> = { light: 'Sáng', warm: 'Ấm', dark: 'Tối' }
const TYPE_LABEL: Record<string, string> = { cards: 'Thẻ giá', banner: 'Banner CTA' }

async function PricingData() {
  const [groups, faqs] = await Promise.all([
    prisma.pricingGroup.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { plans: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.pricingFaq.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return (
    <PricingTabs
      initialGroups={groups.map(g => ({
        id: g.id, slug: g.slug, title: g.title, titleEm: g.titleEm ?? '',
        type: g.type, bg: g.bg, status: g.status,
        plansCount: g.plans.length,
        bgLabel: BG_LABEL[g.bg] ?? g.bg,
        typeLabel: TYPE_LABEL[g.type] ?? g.type,
      }))}
      initialFaqs={faqs.map(f => ({
        id: f.id, question: f.question, answer: f.answer, status: f.status,
      }))}
    />
  )
}

export default function AdminPricingPage() {
  return (
    <AdminLayout title="Bảng Giá">
      <Suspense fallback={<AdminLoadingPage type="table" />}>
        <PricingData />
      </Suspense>
    </AdminLayout>
  )
}
