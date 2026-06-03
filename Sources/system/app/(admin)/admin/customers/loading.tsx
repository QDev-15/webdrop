import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import AdminLayout from '@/components/admin/AdminLayout'
export default function Loading() {
  return (
    <AdminLayout title="Danh sách khách hàng">
      <AdminLoadingPage type="table" rows={12} />
    </AdminLayout>
  )
}
