import AdminLayout from '@/components/admin/AdminLayout'
import ValuesForm from '../ValuesForm'

export default function NewValuePage() {
  return (
    <AdminLayout title="Thêm giá trị cốt lõi mới">
      <ValuesForm />
    </AdminLayout>
  )
}
