import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface GalleryItem {
  id: number
  image: string
  alt_text: string
  sort_order: number
  status: string
}

export default function GalleryList() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<GalleryItem[]>('/gallery')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa ảnh này?')) return
    await api.delete(`/gallery/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Gallery</div>
          <div className="page-sub">Quản lý ảnh gallery trang chủ ({items.length} ảnh)</div>
        </div>
        <Link to="/gallery/new" className="btn-accent">+ Thêm ảnh</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🖼</div>
          <div className="empty-state-text">Chưa có ảnh nào. Thêm ảnh đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {items.map(g => (
            <div key={g.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg)' }}>
                {g.image
                  ? <img src={g.image} alt={g.alt_text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%' }} />}
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10, minHeight: 18 }}>{g.alt_text || '—'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge badge-${g.status}`}>{g.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/gallery/${g.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(g.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
