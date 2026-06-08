import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface Project {
  id: number
  title: string
  category: string
  image: string
  client_name: string
  featured: number
  status: string
}

export default function ProjectsList() {
  const [items, setItems]     = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Project[]>('/projects').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa dự án này?')) return
    await api.delete(`/projects/${id}`)
    load()
  }

  return (
    <AdminLayout title="Dự án">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dự án</h1>
          <p className="page-sub">Quản lý portfolio dự án</p>
        </div>
        <Link to="/projects/new" className="btn-accent">+ Thêm dự án</Link>
      </div>
      {loading ? (
        <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Đang tải...</div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Ảnh</th><th>Tiêu đề</th><th>Danh mục</th><th>Khách hàng</th><th>Nổi bật</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.image ? <img src={item.image} alt="" className="thumb" /> : <div style={{ width: 48, height: 48, background: 'var(--warm)', borderRadius: 8 }} />}</td>
                  <td style={{ fontWeight: 500 }}>{item.title}</td>
                  <td><span className="badge badge-draft">{item.category}</span></td>
                  <td>{item.client_name || '—'}</td>
                  <td>{item.featured ? '⭐' : '—'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/projects/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>Chưa có dự án nào</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
