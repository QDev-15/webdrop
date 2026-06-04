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
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setServices(await api.get('/services')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa dịch vụ "${name}"?`)) return
    await api.delete(`/services/${id}`)
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dịch vụ</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Quản lý các dịch vụ xây dựng</p>
        </div>
        <Link to="/services/new" className="btn btn-primary">+ Thêm dịch vụ</Link>
      </div>

      {loading ? (
        <div className="card"><p style={{ color: 'var(--text-3)' }}>Đang tải...</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên dịch vụ</th>
                <th>Nổi bật</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--text-3)', fontWeight: 600 }}>{s.number || '—'}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{s.description?.substring(0, 60)}...</div>
                  </td>
                  <td>{s.featured ? '⭐' : '—'}</td>
                  <td>{s.sort_order}</td>
                  <td><span className={`badge badge-${s.status}`}>{s.status === 'published' ? 'Hiển thị' : 'Nháp'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/services/${s.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id, s.name)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔨</div>
              <div className="empty-state-text">Chưa có dịch vụ nào.</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
