import AdminLayout from '@/components/admin/AdminLayout'
import TeamForm from '../TeamForm'

export default function NewTeamMemberPage() {
  return (
    <AdminLayout title="Thêm thành viên mới">
      <TeamForm />
    </AdminLayout>
  )
}
