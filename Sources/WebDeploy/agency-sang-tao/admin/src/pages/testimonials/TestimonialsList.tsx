import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
  status: string
}

export default function TestimonialsList() {
  const [items, setItems]     = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Testimonial[]>('/testimonials').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa đánh giá này?')) return
    await api.delete(`/testimonials/${id}`)
    load()
  }

  return (
    <AdminLayout title="Đánh giá">
      <div className="page-header">
        <div>
          <h1 className="page-title">Đánh giá khách hàng</h1>
          <p className="page-sub">Quản lý testimonials</p>
        </div>
        <Link to="/testimonials/new" className="btn-accent">+ Thêm đánh giá</Link>
      </div>
      {loading ? (
        <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Đang tải...</div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Avatar</th><th>Tác giả</th><th>Nội dung</th><th>Sao</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.author_avatar ? <img src={item.author_avatar} alt="" className="thumb" style={{ borderRadius: '50%' }} /> : <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--warm)' }} />}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{item.author_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{item.author_title}</div>
                  </td>
                  <td style={{ maxWidth: 300, fontSize: 13, color: 'var(--text-2)' }}>{item.content?.substring(0, 80)}...</td>
                  <td>{'★'.repeat(item.rating)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/testimonials/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>Chưa có đánh giá nào</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
