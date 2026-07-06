import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_location: string
  content: string
  stars: number
  product_purchased: string
  is_active: number
  sort_order: number
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Testimonial[]>('/testimonials')
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa đánh giá này?')) return
    await api.post(`/testimonials/${id}/delete`, {})
    load()
  }

  const stars = (n: number) => '★'.repeat(Math.min(5, n || 5)) + '☆'.repeat(Math.max(0, 5 - (n || 5)))

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Đánh giá khách hàng</h1>
          <p className="admin-page-sub">Quản lý nhận xét và đánh giá sản phẩm</p>
        </div>
        <Link to="/testimonials/new" className="btn btn-primary">+ Thêm đánh giá</Link>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Sao</th>
                <th>Nhận xét</th>
                <th>Sản phẩm đã mua</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa' }}>Chưa có đánh giá nào</td></tr>
              ) : items.map(t => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.author_name}</strong>
                    {t.author_location && <div style={{ fontSize: 12, color: '#aaa' }}>{t.author_location}</div>}
                  </td>
                  <td style={{ color: '#f59e0b', letterSpacing: 1 }}>{stars(t.stars)}</td>
                  <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.content}</td>
                  <td>{t.product_purchased || '—'}</td>
                  <td>
                    <span className={`status-badge ${t.is_active ? 'done' : 'brief'}`}>
                      {t.is_active ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/testimonials/${t.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(t.id)} className="btn btn-sm btn-danger">Xóa</button>
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
