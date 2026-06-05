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

  const load = () => {
    setLoading(true)
    api.get<Slide[]>('/hero-slides')
      .then(setSlides)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa slide này?')) return
    await api.delete(`/hero-slides/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Hero Slides</div>
          <div className="page-sub">Quản lý ảnh và nội dung slider trang chủ</div>
        </div>
        <Link to="/slides/new" className="btn-accent">+ Thêm slide</Link>
      </div>

      {loading ? <div className="empty-state"><div className="empty-state-text">Đang tải...</div></div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Ảnh</th><th>Tiêu đề</th><th>Nút</th><th>Thứ tự</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {slides.map(s => (
                <tr key={s.id}>
                  <td>
                    {s.image ? <img src={s.image} className="thumb" alt={s.title} /> : <div className="thumb" style={{ background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🖼</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{s.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{s.subtitle?.slice(0, 60)}{s.subtitle?.length > 60 ? '...' : ''}</div>
                  </td>
                  <td style={{ fontSize: '12.5px' }}>{s.button_text || '—'}</td>
                  <td>{s.sort_order}</td>
                  <td><span className={`badge ${s.status === 'published' ? 'badge-published' : 'badge-draft'}`}>{s.status === 'published' ? 'Công khai' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/slides/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {slides.length === 0 && <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">🖼</div><div className="empty-state-text">Chưa có slide nào</div></div></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
