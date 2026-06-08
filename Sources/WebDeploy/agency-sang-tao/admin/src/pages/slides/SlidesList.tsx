import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  image: string
  sort_order: number
  status: string
}

export default function SlidesList() {
  const [items, setItems]   = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Slide[]>('/hero-slides')
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa slide này?')) return
    await api.delete(`/hero-slides/${id}`)
    load()
  }

  return (
    <AdminLayout title="Hero Slides">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hero Slides</h1>
          <p className="page-sub">Quản lý slider trang chủ</p>
        </div>
        <Link to="/slides/new" className="btn-accent">+ Thêm slide</Link>
      </div>

      {loading ? (
        <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Đang tải...</div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Button</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.image
                      ? <img src={item.image} alt="" className="thumb" />
                      : <div style={{ width: 48, height: 48, background: 'var(--warm)', borderRadius: 8 }} />}
                  </td>
                  <td style={{ maxWidth: 240 }}>
                    <div style={{ fontWeight: 500 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{item.subtitle?.substring(0, 60)}...</div>
                  </td>
                  <td>{item.button_text || '—'}</td>
                  <td>
                    <span className={`badge badge-${item.status === 'published' ? 'published' : 'draft'}`}>
                      {item.status === 'published' ? 'Đã đăng' : 'Nháp'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/slides/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>Chưa có slide nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
