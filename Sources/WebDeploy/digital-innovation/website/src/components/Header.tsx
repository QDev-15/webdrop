import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const NAV_LINKS = [
  { to: '/',           label: 'Trang chủ' },
  { to: '/ve-chung-toi', label: 'Về chúng tôi' },
  { to: '/dich-vu',    label: 'Dịch vụ' },
  { to: '/lien-he',    label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const location = useLocation()
  const logoText = settings.site_logo_text || 'Digital'

  // Nav opacity theo scroll — khớp hành vi gốc của template (opacity 0.5 -> 1 khi scrollY > 100)
  useEffect(() => {
    const nav = document.getElementById('nav')
    const threshold = 100
    const update = () => {
      if (!nav) return
      nav.style.opacity = window.scrollY > threshold ? '1' : '0.5'
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Hamburger mobile menu — mở/đóng, Escape để đóng, khóa scroll body khi mở
  useEffect(() => {
    const burger = document.getElementById('navBurger')
    const mob = document.getElementById('navMob')
    if (!burger || !mob) return

    const toggle = () => {
      const isOpen = mob.classList.toggle('open')
      burger.classList.toggle('open', isOpen)
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
    const close = () => {
      mob.classList.remove('open')
      burger.classList.remove('open')
      document.body.style.overflow = ''
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mob.classList.contains('open')) close()
    }

    burger.addEventListener('click', toggle)
    document.addEventListener('keydown', handleEsc)
    close()

    return () => {
      burger.removeEventListener('click', toggle)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [location.pathname])

  return (
    <>
      <nav id="nav">
        <Link to="/" className="di-logo">{logoText}<span>.</span></Link>
        <div className="di-nav-links">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>{l.label}</Link>
          ))}
        </div>
        <Link to="/lien-he" className="di-nav-cta">Yêu cầu demo</Link>
        <button className="di-nav-hamburger" id="navBurger" aria-label="Menu"><span></span><span></span><span></span></button>
      </nav>

      <div className="di-nav-mobile" id="navMob">
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to}>{l.label}</Link>
        ))}
        <Link to="/lien-he" className="nm-cta">Yêu cầu demo</Link>
      </div>
    </>
  )
}
