'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/admin', icon: '📊', label: 'Tổng quan' },
  { href: '/admin/orders', icon: '📋', label: 'Đơn hàng' },
  { href: '/admin/customers', icon: '👥', label: 'Khách hàng' },
  { href: '/admin/projects', icon: '🗂️', label: 'Dự án' },
  { href: '/admin/templates', icon: '🎨', label: 'Templates' },
  { href: '/admin/slides', icon: '🖼️', label: 'Hero Slides' },
  { href: '/admin/how-it-works', icon: '📋', label: 'Quy Trình' },
  { href: '/admin/posts', icon: '📝', label: 'Blog' },
  { href: '/admin/contacts', icon: '💬', label: 'Liên hệ' },
  { href: '/admin/revenue', icon: '💰', label: 'Doanh thu' },
  { href: '/admin/settings', icon: '⚙️', label: 'Cài đặt' },
]

export default function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="admin-body">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sb-logo">
          <Link href="/" className="sb-logo-text text-decoration-none">web<span>drop</span>.vn</Link>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', marginTop: 3, fontWeight: 300 }}>System Admin</div>
        </div>
        <nav className="sb-nav">
          <div className="sb-section">Menu</div>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sb-link${pathname === item.href ? ' active' : ''}`}
            >
              <span className="sb-link-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="sb-section" style={{ marginTop: 20 }}>Hệ thống</div>
          <Link href="/" className="sb-link">
            <span className="sb-link-icon">🌐</span>Xem trang web
          </Link>
          <div className="sb-link" style={{ marginTop: 'auto', cursor: 'pointer' }} onClick={handleLogout}>
            <span className="sb-link-icon">🚪</span>Đăng xuất
          </div>
        </nav>
      </div>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Admin</div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              👤
            </div>
          </div>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
