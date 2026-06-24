import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number; author_name: string; author_avatar: string; condition: string; content: string; rating: number; is_active: number; sort_order: number
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  function load() {
    api.get<Testimonial[]>('/testimonials')
      .then(setItems)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm('Xoá đánh giá này?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  if (loading) return <div className="page-loading">Đang tải...</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Đánh giá từ bệnh nhân</h1>
          <p className="page-sub">Quản lý testimonials hiển thị trên website</p>
        </div>
        <Link to="/testimonials/new" className="btn btn-primary">+ Thêm đánh giá</Link>
      </div>

      <table className="data-table">
        <thead>
          <tr><th>Tên</th><th>Điều trị</th><th>Nội dung</th><th>Sao</th><th>Hiển thị</th><th></th></tr>
        </thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={6} className="table-empty">Chưa có đánh giá.</td></tr>}
          {items.map(t => (
            <tr key={t.id}>
              <td>{t.author_name}</td>
              <td>{t.condition || '—'}</td>
              <td style={{ maxWidth: 220 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                  {t.content}
                </span>
              </td>
              <td>{'★'.repeat(t.rating)}</td>
              <td><span className={`status-badge ${t.is_active ? 'done' : 'cancelled'}`}>{t.is_active ? 'Hiển thị' : 'Ẩn'}</span></td>
              <td className="table-actions">
                <button className="btn-icon" onClick={() => navigate(`/testimonials/${t.id}/edit`)}>✎</button>
                <button className="btn-icon danger" onClick={() => handleDelete(t.id)}>✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
