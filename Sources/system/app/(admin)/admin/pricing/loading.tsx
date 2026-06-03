import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoadingPage from '@/components/admin/AdminLoadingPage'

export default function Loading() {
  return (
    <AdminLayout title="Bảng Giá">
      <AdminLoadingPage type="table" />
    </AdminLayout>
  )
}
