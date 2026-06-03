import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
export default function Loading() {
  return (
    <AdminLayout title="Cài đặt">
      <AdminLoadingPage type="form" rows={8} />
    </AdminLayout>
  )
}
