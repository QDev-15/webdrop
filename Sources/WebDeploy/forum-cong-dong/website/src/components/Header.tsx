import { useSite } from '../contexts/SiteContext'

export default function Header() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Forum'

  return (
    <nav id="nav">
      <div className="wd-container">
        <div className="nav-inner">
          <a className="logo" href="/">
            {siteName}<span>.</span>
          </a>
          <div className="nav-search-bar">
            <input type="search" placeholder="Tim kiem chu de, bai viet..." />
          </div>
          <div className="nav-actions">
            <a href="/contact" className="nav-btn nav-btn-ghost">Dang nhap</a>
            <a href="/contact" className="nav-btn nav-btn-accent">Dang ky</a>
          </div>
          <button className="nav-hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}
