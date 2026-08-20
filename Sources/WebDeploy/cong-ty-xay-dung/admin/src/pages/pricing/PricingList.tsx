import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface PricingPlan {
  id: number
  name: string
  price: string
  is_featured: number
  sort_order: number
  status: string
}

export default function PricingList() {
  const [items, setItems] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setItems(await api.get<PricingPlan[]>('/pricing-plans'))
    } finally {
      setLoading(false)
    }
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
          <div className="page-sub">Quản lý các gói dịch vụ hiển thị trên trang Dịch vụ</div>
        </div>
        <Link to="/pricing/new" className="btn-accent">+ Thêm gói giá</Link>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <div className="empty-state-text">Chưa có gói giá nào</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tên gói</th>
                <th>Giá</th>
                <th>Nổi bật</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.price}</td>
                  <td>
                    {item.is_featured ? <span className="badge badge-published">Có</span> : <span className="badge badge-draft">Không</span>}
                  </td>
                  <td style={{ fontSize: 13 }}>{item.sort_order}</td>
                  <td>
                    <span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/pricing/${item.id}`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
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
