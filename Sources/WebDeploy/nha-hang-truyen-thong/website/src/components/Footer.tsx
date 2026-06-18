import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings: s } = useSite()
  const siteName = s.site_name || 'Nhà Hàng Ẩm Thực'
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = ref.current?.querySelectorAll<Element>('.reveal:not(.visible)') ?? []
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <footer ref={ref}>
      <div className="wd-container">
        <div className="row g-4 py-5">
          <div className="col-md-4 reveal">
            <div className="ft-logo">🍲 {siteName.split(' ')[0]} <span>{siteName.split(' ').slice(1).join(' ') || 'Ẩm Thực'}</span></div>
            <p className="ft-desc">{s.footer_description || 'Ẩm thực Việt Nam truyền thống, nấu từ tâm — thưởng thức bằng cảm xúc.'}</p>
            {s.footer_show_social !== '0' && (
              <div className="ft-socials">
                {s.social_facebook  && <a href={s.social_facebook}  className="ft-soc" aria-label="Facebook"  target="_blank" rel="noopener noreferrer">fb</a>}
                {s.social_instagram && <a href={s.social_instagram} className="ft-soc" aria-label="Instagram" target="_blank" rel="noopener noreferrer">ig</a>}
                {s.social_zalo      && <a href={s.social_zalo}      className="ft-soc" aria-label="Zalo"      target="_blank" rel="noopener noreferrer">zl</a>}
                {s.social_youtube   && <a href={s.social_youtube}   className="ft-soc" aria-label="YouTube"   target="_blank" rel="noopener noreferrer">yt</a>}
                {s.social_tiktok    && <a href={s.social_tiktok}    className="ft-soc" aria-label="TikTok"    target="_blank" rel="noopener noreferrer">tt</a>}
              </div>
            )}
          </div>
          <div className="col reveal reveal-d1">
            <div className="ft-col-title">Thực đơn</div>
            <div className="ft-links">
              <Link to="/thuc-don">Món khai vị</Link>
              <Link to="/thuc-don">Món chính</Link>
              <Link to="/thuc-don">Tráng miệng</Link>
              <Link to="/thuc-don">Đồ uống</Link>
            </div>
          </div>
          <div className="col reveal reveal-d2">
            <div className="ft-col-title">Thông tin</div>
            <div className="ft-links">
              <Link to="/dat-ban">Đặt bàn</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Liên hệ</div>
            <div className="ft-links">
              {s.site_phone   && <a href={`tel:${s.site_phone}`}>📱 {s.site_phone}</a>}
              {s.site_address && <span>📍 {s.site_address}</span>}
              {s.working_hours && <span>🕐 {s.working_hours}</span>}
              {s.site_email   && <a href={`mailto:${s.site_email}`}>✉️ {s.site_email}</a>}
            </div>
          </div>
        </div>
      </div>
      <div className="ft-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div className="ft-copy">{s.footer_copyright || `© ${new Date().getFullYear()} ${siteName} · Made in Vietnam 🇻🇳`}</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
