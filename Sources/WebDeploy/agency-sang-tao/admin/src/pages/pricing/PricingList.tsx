import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../api/client'

interface PricingPlan {
  id: number
  name: string
  price: string
  description: string
  is_featured: number
  sort_order: number
  status: string
}

export default function PricingList() {
  const [items, setItems]     = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get<PricingPlan[]>('/pricing-plans').then(setItems).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa gói giá này?')) return
    await api.delete(`/pricing-plans/${id}`)
    load()
  }

  return (
    <AdminLayout title="Bảng giá">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bảng giá dịch vụ</h1>
          <p className="page-sub">Quản lý các gói dịch vụ hiển thị trên trang Dịch vụ</p>
        </div>
        <Link to="/pricing/new" className="btn-accent">+ Thêm gói giá</Link>
      </div>
      {loading ? (
        <div className="empty-state"><div className="empty-state-icon">⏳</div><div className="empty-state-text">Đang tải...</div></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tên gói</th><th>Giá</th><th>Nổi bật</th><th>Thứ tự</th><th>Trạng thái</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500 }}>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.is_featured ? '★' : '—'}</td>
                  <td>{item.sort_order}</td>
                  <td>{item.status === 'published' ? 'Đã đăng' : 'Nháp'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/pricing/${item.id}/edit`} className="btn-ghost btn-sm">Sửa</Link>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '40px' }}>Chưa có gói giá nào</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
