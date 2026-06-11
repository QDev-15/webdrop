import { notFound } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import TemplateForm from '@/components/admin/TemplateForm'
import { prisma } from '@/lib/prisma'

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [template, industries] = await Promise.all([
    prisma.template.findUnique({ where: { id: parseInt(id) } }).catch(() => null),
    prisma.industry.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => []),
  ])
  if (!template) notFound()

  return (
    <AdminLayout title={`Sửa: ${template.name}`}>
      <TemplateForm
        mode="edit"
        id={template.id}
        industries={industries}
        initial={{
          name: template.name,
          slug: template.slug,
          description: template.description || '',
          thumbnail: template.thumbnail || '',
          demoUrl: template.demoUrl || '',
          price:        String(Number(template.price)),
          websitePrice: template.websitePrice ? String(Number(template.websitePrice)) : '',
          customPrice:  template.customPrice  ? String(Number(template.customPrice))  : '',
          category: template.category,
          industryId: template.industryId ? String(template.industryId) : '',
          status:     template.status,
          hasWebsite: template.hasWebsite,
        }}
      />
    </AdminLayout>
  )
}
