import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service { id: number; name: string; tag: string; status: string; sort_order: number; items: unknown[] }

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Service[]>('/services')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa lĩnh vực này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <>
      <div className="page-hdr">
        <h1>Lĩnh vực hành nghề</h1>
        <Link to="/services/new" className="btn btn-primary">+ Thêm lĩnh vực</Link>
      </div>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Tên lĩnh vực</th><th>Tag</th><th>Số dịch vụ</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td style={{ color: 'var(--text-2)' }}>{item.tag}</td>
                <td>{item.items?.length || 0} mục</td>
                <td>{item.sort_order}</td>
                <td><span className={`badge badge-${item.status}`}>{item.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link to={`/services/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
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
