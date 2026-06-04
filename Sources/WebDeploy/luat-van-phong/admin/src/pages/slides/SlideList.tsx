import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Slide { id: number; title: string; subtitle: string; status: string; sort_order: number; image: string }

export default function SlideList() {
  const [items, setItems] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Slide[]>('/hero-slides')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa slide này?')) return
    await api.delete(`/hero-slides/${id}`)
    load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <>
      <div className="page-hdr">
        <h1>Hero Slides</h1>
        <Link to="/slides/new" className="btn btn-primary">+ Thêm slide</Link>
      </div>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tiêu đề</th>
              <th>Phụ đề</th>
              <th>Thứ tự</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.image && <img src={item.image} alt="" className="img-preview" />}</td>
                <td style={{ fontWeight: 500 }}>{item.title}</td>
                <td style={{ color: 'var(--text-2)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subtitle}</td>
                <td>{item.sort_order}</td>
                <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link to={`/slides/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-title">Chưa có slide nào</div></div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
