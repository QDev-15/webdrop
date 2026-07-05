import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

interface Stats {
  services: number
  doctors: number
  bookings: number
  bookings_new: number
  testimonials: number
  contacts: number
  contacts_new: number
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

  if (loading) return <div className="admin-loading">Đang tải...</div>

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          Tổng quan — LuxDental
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Quản trị nha khoa thẩm mỹ cao cấp</p>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Dịch vụ" value={stats?.services ?? 0} icon="💎" to="/services" />
        <StatCard label="Bác sĩ" value={stats?.doctors ?? 0} icon="👨‍⚕️" to="/team" />
        <StatCard label="Đặt lịch" value={stats?.bookings ?? 0} icon="📅" to="/bookings" badge={stats?.bookings_new} />
        <StatCard label="Đánh giá" value={stats?.testimonials ?? 0} icon="⭐" to="/testimonials" />
        <StatCard label="Liên hệ" value={stats?.contacts ?? 0} icon="✉️" to="/contacts" badge={stats?.contacts_new} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <QuickCard title="Thao tác nhanh">
          <QuickLink to="/services/new" label="+ Thêm dịch vụ mới" />
          <QuickLink to="/team/new" label="+ Thêm bác sĩ mới" />
          <QuickLink to="/testimonials/new" label="+ Thêm đánh giá mới" />
          <QuickLink to="/bookings" label="Xem lịch đặt mới" />
          <QuickLink to="/slides" label="Quản lý hero slides" />
        </QuickCard>
        <QuickCard title="Identity">
          <InfoRow label="Theme" value="BOLD-EDITORIAL" />
          <InfoRow label="Font" value="Syne 800" />
          <InfoRow label="Accent" value="#d63b1f — Scarlet đỏ cam" />
          <InfoRow label="Tài khoản" value="sysadmin / 123456" />
        </QuickCard>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, to, badge }: { label: string; value: number; icon: string; to: string; badge?: number }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 18px', transition: 'box-shadow .2s' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.08)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>
          {value}
          {badge ? <span style={{ marginLeft: 8, background: 'var(--danger)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 10 }}>{badge} mới</span> : null}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{label}</div>
      </div>
    </Link>
  )
}

function QuickCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, color: 'var(--text)' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
    </div>
  )
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} style={{ fontSize: 13, color: 'var(--accent)', padding: '6px 0', borderBottom: '1px solid var(--border-light)', textDecoration: 'none' }}>
      {label}
    </Link>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
      <span style={{ fontSize: 12, color: 'var(--text-3)', minWidth: 80 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}
