import AdminLayout from '@/components/admin/AdminLayout'

const orders = [
  { code: 'WD-0089', customer: 'Trần Minh Hoàng', email: 'minh@example.com', phone: '0901234567', template: 'Công ty dịch vụ Pro', plan: 'Standard', amount: '2.500.000đ', status: 'confirmed', date: '29/05/2026' },
  { code: 'WD-0088', customer: 'Nguyễn Lan Anh', email: 'lananh@example.com', phone: '0912345678', template: 'Spa & Làm đẹp', plan: 'Standard', amount: '2.800.000đ', status: 'completed', date: '28/05/2026' },
  { code: 'WD-0087', customer: 'Phạm Đức Toàn', email: 'toan@example.com', phone: '0923456789', template: 'Nhà hàng & Cafe', plan: 'Starter', amount: '3.000.000đ', status: 'new', date: '27/05/2026' },
  { code: 'WD-0086', customer: 'Lê Thu Hằng', email: 'hang@example.com', phone: '0934567890', template: 'Blog cá nhân', plan: 'Standard', amount: '1.800.000đ', status: 'completed', date: '25/05/2026' },
  { code: 'WD-0085', customer: 'Ngô Văn Bình', email: 'binh@example.com', phone: '0945678901', template: 'Portfolio tối', plan: 'Premium', amount: '12.000.000đ', status: 'in-progress', date: '24/05/2026' },
]

const statusLabel: Record<string, string> = {
  new: 'Mới', confirmed: 'Đã xác nhận', 'in-progress': 'Đang xử lý', completed: 'Hoàn thành', cancelled: 'Đã huỷ',
}

export default function OrdersPage() {
  return (
    <AdminLayout title="Đơn hàng">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Tổng: <strong>89</strong> đơn hàng</div>
        <div className="d-flex gap-2">
          {['Tất cả','Mới','Đang xử lý','Hoàn thành'].map(f => (
            <button key={f} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 7, border: '1px solid var(--border)', background: f === 'Tất cả' ? 'var(--text)' : 'transparent', color: f === 'Tất cả' ? '#fff' : 'var(--text-2)', cursor: 'pointer', fontFamily: 'var(--sans)' }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg)' }}>
                {['Mã đơn','Khách hàng','Template','Gói','Giá trị','Ngày','Trạng thái',''].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.code} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: 'var(--accent)' }}>{o.code}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ fontSize: 13, color: 'var(--text)' }}>{o.customer}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 300 }}>{o.phone}</div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{o.template}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-3)' }}>{o.plan}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{o.amount}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-3)' }}>{o.date}</td>
                  <td style={{ padding: '13px 16px' }}><span className={`status-badge ${o.status}`}>{statusLabel[o.status]}</span></td>
                  <td style={{ padding: '13px 16px' }}>
                    <button style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>Xem →</button>
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
