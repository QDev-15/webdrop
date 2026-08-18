import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TeamMember {
  id: number
  name: string
  position: string
  bio: string
  avatar: string
  tier: string
  sort_order: number
  status: string
}

const TIER_LABELS: Record<string, string> = {
  leadership: 'Ban lãnh đạo',
  consultant: 'Đội tư vấn',
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
          <div className="page-sub">Ban lãnh đạo &amp; đội tư vấn ({items.length} thành viên)</div>
        </div>
        <Link to="/team/new" className="btn-accent">+ Thêm thành viên</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-text">Chưa có thành viên nào. Thêm thành viên đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 48 }}>Ảnh</th>
                <th>Họ tên</th>
                <th>Chức vụ</th>
                <th style={{ width: 120 }}>Nhóm</th>
                <th style={{ width: 80 }}>Thứ tự</th>
                <th style={{ width: 100 }}>Trạng thái</th>
                <th style={{ width: 140 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(m => (
                <tr key={m.id}>
                  <td>
                    {m.avatar && m.avatar.startsWith('http') ? (
                      <img src={m.avatar} alt={m.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{m.avatar || '👤'}</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td style={{ color: 'var(--text-2)' }}>{m.position}</td>
                  <td>{TIER_LABELS[m.tier] ?? m.tier}</td>
                  <td>{m.sort_order}</td>
                  <td><span className={`badge badge-${m.status}`}>{m.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/team/${m.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(m.id)} className="btn-danger btn-sm">Xóa</button>
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
