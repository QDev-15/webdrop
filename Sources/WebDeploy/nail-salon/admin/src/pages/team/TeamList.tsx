import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Member { id: number; name: string; role: string; image: string; specialty1: string; specialty2: string; sort_order: number }

export default function TeamList() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Member[]>('/team').then(data => { setMembers(data); setLoading(false) })
  }, [])

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa thợ "${name}"?`)) return
    await api.delete(`/team/${id}`)
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đội ngũ thợ</div>
          <div className="page-sub">Quản lý thông tin các thợ nail</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm thợ</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Ảnh</th><th>Họ tên</th><th>Chức vụ</th><th>Chuyên môn</th><th>Thứ tự</th><th></th></tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td>
                  {m.image ? <img src={m.image} alt={m.name} className="thumb" style={{ borderRadius: '50%' }} /> : <span style={{ fontSize: 28 }}>👩</span>}
                </td>
                <td style={{ fontWeight: 500 }}>{m.name}</td>
                <td style={{ color: 'var(--text-3)', fontSize: 13 }}>{m.role}</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {m.specialty1 && <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 11, padding: '2px 8px', borderRadius: 20 }}>{m.specialty1}</span>}
                    {m.specialty2 && <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 11, padding: '2px 8px', borderRadius: 20 }}>{m.specialty2}</span>}
                  </div>
                </td>
                <td>{m.sort_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/team/${m.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(m.id, m.name)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">👩</div><div className="empty-state-text">Chưa có thành viên</div></div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
