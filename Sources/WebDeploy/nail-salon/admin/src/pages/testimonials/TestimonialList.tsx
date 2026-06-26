import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number; author_name: string; author_location: string
  author_avatar: string; content: string; rating: number; sort_order: number
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Testimonial[]>('/testimonials').then(data => { setItems(data); setLoading(false) })
  }, [])

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa đánh giá của "${name}"?`)) return
    await api.delete(`/testimonials/${id}`)
    setItems(prev => prev.filter(t => t.id !== id))
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đánh giá khách hàng</div>
          <div className="page-sub">Quản lý testimonials hiển thị trên website</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Khách hàng</th><th>Địa chỉ</th><th>Nội dung</th><th>Sao</th><th>Thứ tự</th><th></th></tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {t.author_avatar && <img src={t.author_avatar} alt={t.author_name} className="thumb" style={{ borderRadius: '50%' }} />}
                    <span style={{ fontWeight: 500 }}>{t.author_name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-3)', fontSize: 13 }}>{t.author_location}</td>
                <td style={{ maxWidth: 260 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{t.content}</div>
                </td>
                <td>{'★'.repeat(t.rating)}</td>
                <td>{t.sort_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(t.id, t.author_name)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">⭐</div><div className="empty-state-text">Chưa có đánh giá</div></div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
