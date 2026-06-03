import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import AdminLayout from '@/components/admin/AdminLayout'
export default function Loading() {
  return (
    <AdminLayout title="Dự án">
      <AdminLoadingPage type="cards" rows={9} />
    </AdminLayout>
  )

}
