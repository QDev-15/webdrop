import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface TimelineItem {
  id: number
  year: string
  title: string
  description: string
  sort_order: number
  status: string
}

export default function TimelineList() {
  const [items, setItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<TimelineItem[]>('/timeline')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa mốc thời gian này?')) return
    await api.delete(`/timeline/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hành trình (Timeline)</div>
          <div className="page-sub">Hiển thị ở trang Về tôi ({items.length} mốc)</div>
        </div>
        <Link to="/timeline/new" className="btn-accent">+ Thêm mốc thời gian</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-text">Chưa có mốc thời gian nào. Thêm mốc đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--accent)', minWidth: 90 }}>{t.year}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{t.description}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <span className={`badge badge-${t.status}`}>{t.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
                <Link to={`/timeline/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
