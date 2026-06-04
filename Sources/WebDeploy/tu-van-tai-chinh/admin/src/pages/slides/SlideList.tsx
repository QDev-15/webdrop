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
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa slide này?')) return
    try { await api.delete(`/hero-slides/${id}`); load() }
    catch (e) { alert('Xóa thất bại.') }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>Hero Slides</h1>
        <Link to="/slides/new" className="btn btn-primary">+ Thêm slide</Link>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tiêu đề</th>
                <th>Nút</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '20px' }}>Đang tải...</td></tr>
              ) : slides.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '20px' }}>Chưa có slide</td></tr>
              ) : slides.map(s => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--text-3)' }}>{s.sort_order}</td>
                  <td>
                    <div style={{ fontWeight: '500' }}>{s.title}</div>
                    {s.subtitle && <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{s.subtitle.slice(0, 60)}...</div>}
                  </td>
                  <td style={{ fontSize: '13px' }}>{s.button_text || '—'}</td>
                  <td>
                    <span className={`badge ${s.status === 'published' ? 'badge-success' : 'badge-muted'}`}>
                      {s.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/slides/${s.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Xóa</button>
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
