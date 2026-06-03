import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Slide {
  id: number; title: string; badge_text: string; status: string; sort_order: number; image: string
}

export default function SlideList() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Slide[]>('/hero-slides').then(setSlides).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const del = async (id: number) => {
    if (!confirm('Xóa slide này?')) return
    await api.delete(`/hero-slides/${id}`)
    load()
  }

  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="page-hd-title">Hero Slides</h1>
          <div className="page-hd-sub">Quản lý slide trang chủ</div>
        </div>
        <Link to="/slides/new" className="btn btn-primary">+ Thêm slide</Link>
      </div>

      <div className="card">
        {loading ? <p className="text-muted">Đang tải...</p> : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Ảnh</th><th>Tiêu đề</th><th>Badge</th><th>Trạng thái</th><th>Thứ tự</th><th></th></tr>
              </thead>
              <tbody>
                {slides.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.image && <img src={s.image} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />}</td>
                    <td className="td-name" dangerouslySetInnerHTML={{ __html: s.title }} />
                    <td>{s.badge_text}</td>
                    <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                    <td>{s.sort_order}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/slides/${s.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                        <button onClick={() => del(s.id)} className="btn btn-danger btn-sm">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!slides.length && <tr><td colSpan={7} className="text-center text-muted" style={{ padding: '32px' }}>Chưa có slide nào.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
