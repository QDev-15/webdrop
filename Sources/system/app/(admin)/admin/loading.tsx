import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
export default function Loading() {
  return (
    <AdminLayout title="Tổng quan">
      <AdminLoadingPage type="cards" rows={4} />
    </AdminLayout>
  )
}
