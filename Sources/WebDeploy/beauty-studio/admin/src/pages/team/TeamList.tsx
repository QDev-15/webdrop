import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Member {
  id: number
  name: string
  role: string
  bio: string
  avatar: string
  sort_order: number
  is_visible: number
}

export default function TeamList() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setMembers(await api.get<Member[]>('/team')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa thành viên này?')) return
    await api.delete(`/team/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đội ngũ Stylist & Artist</div>
          <div className="page-sub">{members.length} thành viên</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm thành viên</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Chức danh</th>
              <th>Hiển thị</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td>
                  {m.avatar
                    ? <img src={m.avatar} alt={m.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                  }
                </td>
                <td style={{ fontWeight: 500 }}>{m.name}</td>
                <td style={{ color: 'var(--text-2)' }}>{m.role}</td>
                <td>
                  <span className={`badge ${m.is_visible ? 'badge-published' : 'badge-draft'}`}>
                    {m.is_visible ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/team/${m.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>Chưa có thành viên nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
