import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface PricingPlan { id: number; name: string; price: string; is_featured: number; sort_order: number; status: string }

export default function PricingList() {
  const [items, setItems] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const load = () => { api.get<PricingPlan[]>('/pricing-plans').then(setItems).catch(console.error).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  return (
    <>
      <div className="page-header">
        <div><div className="page-title">Bảng giá</div><div className="page-subtitle">Quản lý các gói dịch vụ hiển thị trên trang Dịch vụ</div></div>
        <Link to="/pricing/new" className="btn-accent">+ Thêm gói giá</Link>
      </div>
      {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div> :
        items.length === 0 ? <div className="empty-state"><div className="empty-state-icon">💰</div><div className="empty-state-text">Chưa có gói giá nào.</div></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tên gói</th><th>Giá</th><th>Nổi bật</th><th>Thứ tự</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td style={{ color: 'var(--text-2)' }}>{item.price}</td>
                    <td>{item.is_featured ? '★' : '—'}</td>
                    <td>{item.sort_order}</td>
                    <td><span className={`badge badge-${item.status}`}><span className="badge-dot" />{item.status === 'published' ? 'Hiển thị' : 'Ẩn'}</span></td>
                    <td><div className="td-actions">
                      <Link to={`/pricing/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/pricing-plans/${item.id}`); load() } }} className="btn-danger btn-sm">Xóa</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </>
  )
}
