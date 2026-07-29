export default function Dashboard() {
  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px' }}>
        <div className="stat-card">
          <h3>💰 Doanh thu</h3>
          <p className="stat-value">0đ</p>
          <p className="stat-label">Tháng này</p>
        </div>
        <div className="stat-card">
          <h3>📦 Đơn hàng</h3>
          <p className="stat-value">0</p>
          <p className="stat-label">Tháng này</p>
        </div>
        <div className="stat-card">
          <h3>👥 Khách hàng</h3>
          <p className="stat-value">0</p>
          <p className="stat-label">Mới</p>
        </div>
        <div className="stat-card">
          <h3>📊 Sản phẩm</h3>
          <p className="stat-value">0</p>
          <p className="stat-label">Tổng cộng</p>
        </div>
      </div>
    </div>
  )
}
