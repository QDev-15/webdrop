import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  useEffect(() => {
    const nav = document.getElementById('nav')
    const handleScroll = () => {
      if (window.scrollY > 40) nav?.classList.add('yw-shadow')
      else nav?.classList.remove('yw-shadow')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const burger = document.getElementById('navBurger')
    const mob = document.getElementById('navMob')
    if (!burger || !mob) return
    const toggle = () => {
      const o = mob.classList.toggle('open')
      burger.classList.toggle('open', o)
      document.body.style.overflow = o ? 'hidden' : ''
    }
    burger.addEventListener('click', toggle)
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mob.classList.contains('open')) {
        mob.classList.remove('open')
        burger.classList.remove('open')
        document.body.style.overflow = ''
      }
    }
    document.addEventListener('keydown', handleEsc)
    mob.classList.remove('open')
    burger.classList.remove('open')
    return () => { burger.removeEventListener('click', toggle); document.removeEventListener('keydown', handleEsc) }
  }, [location])

  return (
    <nav id="nav">
      <div className="yw-nav-bar"></div>
      <div className="wd-container">
        <div className="nav-inner">
          <a className="yw-logo" href="/">
            <div className="yw-logo-mark">🌿</div>
            <div className="yw-logo-text">Yoga<span> Wellness</span></div>
          </a>
          <div className="nav-links">
            <a href="/" className={location.pathname === '/' ? 'active' : ''}>Trang chủ</a>
            <a href="/dich-vu" className={location.pathname === '/dich-vu' ? 'active' : ''}>Các lớp học</a>
            <a href="/dat-lich" className={location.pathname === '/dat-lich' ? 'active' : ''}>Đăng ký</a>
            <a href="/lien-he" className={location.pathname === '/lien-he' ? 'active' : ''}>Liên hệ</a>
          </div>
          <a href="/dat-lich" className="yw-nav-cta">Đăng ký lớp học</a>
          <button className="nav-hamburger" id="navBurger" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
      </div>
      <div className="nav-mobile" id="navMob">
        <a href="/">Trang chủ</a>
        <a href="/dich-vu">Các lớp học</a>
        <a href="/dat-lich">Đăng ký</a>
        <a href="/lien-he">Liên hệ</a>
        <a href="/dat-lich" className="nm-cta">Đăng ký lớp học</a>
      </div>
    </nav>
  )
}
