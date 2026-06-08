import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  description: string
  icon: string
  featured: number
  sort_order: number
  status: string
}

export default function ServicesList() {
  const [items, setItems]     = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<Service[]>('/services').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa dịch vụ này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  return (
    <AdminLayout title="Dịch vụ">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dịch vụ</h1>
          <p className="page-sub">Quản lý các dịch vụ của agency</p>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>
      {loading ? (
        <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Đang tải...</div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Icon</th><th>Tên dịch vụ</th><th>Mô tả</th><th>Nổi bật</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontSize: '24px' }}>{item.icon || '◆'}</td>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td style={{ maxWidth: 300, color: 'var(--text-2)', fontSize: 13 }}>{item.description?.substring(0, 80)}...</td>
                  <td>{item.featured ? '⭐' : '—'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/services/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>Chưa có dịch vụ nào</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
