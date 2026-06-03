import { notFound } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import PackageForm from '../../PackageForm'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'

async function EditForm({ id }: { id: number }) {
  const pkg = await prisma.howItWorksPackage.findUnique({
    where: { id },
    include: { steps: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!pkg) notFound()

  return (
    <PackageForm
      mode="edit"
      initialData={{
        id:       pkg.id,
        name:     pkg.name,
        slug:     pkg.slug,
        tagline:  pkg.tagline  ?? '',
        icon:     pkg.icon     ?? '📦',
        price:    pkg.price    ?? '',
        hot:      pkg.hot,
        ctaLabel: pkg.ctaLabel ?? '',
        ctaHref:  pkg.ctaHref  ?? '',
        suitable: pkg.suitable,
        status:   pkg.status,
        steps:    pkg.steps.map(s => ({ id: s.id, title: s.title, desc: s.desc ?? '', sortOrder: s.sortOrder })),
      }}
    />
  )
}

export default async function EditHowItWorksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pkgId = parseInt(id)
  if (isNaN(pkgId)) notFound()

  return (
    <AdminLayout title="Chỉnh sửa gói">
      <Suspense fallback={<AdminLoadingPage type="form" />}>
        <EditForm id={pkgId} />
      </Suspense>
    </AdminLayout>
  )
}
