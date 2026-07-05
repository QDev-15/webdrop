import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  content: string
  rating: number
  avatar_url: string
  is_featured: number
  sort_order: number
}

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Testimonial[]>('/testimonials').then(setItems).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa đánh giá này?')) return
    await api.post(`/testimonials/${id}/delete`, {})
    load()
  }

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Đang tải...</div>

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Đánh giá khách hàng</div>
          <div className="page-sub">{items.length} đánh giá</div>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Vai trò</th>
              <th>Nội dung</th>
              <th>Đánh giá</th>
              <th>Hiển thị</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500 }}>
                  {item.avatar_url && (
                    <img src={item.avatar_url} alt={item.author_name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 8, verticalAlign: 'middle' }} />
                  )}
                  {item.author_name}
                </td>
                <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{item.author_role || '—'}</td>
                <td style={{ color: 'var(--text-2)', fontSize: '13px', maxWidth: '280px' }}>
                  {item.content.length > 80 ? item.content.substring(0, 80) + '...' : item.content}
                </td>
                <td>{'★'.repeat(item.rating)}<span style={{ color: 'var(--text-3)' }}>{'☆'.repeat(5 - item.rating)}</span></td>
                <td>{item.is_featured ? <span style={{ color: '#059669' }}>✓</span> : <span style={{ color: 'var(--text-3)' }}>—</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/testimonials/${item.id}/edit`} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '12px' }}>Sửa</Link>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>Chưa có đánh giá nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
