import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Slide {
  id: number; title: string; subtitle: string; button_text: string; sort_order: number; status: string
}

export default function SlideList() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Slide[]>('/hero-slides').then(setSlides).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa slide này?')) return
    await api.delete(`/hero-slides/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Hero Slides</div>
          <div className="page-subtitle">Quản lý slider trang chủ</div>
        </div>
        <Link to="/slides/new" className="btn-accent">+ Thêm slide</Link>
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
      ) : slides.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">🖼</div><div className="empty-state-text">Chưa có slide nào.</div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Tiêu đề</th><th>Phụ đề</th><th>Nút CTA</th><th>Thứ tự</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
            <tbody>
              {slides.map(s => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--text-3)', fontSize: '12px' }}>{s.id}</td>
                  <td style={{ fontWeight: 500 }}>{s.title}</td>
                  <td style={{ color: 'var(--text-2)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.subtitle}</td>
                  <td>{s.button_text || <span style={{ color: 'var(--text-3)' }}>—</span>}</td>
                  <td>{s.sort_order}</td>
                  <td><span className={`badge badge-${s.status}`}><span className="badge-dot" />{s.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/slides/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(s.id)} className="btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
