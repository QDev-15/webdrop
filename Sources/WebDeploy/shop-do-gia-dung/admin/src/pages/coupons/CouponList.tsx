import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Coupon {
  id: number
  code: string
  type: 'percent' | 'fixed'
  value: number
  min_order: number
  max_uses: number
  used_count: number
  expires_at: string | null
  is_active: number
}

export default function CouponList() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get<Coupon[]>('/coupons')
      .then(setCoupons)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number, code: string) => {
    if (!confirm(`Xóa phiếu giảm giá "${code}"?`)) return
    await api.post(`/coupons/${id}/delete`, {})
    setCoupons(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return <div className="admin-loading-box">Đang tải...</div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Phiếu giảm giá</h1>
        <Link to="/coupons/new" className="btn btn-primary">+ Thêm mã</Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Đơn tối thiểu</th>
              <th>Đã dùng / Tối đa</th>
              <th>Hết hạn</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-3)', padding: 32 }}>
                  Chưa có phiếu giảm giá nào
                </td>
              </tr>
            ) : coupons.map(c => (
              <tr key={c.id}>
                <td>
                  <code style={{ fontFamily: 'monospace', fontWeight: 600, letterSpacing: 0.5 }}>{c.code}</code>
                </td>
                <td>{c.type === 'percent' ? 'Phần trăm' : 'Cố định'}</td>
                <td>{c.type === 'percent' ? `${c.value}%` : `${c.value.toLocaleString('vi-VN')}đ`}</td>
                <td>{c.min_order > 0 ? `${c.min_order.toLocaleString('vi-VN')}đ` : '—'}</td>
                <td>{c.used_count} / {c.max_uses === 0 ? '∞' : c.max_uses}</td>
                <td style={{ fontSize: 13 }}>{c.expires_at ? c.expires_at.slice(0, 10) : '—'}</td>
                <td>
                  <span className={`status-badge ${c.is_active ? 'done' : 'brief'}`}>
                    {c.is_active ? 'Đang dùng' : 'Tắt'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link
                      to={`/coupons/${c.id}/edit`}
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                    >
                      Sửa
                    </Link>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', fontSize: 12, color: 'var(--danger)' }}
                      onClick={() => handleDelete(c.id, c.code)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
