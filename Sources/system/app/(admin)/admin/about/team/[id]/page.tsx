import AdminLayout from '@/components/admin/AdminLayout'
import { prisma } from '@/lib/prisma'
import TeamForm from '../TeamForm'

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const memberId = parseInt(id)

  const member = await prisma.teamMember.findUnique({
    where: { id: memberId },
  })

  if (!member) {
    return (
      <AdminLayout title="Không tìm thấy">
        <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: 24 }}>
          Thành viên không tồn tại
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Chỉnh sửa: ${member.name}`}>
      <TeamForm member={member} />
    </AdminLayout>
  )
}
