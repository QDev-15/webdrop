import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Product {
  id: number
  name: string
  category_name: string
  price: number | null
  price_note: string
  tag: string
  featured: number
  status: string
  sort_order: number
  image: string
}

export default function MenuItemList() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Product[]>('/products')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa sản phẩm này?')) return
    await api.delete(`/products/${id}`)
    load()
  }

  const filtered = items.filter(i =>
    !filter || i.name.toLowerCase().includes(filter.toLowerCase()) ||
    (i.category_name ?? '').toLowerCase().includes(filter.toLowerCase())
  )

  function formatPrice(price: number | null, note: string): string {
    if (note) return note
    if (price == null || price === 0) return '—'
    return price.toLocaleString('vi-VN') + 'đ'
  }

  const tagLabels: Record<string, string> = {
    bestseller: '★ Bestseller',
    new: '✦ Mới',
    seasonal: '🌸 Theo mùa',
    custom: '🎨 Custom',
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Sản phẩm bánh</div>
          <div className="page-sub">{items.length} sản phẩm</div>
        </div>
        <Link to="/products/new" className="btn-accent">+ Thêm sản phẩm</Link>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm tên sản phẩm, danh mục..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td>
                  {item.image
                    ? <img src={item.image} alt={item.name} className="thumb" />
                    : <div className="thumb" style={{ background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎂</div>
                  }
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  {item.tag && <span style={{ fontSize: 11, background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4 }}>{tagLabels[item.tag] ?? item.tag}</span>}
                  {item.featured === 1 && <span style={{ fontSize: 11, background: '#fffbeb', color: '#92400e', padding: '2px 8px', borderRadius: 4, marginLeft: 4 }}>Nổi bật</span>}
                </td>
                <td style={{ color: 'var(--text-2)', fontSize: 13 }}>{item.category_name ?? '—'}</td>
                <td style={{ fontWeight: 500 }}>{formatPrice(item.price, item.price_note)}</td>
                <td><span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiện' : 'Ẩn'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/products/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger btn-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">🎂</div><div className="empty-state-text">Không tìm thấy sản phẩm.</div></div>}
      </div>
    </div>
  )
}
