import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Category {
  id: number
  name: string
}

interface Service {
  id: number
  category_id: number
  name: string
  note: string
  description: string
  price_text: string
  image: string
  is_featured: number
  sort_order: number
  status: string
}

export default function ServiceList() {
  const [items, setItems] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<number | ''>('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [svcs, cats] = await Promise.all([
        api.get<Service[]>('/services'),
        api.get<Category[]>('/service-categories'),
      ])
      setItems(svcs)
      setCategories(cats)
    } finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa dịch vụ này?')) return
    await api.delete(`/services/${id}`)
    load()
  }

  const catName = (id: number) => categories.find(c => c.id === id)?.name ?? '—'
  const filtered = filter === '' ? items : items.filter(i => i.category_id === filter)

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dịch vụ & Bảng giá</div>
          <div className="page-sub">{items.length} dịch vụ</div>
        </div>
        <Link to="/services/new" className="btn-accent">+ Thêm dịch vụ</Link>
      </div>

      <div style={{ marginBottom: 16 }}>
        <select className="form-control" style={{ maxWidth: 280 }} value={filter} onChange={e => setFilter(e.target.value ? parseInt(e.target.value) : '')}>
          <option value="">Tất cả danh mục</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✂</div>
          <div className="empty-state-text">Chưa có dịch vụ nào. Thêm dịch vụ đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên dịch vụ</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Nổi bật</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    {s.image
                      ? <img src={s.image} alt={s.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                      : <div style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border)' }} />}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{s.name}</div>
                    {s.note && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.note}</div>}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{catName(s.category_id)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{s.price_text}</td>
                  <td>{s.is_featured ? '★' : ''}</td>
                  <td><span className={`badge badge-${s.status}`}>{s.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span></td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/services/${s.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(s.id)} className="btn-danger btn-sm">Xóa</button>
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
