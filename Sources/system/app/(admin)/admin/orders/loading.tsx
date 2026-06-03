import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import AdminLayout from '@/components/admin/AdminLayout'
export default function Loading() {
  return (
    <AdminLayout title="Đơn hàng">
      <AdminLoadingPage type="table" rows={13} />
    </AdminLayout>
  )
}
