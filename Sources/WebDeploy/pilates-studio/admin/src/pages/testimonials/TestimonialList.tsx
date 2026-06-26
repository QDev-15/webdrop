import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  name: string
  role: string
  avatar_url: string
  content: string
  rating: number
  is_active: number
  sort_order: number
}

export default function TestimonialList() {
  const [items, setItems]     = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Testimonial[]>('/testimonials')) }
    finally { setLoading(false) }
  }

  async function toggleActive(t: Testimonial) {
    await api.put(`/testimonials/${t.id}`, { is_active: t.is_active ? 0 : 1 })
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đánh giá này?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đánh giá học viên</div>
          <div className="page-sub">{items.length} đánh giá · {items.filter(i => i.is_active).length} đang hiển thị</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Học viên</th>
              <th>Đánh giá</th>
              <th>Xếp hạng</th>
              <th>Hiển thị</th>
              <th>Thứ tự</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id}>
                <td>
                  {t.avatar_url
                    ? <img src={t.avatar_url} alt={t.name} className="thumb" style={{ borderRadius: '50%' }} />
                    : <div className="thumb" style={{ borderRadius: '50%', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                  }
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.role}</div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 280 }}>
                  {t.content.length > 100 ? t.content.slice(0, 100) + '...' : t.content}
                </td>
                <td style={{ color: '#f59e0b' }}>{'★'.repeat(t.rating)}</td>
                <td>
                  <button onClick={() => toggleActive(t)}
                    className={t.is_active ? 'btn-accent btn-sm' : 'btn-ghost btn-sm'}>
                    {t.is_active ? 'Hiện' : 'Ẩn'}
                  </button>
                </td>
                <td>{t.sort_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(t.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length && (
          <div className="empty-state">
            <div className="empty-state-icon">⭐</div>
            <div className="empty-state-text">Chưa có đánh giá nào.</div>
          </div>
        )}
      </div>
    </div>
  )
}
