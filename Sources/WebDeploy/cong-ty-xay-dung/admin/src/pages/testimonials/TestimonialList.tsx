import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  content: string
  rating: number
  sort_order: number
  status: string
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])
  async function load() {
    try { setItems(await api.get('/testimonials')) }
    finally { setLoading(false) }
  }
  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa đánh giá của "${name}"?`)) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Đánh giá khách hàng</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Quản lý testimonials từ chủ đầu tư</p>
        </div>
        <Link to="/testimonials/new" className="btn btn-primary">+ Thêm đánh giá</Link>
      </div>
      {loading ? (
        <div className="card"><p style={{ color: 'var(--text-3)' }}>Đang tải...</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Tên</th><th>Chức vụ</th><th>Đánh giá</th><th>Trạng thái</th><th>Thao tác</th>
            </tr></thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.author_name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{t.author_title}</td>
                  <td>{'★'.repeat(t.rating)}</td>
                  <td><span className={`badge badge-${t.status}`}>{t.status === 'published' ? 'Hiển thị' : 'Nháp'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/testimonials/${t.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id, t.author_name)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="empty-state"><div className="empty-state-icon">⭐</div><div className="empty-state-text">Chưa có đánh giá nào.</div></div>}
        </div>
      )}
    </div>
  )
}
