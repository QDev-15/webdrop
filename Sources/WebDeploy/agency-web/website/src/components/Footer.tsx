import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name || 'Agency Web'
  const nameParts = siteName.split(' ')
  const first = nameParts.slice(0, -1).join(' ') || siteName
  const last  = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4" style={{ padding: '48px 0 24px' }}>
          <div className="col-md-4 reveal">
            <div className="ft-logo">{first}{last && <span>{last}</span>}</div>
            <p className="ft-desc">{settings.footer_description || 'Đối tác thiết kế web và dịch vụ số đáng tin cậy cho doanh nghiệp Việt Nam.'}</p>
            <div className="ft-socials">
              {settings.social_facebook && (
                <a href={settings.social_facebook} className="ft-soc" target="_blank" rel="noopener noreferrer">fb</a>
              )}
              {settings.social_zalo && (
                <a href={settings.social_zalo} className="ft-soc" target="_blank" rel="noopener noreferrer">zl</a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} className="ft-soc" target="_blank" rel="noopener noreferrer">in</a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} className="ft-soc" target="_blank" rel="noopener noreferrer">yt</a>
              )}
            </div>
          </div>
          <div className="col reveal" style={{ animationDelay: '.08s' }}>
            <div className="ft-col-title">Dịch vụ</div>
            <div className="ft-links">
              <Link to="/dich-vu">Thiết kế Website</Link>
              <Link to="/dich-vu">Ứng dụng Di động</Link>
              <Link to="/dich-vu">Marketing Số</Link>
              <Link to="/dich-vu">Thiết kế Thương hiệu</Link>
            </div>
          </div>
          <div className="col reveal" style={{ animationDelay: '.16s' }}>
            <div className="ft-col-title">Công ty</div>
            <div className="ft-links">
              <Link to="/ve-chung-toi">Về chúng tôi</Link>
              <Link to="/du-an">Dự án</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
          <div className="col reveal" style={{ animationDelay: '.24s' }}>
            <div className="ft-col-title">Liên hệ</div>
            <div className="ft-links">
              {settings.site_phone && <a href={`tel:${settings.site_phone}`}>📱 {settings.site_phone}</a>}
              {settings.site_email && <a href={`mailto:${settings.site_email}`}>✉️ {settings.site_email}</a>}
              {settings.site_address && <span>📍 {settings.site_address}</span>}
              {settings.working_hours && <span>🕐 {settings.working_hours}</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="ft-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center" style={{ padding: '12px 0', flexWrap: 'wrap', gap: '8px' }}>
            <div className="ft-copy">{settings.footer_copyright || `© ${new Date().getFullYear()} ${siteName} · Made in Vietnam`}</div>
            <div className="d-flex gap-4">
              <Link to="/lien-he" style={{ fontSize: '12px', color: 'rgba(255,255,255,.18)', textDecoration: 'none' }}>Chính sách bảo mật</Link>
              <Link to="/lien-he" style={{ fontSize: '12px', color: 'rgba(255,255,255,.18)', textDecoration: 'none' }}>Điều khoản</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
