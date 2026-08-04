'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

const navLinks: { href: string; label: string; highlight?: boolean }[] = [
  { href: '/templates',   label: 'Thư viện mẫu' },
  { href: '/cvs',         label: 'CV Online' },
  { href: '/blog',        label: 'Blog' },
  { href: '/pricing',     label: 'Bảng giá' },
  { href: '/help',        label: 'Hướng dẫn' },
  // { href: '/lich-bong-da', label: '⚽ WC 2026', highlight: true },
  { href: '/about',       label: 'Về chúng tôi' },
]


export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { itemCount } = useCart()
  const isHome = pathname === '/'
  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href.split('#')[0]) && !href.includes('#'))

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 60)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleNavClick(e: React.MouseEvent, href: string) {
    setMobileOpen(false)

    const hashIndex = href.indexOf('#')
    if (hashIndex === -1) return // normal link, let Link handle it

    e.preventDefault()
    const hash = href.slice(hashIndex + 1)

    if (isHome) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      router.push(href)
    }
  }

  return (
    <>
      <nav id="nav" className={(!isHome || scrolled) ? 'scrolled' : ''}>
        <div className="wd-container">
          <div className="nav-inner">
            <Link href="/" className="logo">web<span>drop</span>.store</Link>
            <div className="nav-links">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href}
                  onClick={e => handleNavClick(e, l.href)}
                  className={isActive(l.href) ? 'active' : ''}
                  style={l.highlight ? { color: 'var(--accent)', fontWeight: 500 } : undefined}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="nav-actions">
              <Link href="/gio-hang" className="nav-cart-btn" aria-label="Giỏ hàng" onClick={() => setMobileOpen(false)}>
                🛒
                {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
              </Link>
              <Link href="/contact" className="nav-cta d-none d-md-inline-flex">
                Liên hệ ngay
              </Link>
              <button
                className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
                aria-label="Mở menu" aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(v => !v)}
              >
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`} role="dialog" aria-label="Menu điều hướng">
        {navLinks.map(l => (
          <Link key={l.href} href={l.href} onClick={e => handleNavClick(e, l.href)}
            className={isActive(l.href) ? 'active' : ''}
            style={l.highlight ? { color: 'var(--accent)', fontWeight: 600 } : undefined}>
            {l.label}
          </Link>
        ))}
        <Link href="/gio-hang" onClick={() => setMobileOpen(false)}>
          🛒 Giỏ hàng{itemCount > 0 && ` (${itemCount})`}
        </Link>
        <Link href="/contact" className="nm-cta" onClick={() => setMobileOpen(false)}>Liên hệ ngay</Link>
      </div>
    </>
  )
}
