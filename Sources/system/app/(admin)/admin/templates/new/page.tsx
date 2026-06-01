import AdminLayout from '@/components/admin/AdminLayout'
import TemplateForm from '@/components/admin/TemplateForm'
import { prisma } from '@/lib/prisma'

export default async function NewTemplatePage() {
  const industries = await prisma.industry.findMany({ orderBy: { sortOrder: 'asc' } }).catch(() => [])
  return (
    <AdminLayout title="Thêm template mới">
      <TemplateForm mode="new" industries={industries} />
    </AdminLayout>
  )
}
