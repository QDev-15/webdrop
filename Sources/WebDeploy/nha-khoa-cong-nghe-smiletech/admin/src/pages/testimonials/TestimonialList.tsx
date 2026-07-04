import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  content: string
  rating: number
  is_active: number
  sort_order: number
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Testimonial[]>('/testimonials')
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xoá đánh giá của "${name}"?`)) return
    try {
      await api.delete(`/testimonials/${id}`)
      load()
    } catch (e: unknown) {
      alert((e as Error).message)
    }
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1 className="page-title">Đánh giá khách hàng</h1>
        <Link to="/testimonials/new" className="btn btn-primary">+ Thêm đánh giá</Link>
      </div>

      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tác giả</th>
              <th>Nội dung</th>
              <th>Sao</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} className="empty-row">Chưa có đánh giá nào.</td></tr>
            ) : items.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>
                  <div className="fw-600">{t.author_name}</div>
                  {t.author_title && <div className="text-muted">{t.author_title}</div>}
                </td>
                <td style={{ maxWidth: 280, fontSize: 13 }}>{t.content}</td>
                <td>{'★'.repeat(t.rating)}</td>
                <td>
                  <span className={`status-dot status-${t.is_active ? 'active' : 'inactive'}`}>
                    {t.is_active ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/testimonials/${t.id}/edit`} className="btn btn-sm btn-ghost">Sửa</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id, t.author_name)}>Xoá</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
