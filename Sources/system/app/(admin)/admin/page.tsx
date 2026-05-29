import AdminLayout from '@/components/admin/AdminLayout'

const stats = [
  { label: 'Doanh thu tháng', value: '24.500.000đ', change: '+18% so với tháng trước', up: true },
  { label: 'Đơn hàng mới', value: '12', change: '+3 so với tuần trước', up: true },
  { label: 'Khách hàng', value: '47', change: '+5 tháng này', up: true },
  { label: 'Templates đã bán', value: '89', change: '+12 tháng này', up: true },
]

const recentOrders = [
  { code: 'WD-0089', customer: 'Trần Minh Hoàng', template: 'Công ty dịch vụ Pro', plan: 'Standard', amount: '2.500.000đ', status: 'confirmed' },
  { code: 'WD-0088', customer: 'Nguyễn Lan Anh', template: 'Spa & Làm đẹp', plan: 'Standard', amount: '2.800.000đ', status: 'completed' },
  { code: 'WD-0087', customer: 'Phạm Đức Toàn', template: 'Nhà hàng & Cafe', plan: 'Starter', amount: '3.000.000đ', status: 'new' },
  { code: 'WD-0086', customer: 'Lê Thu Hằng', template: 'Blog cá nhân', plan: 'Standard', amount: '1.800.000đ', status: 'completed' },
  { code: 'WD-0085', customer: 'Ngô Văn Bình', template: 'Portfolio tối', plan: 'Premium', amount: '12.000.000đ', status: 'in-progress' },
]

const statusLabel: Record<string, string> = {
  new: 'Mới', confirmed: 'Đã xác nhận', 'in-progress': 'Đang xử lý', completed: 'Hoàn thành', cancelled: 'Đã huỷ',
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Tổng quan">
      {/* Stats */}
      <div className="row g-3 mb-4">
        {stats.map(s => (
          <div key={s.label} className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className={`stat-change${s.up ? ' up' : ' down'}`}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Đơn hàng gần đây</div>
          <a href="/admin/orders" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Xem tất cả →</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                {['Mã đơn','Khách hàng','Template','Gói','Giá trị','Trạng thái'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.code} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--accent)' }}>{order.code}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text)' }}>{order.customer}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{order.template}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-3)' }}>{order.plan}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{order.amount}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`status-badge ${order.status}`}>{statusLabel[order.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
