import AdminLoadingPage from '@/components/admin/AdminLoadingPage'
import AdminLayout from '@/components/admin/AdminLayout'
export default function Loading() {
  return (
    <AdminLayout title="Templates">
      <AdminLoadingPage type="cards" rows={6} />
    </AdminLayout>
  )
}
