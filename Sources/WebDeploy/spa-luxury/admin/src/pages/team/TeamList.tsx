import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id: number
  name: string
  title: string
  bio: string
  image: string
  specialties: string
  is_published: number
  sort_order: number
}

export default function TeamList() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<TeamMember[]>('/team')) }
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
          <div className="page-title">Đội ngũ</div>
          <div className="page-sub">{items.length} thành viên</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm thành viên</Link>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
          <div>Chưa có thành viên nào. <Link to="/team/new" style={{ color: 'var(--accent)' }}>Thêm thành viên đầu tiên</Link>!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Chức vụ</th>
                <th>Chuyên môn</th>
                <th>Xuất bản</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map(member => (
                <tr key={member.id}>
                  <td>
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border)' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: 16 }}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{member.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{member.title || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 200 }}>
                    {member.specialties ? (
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {member.specialties}
                      </div>
                    ) : '—'}
                  </td>
                  <td>
                    {member.is_published ? (
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 500 }}>Hiển thị</span>
                    ) : (
                      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'var(--warm)', color: 'var(--text-3)', fontWeight: 500 }}>Ẩn</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/team/${member.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(member.id)}>Xóa</button>
                    </div>
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
