import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id: number
  name: string
  role: string
  cert: string
  bio: string
  image_url: string
  tags: string
  sort_order: number
  is_active: number
}

export default function TeamList() {
  const [items, setItems]     = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<TeamMember[]>('/team')) }
    finally { setLoading(false) }
  }

  async function toggleActive(t: TeamMember) {
    await api.put(`/team/${t.id}`, { is_active: t.is_active ? 0 : 1 })
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa huấn luyện viên này?')) return
    await api.delete(`/team/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Huấn luyện viên</div>
          <div className="page-sub">{items.length} người · {items.filter(i => i.is_active).length} đang hoạt động</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm HLV</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Vai trò</th>
              <th>Chứng chỉ</th>
              <th>Tags</th>
              <th>Hiển thị</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id}>
                <td>
                  {t.image_url
                    ? <img src={t.image_url} alt={t.name} className="thumb" />
                    : <div className="thumb" style={{ background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                  }
                </td>
                <td style={{ fontWeight: 500 }}>{t.name}</td>
                <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{t.role}</td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.cert}</td>
                <td style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {t.tags && t.tags.split(',').map((tag, i) => (
                    <span key={i} style={{ display: 'inline-block', background: 'var(--warm)', borderRadius: 4, padding: '1px 6px', marginRight: 4, marginBottom: 2 }}>{tag.trim()}</span>
                  ))}
                </td>
                <td>
                  <button onClick={() => toggleActive(t)}
                    className={t.is_active ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
                    {t.is_active ? 'Hiện' : 'Ẩn'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/team/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-text">Chưa có huấn luyện viên nào.</div>
          </div>
        )}
      </div>
    </div>
  )
}
