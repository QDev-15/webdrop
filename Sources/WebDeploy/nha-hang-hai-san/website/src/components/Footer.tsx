import { useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  settings: Record<string, string>
}

export default function Footer({ settings }: Props) {
  useEffect(() => {
    let ro: IntersectionObserver | undefined
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('footer [data-reveal-footer]:not(.visible)')
      ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro!.unobserve(e.target) } })
      }, { threshold: 0.05 })
      els.forEach(el => ro!.observe(el))
    }, 0)
    return () => { clearTimeout(timer); ro?.disconnect() }
  }, [settings])
  const siteName = settings.site_name || 'Vị Biển Hải Sản'
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4 py-5">
          <div className="col-md-4 reveal" data-reveal-footer>
            <div className="ft-logo">🦞 {siteName} <span>Hải Sản</span></div>
            <p className="ft-desc">{settings.site_description || 'Hải sản tươi sống nhập mỗi ngày — từ biển đến bàn ăn của bạn, không ướp lạnh lâu.'}</p>
            <div className="ft-socials">
              {settings.social_facebook && <a href={settings.social_facebook} className="ft-soc" target="_blank" rel="noopener noreferrer">fb</a>}
              {settings.social_instagram && <a href={settings.social_instagram} className="ft-soc" target="_blank" rel="noopener noreferrer">ig</a>}
              {settings.social_zalo && <a href={`https://zalo.me/${settings.social_zalo}`} className="ft-soc" target="_blank" rel="noopener noreferrer">zl</a>}
              {settings.social_youtube && <a href={settings.social_youtube} className="ft-soc" target="_blank" rel="noopener noreferrer">yt</a>}
            </div>
          </div>
          <div className="col reveal reveal-d1" data-reveal-footer>
            <div className="ft-col-title">Trang</div>
            <div className="ft-links">
              <Link to="/">Trang chủ</Link>
              <Link to="/thuc-don">Thực đơn</Link>
              <Link to="/dat-ban">Đặt bàn</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
          <div className="col reveal reveal-d2" data-reveal-footer>
            <div className="ft-col-title">Hải Sản</div>
            <div className="ft-links">
              <Link to="/thuc-don">Tôm & Cua</Link>
              <Link to="/thuc-don">Mực & Bạch Tuộc</Link>
              <Link to="/thuc-don">Cá Biển</Link>
              <Link to="/thuc-don">Lẩu Hải Sản</Link>
            </div>
          </div>
          <div className="col reveal reveal-d3" data-reveal-footer>
            <div className="ft-col-title">Liên hệ</div>
            <div className="ft-links">
              {settings.site_phone && <a href={`tel:${settings.site_phone}`}>📱 {settings.site_phone}</a>}
              {settings.site_address && <span>📍 {settings.site_address}</span>}
              {settings.site_email && <a href={`mailto:${settings.site_email}`}>✉️ {settings.site_email}</a>}
              {settings.working_hours && <span>🕐 {settings.working_hours}</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="ft-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div className="ft-copy">{settings.footer_copyright || `© ${year} ${siteName} · Made in Vietnam 🇻🇳`}</div>
            <div className="ft-copy">Thiết kế bởi webdrop.vn</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
