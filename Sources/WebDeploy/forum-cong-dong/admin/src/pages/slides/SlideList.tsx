import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

export default function SlideList() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setSlides(await api.get<Slide[]>('/hero-slides')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa slide này?')) return
    await api.delete(`/hero-slides/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hero Slides</div>
          <div className="page-sub">Quản lý banner slider trang chủ</div>
        </div>
        <Link to="/slides/new" className="btn-accent">+ Thêm slide</Link>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-3)' }}>Đang tải...</div>
      ) : slides.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🖼</div>
          <div className="empty-state-text">Chưa có slide nào</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {slides.map(s => (
                <tr key={s.id}>
                  <td>
                    {s.image && (
                      <img src={s.image} alt={s.title} className="thumb" />
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{s.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{s.subtitle?.slice(0, 60)}{(s.subtitle?.length ?? 0) > 60 ? '...' : ''}</div>
                  </td>
                  <td>{s.sort_order}</td>
                  <td>
                    <span className={`badge badge-${s.status}`}>{s.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/slides/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Xóa</button>
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
