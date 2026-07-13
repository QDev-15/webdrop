import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
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

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa đánh giá của "${name}"?`)) return
    await api.post(`/testimonials/${id}/delete`, {})
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Đánh giá khách hàng</h1>
          <p className="admin-page-sub">Nhận xét hiển thị ở section "Khách Hàng Nói Gì" trên trang chủ</p>
        </div>
        <Link to="/testimonials/new" className="btn btn-primary">+ Thêm đánh giá</Link>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Vai trò</th>
                <th>Nội dung</th>
                <th>Sao</th>
                <th>Sản phẩm đã mua</th>
                <th>Hiển thị</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa' }}>Chưa có đánh giá nào</td></tr>
              ) : items.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.author_name}</strong></td>
                  <td>{t.author_role || '—'}</td>
                  <td style={{ maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.content}</td>
                  <td>{'★'.repeat(t.stars)}</td>
                  <td>{t.product_purchased || '—'}</td>
                  <td>
                    <span className={`status-badge ${t.is_active ? 'done' : 'brief'}`}>{t.is_active ? 'Hiện' : 'Ẩn'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/testimonials/${t.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(t.id, t.author_name)} className="btn btn-sm btn-danger">Xóa</button>
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
