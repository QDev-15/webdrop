import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  featured: number
  status: string
  category_name: string
  sort_order: number
}

export default function MenuItemList() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    api.get<MenuItem[]>('/menu-items').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa món này?')) return
    await api.delete(`/menu-items/${id}`)
    load()
  }

  const filtered = filter ? items.filter(i => i.category_name === filter) : items
  const categories = [...new Set(items.map(i => i.category_name).filter(Boolean))]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Món & Đồ uống</div>
          <div className="page-sub">{items.length} món trong thực đơn</div>
        </div>
        <Link to="/menu-items/new" className="btn-accent">+ Thêm món</Link>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button className={`btn-ghost btn-sm${!filter ? ' active' : ''}`} onClick={() => setFilter('')} style={!filter ? { background: 'var(--accent-light)', borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}>Tất cả</button>
        {categories.map(c => (
          <button key={c} className={`btn-ghost btn-sm`} onClick={() => setFilter(c)} style={filter === c ? { background: 'var(--accent-light)', borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}>
            {c}
          </button>
        ))}
      </div>

      {loading ? <div className="empty-state"><div className="empty-state-text">Đang tải...</div></div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Ảnh</th><th>Tên món</th><th>Danh mục</th><th>Giá</th><th>Nổi bật</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>{item.image ? <img src={item.image} className="thumb" alt={item.name} /> : <div className="thumb" style={{ background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>☕</div>}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{item.description?.slice(0, 50)}</div>
                  </td>
                  <td style={{ fontSize: '12.5px', color: 'var(--text-2)' }}>{item.category_name || '—'}</td>
                  <td style={{ fontWeight: 500, color: 'var(--accent)' }}>{item.price.toLocaleString('vi-VN')}đ</td>
                  <td>{item.featured ? <span className="badge badge-confirmed">Nổi bật</span> : '—'}</td>
                  <td><span className={`badge ${item.status === 'published' ? 'badge-published' : 'badge-draft'}`}>{item.status === 'published' ? 'Công khai' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/menu-items/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">☕</div><div className="empty-state-text">Không có món nào</div></div></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
