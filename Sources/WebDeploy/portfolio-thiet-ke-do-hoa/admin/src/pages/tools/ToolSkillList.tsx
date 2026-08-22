import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface ToolSkill {
  id: number
  name: string
  level_label: string
  level_percent: number
  sort_order: number
  status: string
}

export default function ToolSkillList() {
  const [items, setItems] = useState<ToolSkill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<ToolSkill[]>('/tools-skills')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa công cụ này?')) return
    await api.delete(`/tools-skills/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Công cụ & kỹ năng</div>
          <div className="page-sub">Hiển thị trang Về tôi ({items.length} công cụ)</div>
        </div>
        <Link to="/tools/new" className="btn-accent">+ Thêm công cụ</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛠</div>
          <div className="empty-state-text">Chưa có công cụ nào. Thêm công cụ đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(s => (
            <div key={s.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{s.level_label} — {s.level_percent}%</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <span className={`badge badge-${s.status}`}>{s.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
                <Link to={`/tools/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button onClick={() => handleDelete(s.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
