import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface GalleryItem {
  id: number
  title: string
  description: string
  image: string
  category: string
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
          <div className="page-title">Thư viện ảnh</div>
          <div className="page-sub">{items.length} ảnh trong thư viện</div>
        </div>
        <Link to="/gallery/new" className="btn-accent">+ Thêm ảnh</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {items.map(item => (
          <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--warm)' }}>
              {item.image ? (
                <img src={item.image} alt={item.title || 'Ảnh'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🖼</div>
              )}
              <span className={`badge badge-${item.status}`} style={{ position: 'absolute', top: 8, right: 8 }}>
                {item.status === 'published' ? 'Hiện' : 'Ẩn'}
              </span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || '(Không có tiêu đề)'}</div>
              {item.category && <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>{item.category}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/gallery/${item.id}/edit`} className="btn-ghost btn-sm" style={{ flex: 1, textAlign: 'center' }}>Sửa</Link>
                <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🖼</div>
          <div className="empty-state-text">Chưa có ảnh nào. Thêm ảnh đầu tiên!</div>
        </div>
      )}
    </div>
  )
}
