import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number; category_id: number | null; name: string; tag: string
  description: string; price: string; duration: string; image: string
  featured: number; sort_order: number; category_name?: string
}

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try { setServices(await api.get<Service[]>('/services')) }
    catch { setError('Không thể tải dịch vụ.') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function remove(id: number) {
    if (!confirm('Xóa dịch vụ này?')) return
    try { await api.delete(`/services/${id}`); load() }
    catch (e) { setError(e instanceof Error ? e.message : 'Lỗi xóa') }
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Dịch vụ</div></div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? <div className="admin-loading">Đang tải...</div> : (
        <div className="card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th><th>Tên dịch vụ</th><th>Danh mục</th><th>Giá</th><th>Thời gian</th><th>Nổi bật</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  <td>
                    {s.image ? <img src={s.image} alt={s.name} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 8 }} /> : <span style={{ color: 'var(--text-3)' }}>—</span>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{s.name}</div>
                    {s.tag && <span style={{ fontSize: 11, background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 20 }}>{s.tag}</span>}
                  </td>
                  <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{s.category_name || '—'}</td>
                  <td style={{ fontWeight: 500, color: 'var(--accent)' }}>{s.price}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{s.duration}</td>
                  <td>{s.featured ? '⭐' : '—'}</td>
                  <td>
                    <Link to={`/services/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button className="btn-ghost btn-sm" style={{ color: 'var(--danger)', marginLeft: 6 }} onClick={() => remove(s.id)}>Xóa</button>
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
