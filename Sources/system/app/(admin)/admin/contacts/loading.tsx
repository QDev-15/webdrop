import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import AdminLayout from '@/components/admin/AdminLayout'
export default function Loading() {
  return (
    <AdminLayout title="Danh sách liên hệ">
      <AdminLoadingPage type="table" rows={8} />
    </AdminLayout>
  )
}
