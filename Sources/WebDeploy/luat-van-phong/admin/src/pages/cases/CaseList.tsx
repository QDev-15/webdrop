import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Case { id: number; title: string; category: string; year: number; location: string; status: string }

export default function CaseList() {
  const [items, setItems] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Case[]>('/cases')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa vụ việc này?')) return
    await api.delete(`/cases/${id}`)
    load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <>
      <div className="page-hdr">
        <h1>Vụ việc tiêu biểu</h1>
        <Link to="/cases/new" className="btn btn-primary">+ Thêm vụ việc</Link>
      </div>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Tiêu đề</th><th>Danh mục</th><th>Năm</th><th>Địa điểm</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</td>
                <td><span className="badge badge-published">{item.category}</span></td>
                <td>{item.year}</td>
                <td style={{ color: 'var(--text-2)', fontSize: '12px' }}>{item.location}</td>
                <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link to={`/cases/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
