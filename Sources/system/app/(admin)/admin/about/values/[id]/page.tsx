import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import ValuesForm from '../ValuesForm'

export default async function EditValuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const valueId = parseInt(id)

  const value = await prisma.companyValue.findUnique({
    where: { id: valueId },
  })

  if (!value) {
    return (
      <AdminLayout title="Không tìm thấy">
        <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: 24 }}>
          Giá trị không tồn tại
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Chỉnh sửa: ${value.title}`}>
      <ValuesForm value={value} />
    </AdminLayout>
  )
}
