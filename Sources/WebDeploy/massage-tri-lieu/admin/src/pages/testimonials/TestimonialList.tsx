import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_info: string
  content: string
  rating: number
  active: number
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Testimonial[]>('/testimonials').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa đánh giá này?')) return
    try { await api.delete(`/testimonials/${id}`); load() } catch {}
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Đánh giá khách hàng</div>
          <div className="page-sub">Quản lý các phản hồi từ khách hàng</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      {loading ? <div style={{ color: 'var(--text-3)' }}>Đang tải...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>ID</th><th>Tác giả</th><th>Chức danh</th><th>Điểm</th><th>Nội dung</th><th>Trạng thái</th><th>Thao tác</th>
            </tr></thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td style={{ fontWeight: 500 }}>{t.author_name}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.author_info}</td>
                  <td style={{ color: '#f59e0b' }}>{'★'.repeat(t.rating)}</td>
                  <td style={{ fontSize: 12, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.content}</td>
                  <td><span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, background: t.active ? 'var(--accent-light)' : 'var(--warm)', color: t.active ? 'var(--accent)' : 'var(--text-3)' }}>{t.active ? 'Hiện' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/testimonials/${t.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Xóa</button>
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
