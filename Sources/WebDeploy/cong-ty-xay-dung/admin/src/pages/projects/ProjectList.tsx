import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Project {
  id: number
  title: string
  category: string
  category_name: string
  location: string
  year: string
  image: string
  featured: number
  status: string
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setProjects(await api.get('/projects')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Xóa dự án "${title}"?`)) return
    await api.delete(`/projects/${id}`)
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dự án / Công trình</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Quản lý portfolio công trình</p>
        </div>
        <Link to="/projects/new" className="btn btn-primary">+ Thêm dự án</Link>
      </div>

      {loading ? (
        <div className="card"><p style={{ color: 'var(--text-3)' }}>Đang tải...</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên công trình</th>
                <th>Danh mục</th>
                <th>Địa điểm</th>
                <th>Năm</th>
                <th>Nổi bật</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image && <img src={p.image} className="img-preview" alt={p.title} />}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{p.title}</td>
                  <td>{p.category_name || p.category || '—'}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{p.location || '—'}</td>
                  <td style={{ color: 'var(--text-3)' }}>{p.year || '—'}</td>
                  <td>{p.featured ? '⭐' : '—'}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status === 'published' ? 'Hiển thị' : 'Nháp'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/projects/${p.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.title)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🏗</div>
              <div className="empty-state-text">Chưa có dự án nào.</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
