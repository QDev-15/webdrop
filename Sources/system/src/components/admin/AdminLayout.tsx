'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/admin', icon: '📊', label: 'Tổng quan' },
  { href: '/admin/orders', icon: '📬', label: 'Đơn hàng' },
  { href: '/admin/customers', icon: '👥', label: 'Khách hàng' },
  { href: '/admin/projects', icon: '🗂️', label: 'Dự án' },
  { href: '/admin/templates', icon: '🎨', label: 'Templates' },
  { href: '/admin/homepage', icon: '🏠', label: 'Trang Chủ' },
  { href: '/admin/about', icon: '👤', label: 'Giới thiệu' },
  { href: '/admin/slides', icon: '🖼️', label: 'Hero Slides' },
  { href: '/admin/faq', icon: '❓', label: 'Hỏi & Đáp' },
  { href: '/admin/help', icon: '📚', label: 'Hướng dẫn' },
  { href: '/admin/pricing', icon: '💰', label: 'Bảng Giá' },
  { href: '/admin/posts', icon: '📝', label: 'Blog' },
  { href: '/admin/contacts', icon: '💬', label: 'Liên hệ' },
  { href: '/admin/discounts', icon: '🏷️', label: 'Mã KM' },
  { href: '/admin/revenue', icon: '📈', label: 'Doanh thu' },
  { href: '/admin/analytics', icon: '📊', label: 'Thống kê web' },
  { href: '/admin/settings', icon: '⚙️', label: 'Cài đặt' },
]

const PROFILE_CACHE_KEY = 'wd_admin_profile'

export default function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userInitial, setUserInitial] = useState('A')

  useEffect(() => {
    const cached = sessionStorage.getItem(PROFILE_CACHE_KEY)
    if (cached) {
      try {
        const p = JSON.parse(cached)
        setUserName(p.name)
        setUserInitial(p.name.charAt(0).toUpperCase())
        return
      } catch { sessionStorage.removeItem(PROFILE_CACHE_KEY) }
    }
    fetch('/api/admin/profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) {
          setUserName(data.user.name)
          setUserInitial(data.user.name.charAt(0).toUpperCase())
          sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(data.user))
        }
      })
      .catch(() => { })
  }, [])

  async function handleLogout() {
    sessionStorage.removeItem(PROFILE_CACHE_KEY)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="admin-body">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sb-logo">
          <Link href="/" className="sb-logo-text text-decoration-none">web<span>drop</span>.store</Link>
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
          <Link href="/admin/users" className={`sb-link${pathname === '/admin/users' ? ' active' : ''}`}>
            <span className="sb-link-icon">🔐</span>Người dùng
          </Link>
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
          <Link href="/admin/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--sans)' }}>{userName || 'Admin'}</div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
              {userInitial}
            </div>
          </Link>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
