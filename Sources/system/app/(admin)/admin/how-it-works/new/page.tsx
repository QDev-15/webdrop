import AdminLayout from '@/components/admin/AdminLayout'
import PackageForm from '../PackageForm'

export default function NewHowItWorksPage() {
  return (
    <AdminLayout title="Thêm gói Quy Trình">
      <PackageForm mode="new" />
    </AdminLayout>
  )
}
