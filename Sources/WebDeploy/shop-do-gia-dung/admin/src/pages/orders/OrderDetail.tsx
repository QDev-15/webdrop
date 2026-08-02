import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'

interface OrderItem {
  id: number
  product_name: string
  price: number
  qty: number
  subtotal: number
}

interface Order {
  id: number
  order_code: string
  customer_name: string
  phone: string
  email: string
  address: string
  note: string
  subtotal: number
  shipping_fee: number
  discount: number
  coupon_code?: string
  total: number
  payment_method: string
  payment_status: string
  status: string
  created_at: string
  items: OrderItem[]
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => {
    api.get<Order>(`/orders/${id}`)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  const updateStatus = async (patch: { status?: string; payment_status?: string }) => {
    setSaving(true)
    try {
      const updated = await api.post<Order>(`/orders/${id}/update-status`, patch)
      setOrder(o => o ? { ...o, ...updated } : updated)
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  if (loading) return <div className="admin-loading-box">Đang tải...</div>
  if (!order) return <div className="admin-page"><p>Không tìm thấy đơn hàng</p></div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Đơn hàng {order.order_code}</h1>
          <p className="admin-page-sub">Đặt lúc {new Date(order.created_at).toLocaleString('vi-VN')}</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/orders')}>← Quay lại</button>
      </div>

      <div className="form-row" style={{ alignItems: 'flex-start', gap: 24 }}>
        <div style={{ flex: 2 }}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Sản phẩm</th><th>Đơn giá</th><th>SL</th><th>Tạm tính</th></tr>
              </thead>
              <tbody>
                {order.items.map(it => (
                  <tr key={it.id}>
                    <td>{it.product_name}</td>
                    <td>{fmt(it.price)}</td>
                    <td>{it.qty}</td>
                    <td>{fmt(it.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16, padding: 20, background: 'var(--warm, #f7f5f0)', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Tạm tính</span><span>{fmt(order.subtotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Phí vận chuyển</span><span>{order.shipping_fee ? fmt(order.shipping_fee) : 'Miễn phí'}</span></div>
            {order.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Giảm giá{order.coupon_code ? ` (${order.coupon_code})` : ''}</span><span>-{fmt(order.discount)}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 16, borderTop: '1px solid var(--border, #e8dfd4)', paddingTop: 8 }}><span>Tổng cộng</span><span>{fmt(order.total)}</span></div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="admin-form" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12, fontSize: 15 }}>Thông tin khách hàng</h3>
            <p><strong>{order.customer_name}</strong></p>
            <p>{order.phone}</p>
            {order.email && <p>{order.email}</p>}
            <p style={{ marginTop: 8 }}>{order.address}</p>
            {order.note && <p style={{ marginTop: 8, color: '#888' }}>Ghi chú: {order.note}</p>}
          </div>

          <div className="admin-form">
            <h3 style={{ marginBottom: 12, fontSize: 15 }}>Thanh toán</h3>
            <p>Phương thức: <strong>{order.payment_method === 'cod' ? 'COD (thanh toán khi nhận hàng)' : 'Chuyển khoản SePay'}</strong></p>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label>Trạng thái thanh toán</label>
              <select value={order.payment_status} disabled={saving} onChange={e => updateStatus({ payment_status: e.target.value })}>
                <option value="unpaid">Chưa thanh toán</option>
                <option value="pending">Chờ chuyển khoản</option>
                <option value="paid">Đã thanh toán</option>
              </select>
            </div>
            <div className="form-group">
              <label>Trạng thái đơn hàng</label>
              <select value={order.status} disabled={saving} onChange={e => updateStatus({ status: e.target.value })}>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipping">Đang giao</option>
                <option value="completed">Hoàn tất</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link to="/orders" className="btn btn-outline">← Danh sách đơn hàng</Link>
      </div>
    </div>
  )
}
