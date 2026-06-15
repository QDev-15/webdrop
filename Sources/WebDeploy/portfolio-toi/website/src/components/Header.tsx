import { useEffect, useState } from 'react'
import { Settings } from '../App'

interface Props {
  settings: Settings
}

export default function Header({ settings }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const siteName = settings.site_name || 'Portfolio'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => setMobileOpen(false)

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="wd-container">
          <div className="nav-inner">
            <a className="logo" href="#home">{siteName.split(' ')[0]}<span>.</span></a>
            <div className="nav-links">
              <a href="#ve-toi">Về tôi</a>
              <a href="#du-an">Dự án</a>
              <a href="#ky-nang">Kỹ năng</a>
              <a href="#lien-he">Liên hệ</a>
            </div>
            <a href="#lien-he" className="nav-cta">Hợp tác ngay</a>
            <button
              className={`nav-hamburger${mobileOpen ? ' open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
        <a href="#ve-toi" onClick={handleNavClick}>Về tôi</a>
        <a href="#du-an" onClick={handleNavClick}>Dự án</a>
        <a href="#ky-nang" onClick={handleNavClick}>Kỹ năng</a>
        <a href="#lien-he" onClick={handleNavClick}>Liên hệ</a>
        <a href="#lien-he" className="nm-cta" onClick={handleNavClick}>Hợp tác ngay</a>
      </div>
    </>
  )
}
