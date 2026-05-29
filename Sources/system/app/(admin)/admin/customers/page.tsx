import AdminLayout from '@/components/admin/AdminLayout'

const customers = [
  { name: 'Trần Minh Hoàng', email: 'minh@example.com', phone: '0901234567', orders: 2, total: '5.000.000đ', lastOrder: '29/05/2026', status: 'active' },
  { name: 'Nguyễn Lan Anh', email: 'lananh@example.com', phone: '0912345678', orders: 1, total: '2.800.000đ', lastOrder: '28/05/2026', status: 'active' },
  { name: 'Phạm Đức Toàn', email: 'toan@example.com', phone: '0923456789', orders: 3, total: '7.300.000đ', lastOrder: '27/05/2026', status: 'active' },
  { name: 'Lê Thu Hằng', email: 'hang@example.com', phone: '0934567890', orders: 1, total: '1.800.000đ', lastOrder: '25/05/2026', status: 'active' },
  { name: 'Ngô Văn Bình', email: 'binh@example.com', phone: '0945678901', orders: 1, total: '12.000.000đ', lastOrder: '24/05/2026', status: 'active' },
]

export default function CustomersPage() {
  return (
    <AdminLayout title="Khách hàng">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Tổng: <strong>47</strong> khách hàng</div>
        <input placeholder="Tìm kiếm khách hàng..." style={{ fontSize: 13, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'var(--sans)', outline: 'none', width: 220 }} />
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg)' }}>
              {['Khách hàng','Email','SĐT','Đơn hàng','Tổng chi','Đơn gần nhất',''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.email} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                      {c.name.charAt(0)}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{c.name}</div>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)', fontWeight: 300 }}>{c.email}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-2)' }}>{c.phone}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text)', textAlign: 'center' }}>{c.orders}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{c.total}</td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-3)' }}>{c.lastOrder}</td>
                <td style={{ padding: '13px 16px' }}>
                  <button style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}>Xem →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
