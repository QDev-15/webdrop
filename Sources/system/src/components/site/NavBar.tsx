'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '#templates', label: 'Mẫu thiết kế' },
  { href: '#pricing', label: 'Bảng giá' },
  { href: '#how', label: 'Quy trình' },
  { href: '#reviews', label: 'Khách hàng' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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

  const scrollTo = (id: string) => {
    document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileOpen(false)
  }

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wd-container">
          <div className="nav-inner">
            <Link href="/" className="logo">web<span>drop</span>.vn</Link>
            <div className="nav-links">
              {navLinks.map(l => (
                <a key={l.href} href={l.href} onClick={e => { e.preventDefault(); scrollTo(l.href) }}>
                  {l.label}
                </a>
              ))}
            </div>
            <a href="#pricing" className="nav-cta d-none d-md-inline-flex"
              onClick={e => { e.preventDefault(); scrollTo('#pricing') }}>
              Tư vấn miễn phí
            </a>
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
          <a key={l.href} href={l.href} onClick={e => { e.preventDefault(); scrollTo(l.href) }}>
            {l.label}
          </a>
        ))}
        <a href="#pricing" className="nm-cta" onClick={e => { e.preventDefault(); scrollTo('#pricing') }}>
          Tư vấn miễn phí
        </a>
      </div>
    </>
  )
}
