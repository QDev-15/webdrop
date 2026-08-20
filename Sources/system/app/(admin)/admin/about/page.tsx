import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const PER_PAGE = 10

export default async function AboutPage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string; page?: string }>
}) {
  const params = await searchParams
  const tab = params.tab || 'team'
  const page = Math.max(1, parseInt(params.page || '1'))
  const skip = (page - 1) * PER_PAGE

  let team: any[] = []
  let values: any[] = []
  let totalTeam = 0
  let totalValues = 0

  try {
    if (tab === 'team') {
      [team, totalTeam] = await Promise.all([
        prisma.teamMember.findMany({
          orderBy: { sortOrder: 'asc' },
          skip,
          take: PER_PAGE,
        }),
        prisma.teamMember.count(),
      ])
    } else {
      [values, totalValues] = await Promise.all([
        prisma.companyValue.findMany({
          orderBy: { sortOrder: 'asc' },
          skip,
          take: PER_PAGE,
        }),
        prisma.companyValue.count(),
      ])
    }
  } catch (e) {
    console.error('DB error:', e)
  }

  const totalPages = tab === 'team' ? Math.ceil(totalTeam / PER_PAGE) : Math.ceil(totalValues / PER_PAGE)
  const currentTotal = tab === 'team' ? totalTeam : totalValues

  return (
    <AdminLayout title="Quản lý trang Giới thiệu">
      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', flex: 1, minWidth: 150 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Thành viên đội</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>{totalTeam}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', flex: 1, minWidth: 150 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Giá trị cốt lõi</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>{totalValues}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <Link href="/admin/about?tab=team" style={{
          padding: '12px 0',
          borderBottom: tab === 'team' ? '2px solid var(--accent)' : 'none',
          fontSize: 14,
          fontWeight: tab === 'team' ? 600 : 400,
          color: tab === 'team' ? 'var(--accent)' : 'var(--text-3)',
          textDecoration: 'none',
          cursor: 'pointer',
        }}>
          👥 Thành viên đội
        </Link>
        <Link href="/admin/about?tab=values" style={{
          padding: '12px 0',
          borderBottom: tab === 'values' ? '2px solid var(--accent)' : 'none',
          fontSize: 14,
          fontWeight: tab === 'values' ? 600 : 400,
          color: tab === 'values' ? 'var(--accent)' : 'var(--text-3)',
          textDecoration: 'none',
          cursor: 'pointer',
        }}>
          ✨ Giá trị cốt lõi
        </Link>
      </div>

      {/* Team Members Tab */}
      {tab === 'team' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Thành viên đội ngũ</h2>
            <Link href="/admin/about/team/new" style={{
              fontSize: 13,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'var(--accent)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500,
            }}>
              + Thành viên mới
            </Link>
          </div>

          {team.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)' }}>
              Chưa có thành viên nào. <Link href="/admin/about/team/new" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Thêm thành viên đầu tiên</Link>
            </div>
          ) : (
            <div style={{ borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--warm)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600 }}>Tên</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600 }}>Chức vụ</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600 }}>Thứ tự</th>
                    <th style={{ padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((member, idx) => (
                    <tr key={member.id} style={{ borderBottom: idx < team.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: 12, fontSize: 14 }}>{member.name}</td>
                      <td style={{ padding: 12, fontSize: 14, color: 'var(--text-2)' }}>{member.title}</td>
                      <td style={{ padding: 12, fontSize: 14, color: 'var(--text-2)' }}>{member.sortOrder}</td>
                      <td style={{ padding: 12, textAlign: 'center', fontSize: 13 }}>
                        <Link href={`/admin/about/team/${member.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', marginRight: 12 }}>Sửa</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'center' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link key={p} href={`/admin/about?tab=team&page=${p}`} style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: p === page ? 'var(--accent)' : 'var(--surface)',
                  color: p === page ? '#fff' : 'var(--text)',
                  textDecoration: 'none',
                  fontSize: 12,
                  border: '1px solid var(--border)',
                }}>
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Company Values Tab */}
      {tab === 'values' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Giá trị cốt lõi</h2>
            <Link href="/admin/about/values/new" style={{
              fontSize: 13,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'var(--accent)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500,
            }}>
              + Giá trị mới
            </Link>
          </div>

          {values.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-3)' }}>
              Chưa có giá trị nào. <Link href="/admin/about/values/new" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Thêm giá trị đầu tiên</Link>
            </div>
          ) : (
            <div style={{ borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--warm)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600 }}>Biểu tượng</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600 }}>Tiêu đề</th>
                    <th style={{ padding: 12, textAlign: 'left', fontSize: 13, fontWeight: 600 }}>Thứ tự</th>
                    <th style={{ padding: 12, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {values.map((value, idx) => (
                    <tr key={value.id} style={{ borderBottom: idx < values.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: 12, fontSize: 20, textAlign: 'center' }}>{value.icon || '✨'}</td>
                      <td style={{ padding: 12, fontSize: 14 }}>{value.title}</td>
                      <td style={{ padding: 12, fontSize: 14, color: 'var(--text-2)' }}>{value.sortOrder}</td>
                      <td style={{ padding: 12, textAlign: 'center', fontSize: 13 }}>
                        <Link href={`/admin/about/values/${value.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', marginRight: 12 }}>Sửa</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'center' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link key={p} href={`/admin/about?tab=values&page=${p}`} style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: p === page ? 'var(--accent)' : 'var(--surface)',
                  color: p === page ? '#fff' : 'var(--text)',
                  textDecoration: 'none',
                  fontSize: 12,
                  border: '1px solid var(--border)',
                }}>
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
