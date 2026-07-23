import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Order {
  id: number
  order_code: string
  customer_name: string
  phone: string
  total: number
  payment_method: string
  payment_status: string
  status: string
  item_count: number
  created_at: string
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
}

const PAYMENT_LABEL: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  pending: 'Chờ chuyển khoản',
  paid: 'Đã thanh toán',
}

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const load = () => {
    setLoading(true)
    const qs = statusFilter ? `?status=${statusFilter}` : ''
    api.get<Order[]>(`/orders${qs}`)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusFilter])

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Đơn hàng</h1>
          <p className="admin-page-sub">Quản lý đơn hàng COD và chuyển khoản SePay</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ height: 38, borderRadius: 8, padding: '0 12px' }}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? <div className="admin-loading-box">Đang tải...</div> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Số SP</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: '#aaa' }}>Chưa có đơn hàng nào</td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.order_code}</strong></td>
                  <td>{o.customer_name}</td>
                  <td>{o.phone}</td>
                  <td>{o.item_count}</td>
                  <td>{fmt(o.total)}</td>
                  <td>
                    <span className={`status-badge ${o.payment_status === 'paid' ? 'done' : o.payment_status === 'pending' ? 'building' : 'brief'}`}>
                      {(o.payment_method === 'cod' ? 'COD · ' : 'SePay · ') + PAYMENT_LABEL[o.payment_status]}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${o.status === 'completed' ? 'done' : o.status === 'cancelled' ? 'brief' : 'review'}`}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td>{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <Link to={`/orders/${o.id}`} className="btn btn-sm btn-outline">Xem</Link>
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
