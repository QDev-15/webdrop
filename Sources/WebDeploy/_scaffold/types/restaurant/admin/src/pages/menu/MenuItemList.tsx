import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface MenuItem {
  id: number
  name: string
  category_name: string
  price: number | null
  badge: string
  featured: number
  status: string
  sort_order: number
  image: string
}

export default function MenuItemList() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<MenuItem[]>('/menu-items')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xoa mon an nay?')) return
    await api.delete(`/menu-items/${id}`)
    load()
  }

  const filtered = items.filter(i =>
    !filter || i.name.toLowerCase().includes(filter.toLowerCase()) ||
    (i.category_name ?? '').toLowerCase().includes(filter.toLowerCase())
  )

  function formatPrice(price: number | null): string {
    if (price == null) return '—'
    return price.toLocaleString('vi-VN') + 'd'
  }

  if (loading) return <div className="admin-loading">Dang tai...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Mon an</div>
          <div className="page-sub">{items.length} mon an</div>
        </div>
        <Link to="/menu-items/new" className="btn-accent">+ Them mon an</Link>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Tim kiem ten mon, danh muc..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Anh</th>
              <th>Ten mon</th>
              <th>Danh muc</th>
              <th>Gia</th>
              <th>Trang thai</th>
              <th>Thao tac</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td>
                  {item.image
                    ? <img src={item.image} alt={item.name} className="thumb" />
                    : <div className="thumb" style={{ background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍽</div>
                  }
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  {item.badge && <span style={{ fontSize: 11, background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4 }}>{item.badge}</span>}
                  {item.featured === 1 && <span style={{ fontSize: 11, background: '#fffbeb', color: '#92400e', padding: '2px 8px', borderRadius: 4, marginLeft: 4 }}>Noi bat</span>}
                </td>
                <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{item.category_name ?? '—'}</td>
                <td style={{ fontWeight: 500 }}>{formatPrice(item.price)}</td>
                <td><span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hien' : 'An'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/menu-items/${item.id}/edit`} className="btn-ghost btn-sm">Sua</Link>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xoa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">🍽</div><div className="empty-state-text">Khong tim thay mon an.</div></div>}
      </div>
    </div>
  )
}
