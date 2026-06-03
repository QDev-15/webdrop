import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Project { id: number; title: string; category: string; industry: string; client: string; featured: number; status: string }

export default function ProjectList() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Project[]>('/projects').then(setItems).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const del = async (id: number) => {
    if (!confirm('Xóa dự án này?')) return
    await api.delete(`/projects/${id}`)
    load()
  }

  const catLabel = (c: string) => c === 'web' ? 'Website' : c === 'app' ? 'App' : 'Thương hiệu'

  return (
    <>
      <div className="page-hd">
        <div><h1 className="page-hd-title">Dự án / Portfolio</h1></div>
        <Link to="/projects/new" className="btn btn-primary">+ Thêm dự án</Link>
      </div>
      <div className="card">
        {loading ? <p className="text-muted">Đang tải...</p> : (
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>#</th><th>Tên dự án</th><th>Loại</th><th>Ngành</th><th>Khách hàng</th><th>Nổi bật</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td className="td-name">{p.title}</td>
                    <td>{catLabel(p.category)}</td>
                    <td>{p.industry}</td>
                    <td>{p.client}</td>
                    <td>{p.featured ? '⭐' : '—'}</td>
                    <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/projects/${p.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                        <button onClick={() => del(p.id)} className="btn btn-danger btn-sm">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && <tr><td colSpan={8} className="text-center text-muted" style={{ padding: '32px' }}>Chưa có dự án nào.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
