import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  author_avatar: string
  content: string
  rating: number
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
          <p className="admin-page-sub">Quản lý các đánh giá hiển thị ở trang chủ</p>
        </div>
        <Link to="/testimonials/new" className="btn btn-primary">+ Thêm đánh giá</Link>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Khách hàng</th>
                <th>Nội dung</th>
                <th>Sao</th>
                <th>Thứ tự</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa' }}>Chưa có đánh giá nào</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.author_avatar ? (
                      <img src={item.author_avatar} alt={item.author_name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <div style={{ width: 44, height: 44, background: '#f3ede4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</div>
                    )}
                  </td>
                  <td>
                    <strong>{item.author_name}</strong>
                    <div style={{ fontSize: 12, color: '#aaa' }}>{item.author_role}</div>
                  </td>
                  <td style={{ maxWidth: 420 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
                      {item.content.length > 100 ? item.content.slice(0, 100) + '…' : item.content}
                    </span>
                  </td>
                  <td>{'★'.repeat(item.rating)}</td>
                  <td>{item.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/testimonials/${item.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(item.id, item.author_name)} className="btn btn-sm btn-danger">Xóa</button>
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
