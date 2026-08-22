import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Plan {
  id: number
  name: string
  tag: string
  price: string
  unit: string
  is_featured: number
  sort_order: number
  status: string
}

export default function PricingList() {
  const [items, setItems] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Plan[]>('/pricing-plans')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa gói giá này?')) return
    await api.delete(`/pricing-plans/${id}`)
    load()
  }

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bảng giá dịch vụ</div>
          <div className="page-sub">3 gói dịch vụ hiển thị ở trang Dịch vụ ({items.length} gói)</div>
        </div>
        <Link to="/pricing/new" className="btn-accent">+ Thêm gói giá</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <div className="empty-state-text">Chưa có gói giá nào. Thêm gói đầu tiên!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>
                  {p.name} {!!p.is_featured && <span className="badge badge-new" style={{ marginLeft: 8 }}>{p.tag || 'Nổi bật'}</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{p.price} {p.unit}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <span className={`badge badge-${p.status}`}>{p.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
                <Link to={`/pricing/${p.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button onClick={() => handleDelete(p.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
