import AdminLayout from '@/components/admin/AdminLayout'
import PricingGroupForm from '../PricingGroupForm'

export default function NewPricingGroupPage() {
  return (
    <AdminLayout title="Thêm nhóm giá">
      <PricingGroupForm mode="new" />
    </AdminLayout>
  )
}
