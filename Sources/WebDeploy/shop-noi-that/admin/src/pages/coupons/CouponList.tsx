import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Coupon {
  id: number
  code: string
  description: string
  sort_order: number
  active: number
}

export default function CouponList() {
  const [items, setItems] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Coupon[]>('/coupons')
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, code: string) => {
    if (!confirm(`Xóa mã giảm giá "${code}"?`)) return
    await api.post(`/coupons/${id}/delete`, {})
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Mã giảm giá</h1>
          <p className="admin-page-sub">Quản lý mã giảm giá hiển thị ở trang "Khuyến mãi" (chỉ hiển thị để khách sao chép)</p>
        </div>
        <Link to="/coupons/new" className="btn btn-primary">+ Thêm mã giảm giá</Link>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Thứ tự</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#aaa' }}>Chưa có mã giảm giá nào</td></tr>
              ) : items.map(item => (
                <tr key={item.id}>
                  <td><code style={{ fontSize: 13, fontWeight: 600 }}>{item.code}</code></td>
                  <td>{item.description}</td>
                  <td>
                    <span className={`status-badge ${item.active ? 'done' : 'brief'}`}>
                      {item.active ? 'Đang hiển thị' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td>{item.sort_order}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/coupons/${item.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(item.id, item.code)} className="btn btn-sm btn-danger">Xóa</button>
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
