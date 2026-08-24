import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface PricingPlan {
  id: number
  name: string
  price: string
  note: string
  is_featured: number
  sort_order: number
  status: string
}

export default function PricingList() {
  const [items, setItems] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<PricingPlan[]>('/pricing-plans')) }
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
          <div className="page-title">Bảng giá</div>
          <div className="page-sub">Hiển thị trang Dịch vụ ({items.length} gói)</div>
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
          {items.map(pl => (
            <div key={pl.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  {pl.name} <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>— {pl.price}</span>
                  {!!pl.is_featured && <span className="badge badge-published" style={{ marginLeft: 8 }}>Nổi bật</span>}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{pl.note}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                <span className={`badge badge-${pl.status}`}>{pl.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span>
                <Link to={`/pricing/${pl.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                <button onClick={() => handleDelete(pl.id)} className="btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
