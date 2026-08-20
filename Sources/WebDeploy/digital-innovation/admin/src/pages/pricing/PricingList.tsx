import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface PricingPlan {
  id: number
  name: string
  price: string
  description: string
  features: string
  is_featured: number
  cta_text: string
  cta_link: string
  sort_order: number
  status: string
  created_at: string
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
          <div className="page-title">Bảng giá dịch vụ</div>
          <div className="page-sub">Hiển thị ở trang Dịch vụ ({items.length} gói)</div>
        </div>
        <Link to="/pricing/new" className="btn-accent">+ Thêm gói giá</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <div className="empty-state-text">Chưa có gói giá nào. Thêm gói đầu tiên!</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên gói</th>
                <th>Giá</th>
                <th style={{ width: 90 }}>Nổi bật</th>
                <th style={{ width: 80 }}>Thứ tự</th>
                <th style={{ width: 100 }}>Trạng thái</th>
                <th style={{ width: 140 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(pc => (
                <tr key={pc.id}>
                  <td style={{ fontWeight: 600 }}>{pc.name}</td>
                  <td style={{ color: 'var(--text-2)' }}>{pc.price}</td>
                  <td>{pc.is_featured === 1 ? '⭐ Có' : '—'}</td>
                  <td>{pc.sort_order}</td>
                  <td><span className={`badge badge-${pc.status}`}>{pc.status === 'published' ? 'Đang hiện' : 'Ẩn'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/pricing/${pc.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(pc.id)} className="btn-danger btn-sm">Xóa</button>
                    </div>
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
