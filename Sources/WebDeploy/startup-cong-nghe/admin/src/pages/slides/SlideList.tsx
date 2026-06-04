import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Slide { id: number; title: string; subtitle: string; button_text: string; sort_order: number; status: string }

export default function SlideList() {
  const [items, setItems]   = useState<Slide[]>([])
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
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hero Slides</h1>
          <p className="page-sub">Quản lý slide trang chủ</p>
        </div>
        <Link to="/slides/new" className="btn btn-primary">+ Thêm slide</Link>
      </div>
      <div className="card">
        {items.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">▶</div><div className="empty-state-text">Chưa có slide nào</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tiêu đề</th><th>Phụ đề</th><th>Nút CTA</th><th>Thứ tự</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.title}</strong></td>
                    <td className="td-muted">{item.subtitle?.slice(0, 60)}{item.subtitle?.length > 60 ? '...' : ''}</td>
                    <td className="td-muted">{item.button_text}</td>
                    <td className="td-muted">{item.sort_order}</td>
                    <td><span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/slides/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
