'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
  { href: '/#templates', label: 'Mẫu thiết kế' },
  { href: '/pricing', label: 'Bảng giá' },
  { href: '/#how', label: 'Quy trình' },
  { href: '/about', label: 'Về chúng tôi' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'

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
    const hashIndex = href.indexOf('#')
    if (hashIndex === -1) return // normal link, let Link handle it

    e.preventDefault()
    const hash = href.slice(hashIndex + 1)
    setMobileOpen(false)

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
            <Link href="/" className="logo">web<span>drop</span>.vn</Link>
            <div className="nav-links">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href}
                  onClick={e => handleNavClick(e, l.href)}
                  className={pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href.split('#')[0]) && !l.href.includes('#')) ? 'active' : ''}>
                  {l.label}
                </Link>
              ))}
              <Link href="/templates" className={pathname.startsWith('/templates') ? 'active' : ''}>
                Thư viện mẫu
              </Link>
            </div>
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
      </nav>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`} role="dialog" aria-label="Menu điều hướng">
        {navLinks.map(l => (
          <Link key={l.href} href={l.href} onClick={e => handleNavClick(e, l.href)}>
            {l.label}
          </Link>
        ))}
        <Link href="/templates" onClick={() => setMobileOpen(false)}>Thư viện mẫu</Link>
        <Link href="/contact" className="nm-cta" onClick={() => setMobileOpen(false)}>Liên hệ ngay</Link>
      </div>
    </>
  )
}
