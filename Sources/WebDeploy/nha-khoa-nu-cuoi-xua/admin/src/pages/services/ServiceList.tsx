import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Service {
  id: number
  name: string
  category_id: number | null
  category_name: string
  tag: string
  price: string
  price_unit: string
  sort_order: number
  is_active: number
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
          <div className="page-title">Dich vu nha khoa</div>
          <div className="page-subtitle">Quan ly danh sach dich vu Nu Cuoi Xua</div>
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
                <th>Ten dich vu</th>
                <th>Nhom</th>
                <th>Tag</th>
                <th>Gia</th>
                <th>Thu tu</th>
                <th>Hien thi</th>
                <th>Hanh dong</th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td style={{ color: 'var(--text-2)', fontSize: '13px' }}>{s.category_name || '—'}</td>
                  <td style={{ color: 'var(--text-3)', fontSize: '12px' }}>{s.tag}</td>
                  <td style={{ color: 'var(--accent)', fontWeight: 500 }}>{s.price} {s.price_unit}</td>
                  <td style={{ color: 'var(--text-2)' }}>{s.sort_order}</td>
                  <td>{s.is_active ? <span style={{ color: 'var(--accent)' }}>Co</span> : <span style={{ color: 'var(--text-3)' }}>An</span>}</td>
                  <td>
                    <div className="td-actions">
                      <Link to={`/services/${s.id}/edit`} className="btn-ghost btn-sm">Sua</Link>
                      <button onClick={() => handleDelete(s.id)} className="btn-danger btn-sm">Xoa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>Chua co dich vu nao</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
