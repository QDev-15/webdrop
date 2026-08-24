import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  listings_pending: number
  listings_approved: number
  listings_total: number
  accounts_total: number
  wallet_pending: number
  contacts_new: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => { api.get<Stats>('/stats').then(setStats).catch(() => {}) }, [])

  if (!stats) return <div className="admin-loading">Đang tải...</div>

  const cards = [
    { label: 'Tin chờ duyệt', value: stats.listings_pending, icon: '⏳', to: '/listings', color: '#fffbeb' },
    { label: 'Tin đã duyệt', value: stats.listings_approved, icon: '✅', to: '/listings', color: 'var(--accent-light)' },
    { label: 'Tổng tin đăng', value: stats.listings_total, icon: '🏠', to: '/listings', color: '#eff6ff' },
    { label: 'Tài khoản đăng tin', value: stats.accounts_total, icon: '👤', to: '/accounts', color: '#eff6ff' },
    { label: 'Giao dịch chờ duyệt', value: stats.wallet_pending, icon: '💳', to: '/wallet-transactions', color: '#fffbeb' },
    { label: 'Liên hệ mới', value: stats.contacts_new, icon: '✉', to: '/contacts', color: '#fff0f0' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Tổng quan sàn giao dịch RaoNhà</div>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="stat-card-icon" style={{ background: c.color }}>{c.icon}</div>
            <div className="stat-card-value">{c.value}</div>
            <div className="stat-card-label">{c.label}</div>
          </Link>
        ))}
      </div>

      {stats.listings_pending > 0 && (
        <div className="alert alert-info">
          Có <strong>{stats.listings_pending}</strong> tin đăng đang chờ kiểm duyệt.{' '}
          <Link to="/listings" style={{ color: '#1d4ed8', fontWeight: 600 }}>Duyệt ngay →</Link>
        </div>
      )}
      {stats.wallet_pending > 0 && (
        <div className="alert alert-info">
          Có <strong>{stats.wallet_pending}</strong> giao dịch nạp credit chờ xác nhận.{' '}
          <Link to="/wallet-transactions" style={{ color: '#1d4ed8', fontWeight: 600 }}>Xử lý ngay →</Link>
        </div>
      )}
    </div>
  )
}
