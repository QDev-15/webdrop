import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id: number; name: string; role: string; image: string
  experience: string; specialty1: string; specialty2: string; sort_order: number
}

export default function TeamList() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try { setMembers(await api.get<TeamMember[]>('/team')) }
    catch { setError('Không thể tải danh sách chuyên viên.') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function remove(id: number) {
    if (!confirm('Xóa chuyên viên này?')) return
    try { await api.delete(`/team/${id}`); load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Lỗi xóa') }
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Đội ngũ chuyên viên</div></div>
        <Link to="/team/new" className="btn-accent">+ Thêm chuyên viên</Link>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? <div className="admin-loading">Đang tải...</div> : (
        <div className="card">
          <table className="admin-table">
            <thead><tr><th>Ảnh</th><th>Tên</th><th>Vai trò</th><th>Kinh nghiệm</th><th>Chuyên môn</th><th>Thao tác</th></tr></thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id}>
                  <td>
                    {m.image
                      ? <img src={m.image} alt={m.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👩</div>
                    }
                  </td>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{m.role}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-3)' }}>{m.experience}</td>
                  <td style={{ fontSize: 12 }}>
                    {m.specialty1 && <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 20, marginRight: 4 }}>{m.specialty1}</span>}
                    {m.specialty2 && <span style={{ background: 'var(--warm2)', color: 'var(--text-2)', padding: '2px 8px', borderRadius: 20 }}>{m.specialty2}</span>}
                  </td>
                  <td>
                    <Link to={`/team/${m.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button className="btn-ghost btn-sm" style={{ color: 'var(--danger)', marginLeft: 6 }} onClick={() => remove(m.id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
