import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import AdminLayout from '@/components/admin/AdminLayout'
export default function Loading() {
  return (
    <AdminLayout title="Bài viết">
      <AdminLoadingPage type="table" rows={7} />
    </AdminLayout>
  )
}
