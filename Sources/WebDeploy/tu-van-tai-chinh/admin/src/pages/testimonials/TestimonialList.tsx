import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Testimonial { id: number; author_name: string; author_title: string; content: string; rating: number; sort_order: number; status: string }

export default function TestimonialList() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Testimonial[]>('/testimonials')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa đánh giá này?')) return
    await api.delete(`/testimonials/${id}`); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>Đánh giá khách hàng</h1>
        <Link to="/testimonials/new" className="btn btn-primary">+ Thêm đánh giá</Link>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tác giả</th><th>Chức vụ</th><th>Nội dung</th><th>Sao</th><th>Trạng thái</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)' }}>Đang tải...</td></tr>
              : items.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: '500' }}>{t.author_name}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-3)' }}>{t.author_title}</td>
                  <td style={{ fontSize: '13px' }}>{t.content?.slice(0, 60)}...</td>
                  <td style={{ color: '#f59e0b' }}>{'★'.repeat(t.rating)}</td>
                  <td><span className={`badge ${t.status === 'published' ? 'badge-success' : 'badge-muted'}`}>{t.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/testimonials/${t.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
