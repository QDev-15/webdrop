import { useEffect, useState } from 'react'
import { api } from '../../api/client'

interface Stats {
  services: number
  bookings: number
  newContacts: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const StatCard = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  )

  return (
    <div className="admin-page">
      <h1>Bảng điều khiển</h1>
      <p style={{ color: 'var(--text-2)', marginBottom: '32px' }}>Chào mừng đến trang quản trị Yoga & Wellness</p>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)' }}>Đang tải...</div>
      ) : stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <StatCard icon="🧘" label="Các lớp học" value={stats.services} />
          <StatCard icon="📅" label="Đặt lịch" value={stats.bookings} />
          <StatCard icon="💬" label="Liên hệ mới" value={stats.newContacts} />
        </div>
      ) : null}
    </div>
  )
}
