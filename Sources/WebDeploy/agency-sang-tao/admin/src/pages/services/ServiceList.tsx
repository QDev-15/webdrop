import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  number: string
  description: string
  featured: number
  sort_order: number
  status: string
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Service[]>('/services')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa dịch vụ này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  if (loading) return <div style={{ color: 'var(--text-3)', fontSize: '14px' }}>Đang tải...</div>

  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="page-hd-title">Dịch vụ</h1>
          <div className="page-hd-sub">{items.length} dịch vụ</div>
        </div>
        <Link to="/services/new" className="btn btn-primary btn-sm">+ Thêm dịch vụ</Link>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên dịch vụ</th>
                <th>Số thứ tự</th>
                <th>Nổi bật</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)' }}>Chưa có dịch vụ</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="td-name">{item.name}</td>
                  <td>{item.number || '—'}</td>
                  <td>{item.featured ? '★' : '—'}</td>
                  <td>{item.sort_order}</td>
                  <td><span className={`badge ${item.status === 'published' ? 'badge-published' : 'badge-draft'}`}>{item.status === 'published' ? 'Hiện' : 'Ẩn'}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/services/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
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
