import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Coupon {
  id: number
  code: string
  type: 'percent' | 'fixed'
  value: number
  min_order: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: number
}

export default function CouponList() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Coupon[]>('/coupons')
      .then(setCoupons)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, code: string) => {
    if (!confirm(`Xóa mã giảm giá "${code}"?`)) return
    await api.post(`/coupons/${id}/delete`, {})
    load()
  }

  const fmtValue = (c: Coupon) => c.type === 'percent' ? `${c.value}%` : `${c.value.toLocaleString('vi-VN')}đ`

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Mã giảm giá</h1>
          <p className="admin-page-sub">Quản lý mã giảm giá áp dụng ở giỏ hàng và trang thanh toán</p>
        </div>
        <Link to="/coupons/new" className="btn btn-primary">+ Thêm mã giảm giá</Link>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>Đơn tối thiểu</th>
                <th>Lượt dùng</th>
                <th>Hết hạn</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#aaa' }}>Chưa có mã giảm giá nào</td></tr>
              ) : coupons.map(c => (
                <tr key={c.id}>
                  <td><code style={{ fontWeight: 700 }}>{c.code}</code></td>
                  <td>{c.type === 'percent' ? 'Phần trăm' : 'Số tiền cố định'}</td>
                  <td>{fmtValue(c)}</td>
                  <td>{c.min_order ? c.min_order.toLocaleString('vi-VN') + 'đ' : '—'}</td>
                  <td>{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                  <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('vi-VN') : 'Không giới hạn'}</td>
                  <td>
                    <span className={`status-badge ${c.is_active ? 'done' : 'brief'}`}>{c.is_active ? 'Hoạt động' : 'Tắt'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/coupons/${c.id}/edit`} className="btn btn-sm btn-outline">Sửa</Link>
                      <button onClick={() => handleDelete(c.id, c.code)} className="btn btn-sm btn-danger">Xóa</button>
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
