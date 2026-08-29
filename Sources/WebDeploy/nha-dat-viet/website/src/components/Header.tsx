import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { IconClock, IconMail, IconPhone } from './icons'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/bat-dong-san', label: 'Bất động sản' },
  { to: '/du-an', label: 'Dự án' },
  { to: '/ve-chung-toi', label: 'Giới thiệu' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const { settings } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [mobOpen, setMobOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobOpen ? 'hidden' : ''
  }, [mobOpen])

  const phone2 = settings.site_phone2 || '0909 888 777'
  const phone2Tel = phone2.replace(/\s/g, '')
  const phone1 = settings.site_phone || '1900 6789'
  const phone1Tel = phone1.replace(/\s/g, '')

  // Tách tên site thành "phần đầu" + "từ cuối" để tô màu accent từ cuối (giống <span> trong template gốc)
  const siteName = settings.site_name || 'Nhà Đất Việt'
  const nameParts = siteName.trim().split(' ')
  const nameLast = nameParts.pop() || ''
  const nameRest = nameParts.join(' ')

  return (
    <header className="ndv-fixed-head">
      <div className="ndv-topbar">
        <div className="ndv-container">
          <div className="ndv-topbar-left">
            <span className="ndv-topbar-item"><IconClock /> {settings.working_hours || 'Thứ 2 - Chủ nhật: 8:00 - 20:00'}</span>
            <span className="ndv-topbar-item ndv-hide-sm"><IconMail /> {settings.site_email || 'hotro@nhadatviet.vn'}</span>
          </div>
          <div className="ndv-topbar-right">
            <a href={`tel:${phone1Tel}`} className="ndv-topbar-item"><IconPhone /> Hotline: {phone1}</a>
            <Link to="/lien-he">Đăng tin ký gửi</Link>
          </div>
        </div>
      </div>
      <nav id="ndvNav" className={scrolled ? 'scrolled' : ''}>
        <div className="ndv-container ndv-nav-inner">
          <Link to="/" className="ndv-logo">
            <span className="ndv-logo-mark"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 10h3v10h6v-6h2v6h6V10h3z" /></svg></span>
            {nameRest ? nameRest + ' ' : ''}<span>{nameLast}</span>
          </Link>
          <div className="ndv-nav-links">
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => isActive ? 'active' : ''}>{l.label}</NavLink>
            ))}
          </div>
          <div className="ndv-nav-cta">
            <a href={`tel:${phone2Tel}`} className="ndv-nav-phone"><IconPhone /> {phone2}</a>
            <Link to="/lien-he" className="ndv-btn ndv-btn-primary ndv-btn-sm">Liên hệ ngay</Link>
            <button className={'ndv-nav-burger' + (mobOpen ? ' open' : '')} aria-label="Mở menu" onClick={() => setMobOpen(o => !o)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={'ndv-nav-mob' + (mobOpen ? ' open' : '')}>
        <div className="ndv-container">
          {NAV_LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobOpen(false)}>{l.label}</NavLink>
          ))}
          <a href={`tel:${phone2Tel}`} className="ndv-btn ndv-btn-primary ndv-btn-block ndv-nav-mob-cta">Gọi ngay: {phone2}</a>
        </div>
      </div>
    </header>
  )
}
