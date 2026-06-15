import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Project {
  id: number
  title: string
  category: string
  description: string
  image: string
  featured: number
  sort_order: number
  status: string
}

export default function ProjectList() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    try { setItems(await api.get<Project[]>('/projects')) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa dự án này?')) return
    await api.delete(`/projects/${id}`)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dự án</div>
          <div className="page-sub">Quản lý danh mục các dự án trong portfolio</div>
        </div>
        <Link to="/projects/new" className="btn-accent">+ Thêm dự án</Link>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🗂</div>
          <div className="empty-state-text">Chưa có dự án nào</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Dự án</th>
                <th>Danh mục</th>
                <th>Nổi bật</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image && <img src={p.image} alt={p.title} className="thumb" />}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.title}</div>
                    {p.description && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{p.description.slice(0, 60)}...</div>}
                  </td>
                  <td style={{ fontSize: 12 }}>{p.category || '—'}</td>
                  <td>
                    {p.featured === 1 && <span className="badge badge-confirmed">Nổi bật</span>}
                  </td>
                  <td>
                    <span className={`badge badge-${p.status}`}>{p.status === 'published' ? 'Hiển thị' : 'Nháp'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/projects/${p.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(p.id)} className="btn-danger btn-sm">Xóa</button>
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
