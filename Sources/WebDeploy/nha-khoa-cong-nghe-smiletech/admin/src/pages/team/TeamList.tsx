import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  photo: string
  is_active: number
  sort_order: number
}

export default function TeamList() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<TeamMember[]>('/team')
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xoá bác sĩ "${name}"?`)) return
    try {
      await api.delete(`/team/${id}`)
      load()
    } catch (e: unknown) {
      alert((e as Error).message)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">Đội ngũ bác sĩ</h1>
        <Link to="/team/new" className="btn btn-primary">+ Thêm bác sĩ</Link>
      </div>

      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ảnh</th>
              <th>Họ tên</th>
              <th>Chuyên khoa</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr><td colSpan={6} className="empty-row">Chưa có bác sĩ nào.</td></tr>
            ) : members.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                  )}
                </td>
                <td className="fw-600">{m.name}</td>
                <td>{m.role || '—'}</td>
                <td>
                  <span className={`status-dot status-${m.is_active ? 'active' : 'inactive'}`}>
                    {m.is_active ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/team/${m.id}/edit`} className="btn btn-sm btn-ghost">Sửa</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id, m.name)}>Xoá</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
