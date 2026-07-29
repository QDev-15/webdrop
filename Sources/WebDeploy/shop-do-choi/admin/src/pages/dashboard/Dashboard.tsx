import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Stats {
  total_products?: number
  total_orders?: number
  total_revenue?: number
  recent_orders?: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get<Stats>('/admin/stats')
        setStats(data)
      } catch (err) {
        console.error('Lỗi tải thống kê:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const fmt = (n?: number) => (n || 0).toLocaleString('vi-VN')

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>Đang tải...</div>
      ) : (
        <div className="admin-quick-links" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginTop: 24 }}>
          <div style={{ padding: 20, border: '1px solid #e5e5e5', borderRadius: 8, background: '#f9f9f9' }}>
            <div className="stat-info">
              <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Tổng sản phẩm</p>
              <p style={{ fontSize: 28, fontWeight: 600 }}>{fmt(stats.total_products)}</p>
            </div>
          </div>
          <div style={{ padding: 20, border: '1px solid #e5e5e5', borderRadius: 8, background: '#f9f9f9' }}>
            <div className="stat-info">
              <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Tổng đơn hàng</p>
              <p style={{ fontSize: 28, fontWeight: 600 }}>{fmt(stats.total_orders)}</p>
            </div>
          </div>
          <div style={{ padding: 20, border: '1px solid #e5e5e5', borderRadius: 8, background: '#f9f9f9' }}>
            <div className="stat-info">
              <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Doanh thu</p>
              <p style={{ fontSize: 28, fontWeight: 600 }}>{fmt(stats.total_revenue)}đ</p>
            </div>
          </div>
          <div style={{ padding: 20, border: '1px solid #e5e5e5', borderRadius: 8, background: '#f9f9f9' }}>
            <div className="stat-info">
              <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Đơn hàng gần đây</p>
              <p style={{ fontSize: 28, fontWeight: 600 }}>{fmt(stats.recent_orders)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
