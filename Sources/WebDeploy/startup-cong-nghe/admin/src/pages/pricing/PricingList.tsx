import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Plan { id: number; name: string; price_monthly: number; price_yearly: number; is_featured: number; is_free: number; sort_order: number; status: string }

function formatPrice(p: number) {
  if (p === 0) return 'Miễn phí'
  return p.toLocaleString('vi-VN') + 'đ'
}

export default function PricingList() {
  const [items, setItems]     = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await api.get<Plan[]>('/pricing')) }
    finally { setLoading(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xóa gói giá này?')) return
    await api.delete(`/pricing/${id}`)
    load()
  }

  if (loading) return <div className="loading">Đang tải...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bảng giá</h1>
          <p className="page-sub">Quản lý các gói dịch vụ</p>
        </div>
        <Link to="/pricing/new" className="btn btn-primary">+ Thêm gói</Link>
      </div>
      <div className="card">
        {items.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">💎</div><div className="empty-state-text">Chưa có gói giá nào</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tên gói</th><th>Giá tháng</th><th>Giá năm</th><th>Nổi bật</th><th>Thứ tự</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong>{item.is_free ? <span className="badge badge-read" style={{ marginLeft: 8 }}>Miễn phí</span> : ''}</td>
                    <td>{formatPrice(item.price_monthly)}</td>
                    <td>{formatPrice(item.price_yearly)}<span className="td-muted">/tháng</span></td>
                    <td>{item.is_featured ? <span className="badge badge-published">Nổi bật</span> : '—'}</td>
                    <td className="td-muted">{item.sort_order}</td>
                    <td><span className={`badge badge-${item.status}`}>{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/pricing/${item.id}/edit`} className="btn btn-ghost btn-sm">Sửa</Link>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
