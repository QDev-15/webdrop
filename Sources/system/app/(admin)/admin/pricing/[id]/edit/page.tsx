import { notFound } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import PricingGroupForm from '../../PricingGroupForm'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'

async function EditForm({ id }: { id: number }) {
  const group = await prisma.pricingGroup.findUnique({
    where: { id },
    include: { plans: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!group) notFound()

  return (
    <PricingGroupForm
      mode="edit"
      initialData={{
        id:          group.id,
        slug:        group.slug,
        eyebrow:     group.eyebrow     ?? '',
        title:       group.title,
        titleEm:     group.titleEm     ?? '',
        subtitle:    group.subtitle    ?? '',
        footnote:    group.footnote    ?? '',
        bg:          group.bg,
        type:        group.type,
        description: group.description ?? '',
        tags:        group.tags,
        ctaLabel:    group.ctaLabel    ?? '',
        ctaHref:     group.ctaHref     ?? '',
        status:      group.status,
        plans: group.plans.map(p => ({
          id: p.id, name: p.name, price: p.price,
          features: p.features, hot: p.hot,
          ctaLabel: p.ctaLabel ?? '', ctaHref: p.ctaHref ?? '',
          sortOrder: p.sortOrder,
        })),
      }}
    />
  )
}

export default async function EditPricingGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gid = parseInt(id)
  if (isNaN(gid)) notFound()

  return (
    <AdminLayout title="Chỉnh sửa nhóm giá">
      <Suspense fallback={<AdminLoadingPage type="form" />}>
        <EditForm id={gid} />
      </Suspense>
    </AdminLayout>
  )
}
