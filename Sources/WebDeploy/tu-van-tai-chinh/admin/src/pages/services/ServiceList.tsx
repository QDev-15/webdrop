import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service { id: number; name: string; description: string; price: string; featured: number; sort_order: number; status: string }

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
    await api.delete(`/services/${id}`); load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)' }}>Dịch vụ tư vấn</h1>
        <Link to="/services/new" className="btn btn-primary">+ Thêm dịch vụ</Link>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tên dịch vụ</th><th>Giá / Chi phí</th><th>Nổi bật</th><th>Trạng thái</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3)' }}>Đang tải...</td></tr>
              : items.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: '500' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{s.description?.slice(0, 60)}...</div>
                  </td>
                  <td style={{ fontSize: '13px' }}>{s.price || '—'}</td>
                  <td>{s.featured ? <span className="badge badge-success">Có</span> : '—'}</td>
                  <td><span className={`badge ${s.status === 'published' ? 'badge-success' : 'badge-muted'}`}>{s.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/services/${s.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
