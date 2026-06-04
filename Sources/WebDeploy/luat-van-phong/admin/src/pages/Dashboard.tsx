import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface Stats {
  contacts: number; new_contacts: number
  consultations: number; new_consults: number
  lawyers: number; cases: number; services: number; testimonials: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    api.get<Stats>('/stats').then(setStats).catch(() => {})
  }, [])

  const cards = stats ? [
    { label: 'Đăng ký tư vấn', val: stats.consultations, sub: `${stats.new_consults} mới`, link: '/consultations', color: '#1a6b52' },
    { label: 'Liên hệ',        val: stats.contacts,      sub: `${stats.new_contacts} chưa đọc`, link: '/contacts', color: '#0ea5e9' },
    { label: 'Luật sư',        val: stats.lawyers,       sub: 'Đang hoạt động', link: '/lawyers', color: '#8b5cf6' },
    { label: 'Vụ việc',        val: stats.cases,         sub: 'Tiêu biểu', link: '/cases', color: '#f59e0b' },
  ] : []

  return (
    <>
      <div className="page-hdr">
        <h1>Dashboard</h1>
        <Link to="/consultations" className="btn btn-primary">Xem yêu cầu tư vấn</Link>
      </div>

      <div className="stats-grid">
        {cards.map(c => (
          <Link key={c.label} to={c.link} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
              <div className="stat-card-val">{c.val ?? '–'}</div>
              <div className="stat-card-label">{c.label}</div>
              <div className="stat-card-sub">{c.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="table-wrap" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>Quản lý nhanh</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { to: '/slides/new',   label: '+ Thêm slide trang chủ' },
              { to: '/lawyers/new',  label: '+ Thêm luật sư' },
              { to: '/cases/new',    label: '+ Thêm vụ việc' },
              { to: '/services/new', label: '+ Thêm lĩnh vực' },
            ].map(item => (
              <Link key={item.to} to={item.to} className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="table-wrap" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>Thống kê nội dung</h3>
          {stats && (
            <table className="admin-table">
              <tbody>
                {[
                  ['Lĩnh vực hành nghề', stats.services],
                  ['Luật sư', stats.lawyers],
                  ['Vụ việc tiêu biểu', stats.cases],
                  ['Đánh giá thân chủ', stats.testimonials],
                ].map(([label, val]) => (
                  <tr key={label as string}>
                    <td style={{ color: 'var(--text-2)' }}>{label}</td>
                    <td style={{ fontWeight: 600, textAlign: 'right' }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
