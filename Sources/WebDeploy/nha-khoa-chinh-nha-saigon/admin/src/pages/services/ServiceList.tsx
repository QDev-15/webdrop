import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  number: string
  name: string
  price: string
  duration: string
  badge: string
  is_featured: number
  sort_order: number
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Service[]>('/services').then(setItems).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xoa dich vu nay?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Dich vu nieng rang</div>
          <div className="page-subtitle">Quan ly cac giai phap chinh nha</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Them dich vu</Link>
      </div>
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Dang tai...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Ten dich vu</th>
                <th>Gia tu</th>
                <th>Thoi gian</th>
                <th>Badge</th>
                <th>Noi bat</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--text-3)', fontSize: '12px', fontWeight: 600 }}>{s.number || s.id}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td style={{ color: 'var(--text-2)' }}>{s.price}</td>
                  <td style={{ color: 'var(--text-2)' }}>{s.duration}</td>
                  <td>{s.badge && <span className="badge badge-published"><span className="badge-dot" />{s.badge}</span>}</td>
                  <td>{s.is_featured ? <span style={{ color: 'var(--accent)' }}>Co</span> : <span style={{ color: 'var(--text-3)' }}>Khong</span>}</td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/services/${s.id}/edit`} className="btn-ghost btn-sm">Sua</Link>
                      <button onClick={() => handleDelete(s.id)} className="btn-danger btn-sm">Xoa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
