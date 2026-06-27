import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const s = settings

  const siteName = s.site_name || 'Bella Spa'
  const nameParts = siteName.split(' ')
  const nameFirst = nameParts.slice(0, -1).join(' ')
  const nameLast = nameParts.slice(-1)[0]

  return (
    <footer className="sb-footer">
      <div className="wd-container">
        <div className="row g-4 sb-ft-inner">
          <div className="col-md-4" data-reveal>
            <Link to="/" className="sb-ft-logo">
              <em>{nameFirst}</em> {nameLast}
            </Link>
            <p className="sb-ft-desc">{s.footer_desc || 'Nơi bạn được chăm sóc, thư giãn và tìm lại chính mình.'}</p>
            <div className="sb-ft-socials">
              {s.facebook   && <a href={s.facebook}   target="_blank" rel="noopener noreferrer" className="sb-ft-soc">fb</a>}
              {s.instagram  && <a href={s.instagram}  target="_blank" rel="noopener noreferrer" className="sb-ft-soc">ig</a>}
              {s.tiktok     && <a href={s.tiktok}     target="_blank" rel="noopener noreferrer" className="sb-ft-soc">tt</a>}
              {s.zalo_number && <a href={`https://zalo.me/${s.zalo_number}`} target="_blank" rel="noopener noreferrer" className="sb-ft-soc">zl</a>}
            </div>
          </div>

          <div className="col" data-reveal data-reveal-class="d1">
            <div className="sb-ft-col-title">Dịch vụ</div>
            <div className="sb-ft-links">
              <Link to="/dich-vu">Massage</Link>
              <Link to="/dich-vu">Chăm sóc da</Link>
              <Link to="/dich-vu">Body Treatment</Link>
              <Link to="/dich-vu">Nail &amp; Lashes</Link>
            </div>
          </div>

          <div className="col" data-reveal data-reveal-class="d2">
            <div className="sb-ft-col-title">Thông tin</div>
            <div className="sb-ft-links">
              <Link to="/dat-lich">Đặt lịch</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>

          <div className="col" data-reveal data-reveal-class="d3">
            <div className="sb-ft-col-title">Liên hệ</div>
            <div className="sb-ft-links">
              {s.site_phone   && <a href={`tel:${s.site_phone}`}>📱 {s.site_phone}</a>}
              {s.site_address && <span>📍 {s.site_address}</span>}
              {s.working_hours && <span>🕐 {s.working_hours}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="sb-ft-bottom">
        <div className="wd-container">
          <div className="sb-ft-copy">{s.footer_copyright || `© ${new Date().getFullYear()} ${siteName}`}</div>
        </div>
      </div>
    </footer>
  )
}
