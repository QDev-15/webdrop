import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_role: string
  stars: number
  content: string
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

  async function handleDelete(id: number) {
    if (!confirm('Xóa đánh giá này?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  if (loading) return <div className="adm-loading">Đang tải...</div>

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Đánh Giá Khách Hàng</h1>
          <p className="adm-page-sub">{items.length} đánh giá</p>
        </div>
        <Link to="/testimonials/new" className="adm-btn-primary">+ Thêm đánh giá</Link>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Nội dung</th>
              <th>Sao</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{t.author_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{t.author_role || '—'}</div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 240 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.content}</div>
                </td>
                <td style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(t.stars)}</td>
                <td><span className={`adm-badge ${t.is_active ? 'active' : 'inactive'}`}>{t.is_active ? 'Hiện' : 'Ẩn'}</span></td>
                <td>
                  <Link to={`/testimonials/${t.id}/edit`} className="adm-btn-ghost adm-btn-sm">Sửa</Link>
                  {' '}
                  <button onClick={() => handleDelete(t.id)} className="adm-btn-danger adm-btn-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="adm-empty">Chưa có đánh giá nào.</p>}
      </div>
    </div>
  )
}
