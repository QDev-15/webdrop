import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface MenuItem {
  id: number
  name: string
  category_id: number | null
  category_name: string
  price: number
  price_sale: number | null
  image: string
  featured: number
  status: string
  sort_order: number
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
    if (!confirm('Xóa món ăn này?')) return
    await api.delete(`/menu-items/${id}`)
    load()
  }

  const filtered = filter ? items.filter(i => i.category_name === filter) : items
  const cats = [...new Set(items.map(i => i.category_name).filter(Boolean))]

  if (loading) return <div style={{ padding: 32, color: 'var(--text-3)' }}>Đang tải...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Món ăn</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{items.length} món ăn</p>
        </div>
        <Link to="/menu-items/new" className="btn-accent" style={{ textDecoration: 'none' }}>+ Thêm món</Link>
      </div>

      {cats.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <button onClick={() => setFilter('')} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)', background: !filter ? 'var(--accent)' : 'var(--surface)', color: !filter ? '#fff' : 'var(--text-2)', cursor: 'pointer' }}>
            Tất cả ({items.length})
          </button>
          {cats.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)', background: filter === cat ? 'var(--accent)' : 'var(--surface)', color: filter === cat ? '#fff' : 'var(--text-2)', cursor: 'pointer' }}>
              {cat} ({items.filter(i => i.category_name === cat).length})
            </button>
          ))}
        </div>
      )}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Không có món ăn nào</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Tên món', 'Danh mục', 'Giá', 'Nổi bật', 'Trạng thái', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {item.image ? (
                        <img src={item.image} alt="" style={{ width: 44, height: 36, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 44, height: 36, borderRadius: 6, background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🍽</div>
                      )}
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)' }}>{item.category_name || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                    {item.price?.toLocaleString('vi-VN')}đ
                    {item.price_sale != null && <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 400, textDecoration: 'line-through' }}>{item.price_sale?.toLocaleString('vi-VN')}đ</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {item.featured ? <span style={{ fontSize: 12 }}>⭐</span> : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: item.status === 'published' ? 'var(--accent-light)' : 'var(--warm)', color: item.status === 'published' ? 'var(--accent)' : 'var(--text-3)', fontWeight: 500 }}>
                      {item.status === 'published' ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/menu-items/${item.id}/edit`} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', textDecoration: 'none' }}>Sửa</Link>
                      <button onClick={() => handleDelete(item.id)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '1px solid #fdd', background: '#fff0f0', color: 'var(--danger)', cursor: 'pointer' }}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
