import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Project {
  id: number
  title: string
  category: string
  client: string
  featured: number
  sort_order: number
  status: string
}

export default function ProjectList() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Project[]>('/projects')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa dự án này?')) return
    await api.delete(`/projects/${id}`)
    load()
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>

  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="page-hd-title">Dự án / Portfolio</h1>
          <div className="page-hd-sub">{items.length} dự án</div>
        </div>
        <Link to="/projects/new" className="btn btn-primary btn-sm">+ Thêm dự án</Link>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Khách hàng</th>
                <th>Nổi bật</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)' }}>Chưa có dự án</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="td-name">{item.title}</td>
                  <td>{item.category || '—'}</td>
                  <td>{item.client || '—'}</td>
                  <td>{item.featured ? '★' : '—'}</td>
                  <td><span className={`badge ${item.status === 'published' ? 'badge-published' : 'badge-draft'}`}>{item.status === 'published' ? 'Hiện' : 'Ẩn'}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/projects/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
