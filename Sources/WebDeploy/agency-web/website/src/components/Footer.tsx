import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name || 'Agency Web'
  const nameParts = siteName.split(' ')
  const firstName = nameParts[0]
  const restName  = nameParts.slice(1).join(' ') || 'WEB'

  const socials = [
    { key: 'social_facebook',  label: 'fb' },
    { key: 'social_zalo',      label: 'zl' },
    { key: 'social_linkedin',  label: 'in' },
    { key: 'social_youtube',   label: 'yt' },
  ]

  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4" style={{ padding: '48px 0' }}>
          <div className="col-md-4 reveal">
            <div className="ft-logo">{firstName}<span>{restName}</span></div>
            <p className="ft-desc">
              {settings.footer_description || 'Đối tác thiết kế web và dịch vụ số đáng tin cậy cho doanh nghiệp Việt Nam.'}
            </p>
            <div className="ft-socials">
              {socials.map(s => {
                const url = settings[s.key]
                return url ? (
                  <a key={s.key} href={url} className="ft-soc" target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ) : null
              })}
            </div>
          </div>

          <div className="col reveal reveal-d1">
            <div className="ft-col-title">Dịch vụ</div>
            <div className="ft-links">
              <Link to="/dich-vu">Thiết kế Website</Link>
              <Link to="/dich-vu">Ứng dụng Di động</Link>
              <Link to="/dich-vu">Marketing Số</Link>
              <Link to="/dich-vu">Thiết kế Thương hiệu</Link>
            </div>
          </div>

          <div className="col reveal reveal-d2">
            <div className="ft-col-title">Công ty</div>
            <div className="ft-links">
              <Link to="/ve-chung-toi">Về chúng tôi</Link>
              <Link to="/du-an">Dự án</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>

          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Liên hệ</div>
            <div className="ft-links">
              {settings.site_phone && (
                <a href={`tel:${settings.site_phone}`}>📱 {settings.site_phone}</a>
              )}
              {settings.site_email && (
                <a href={`mailto:${settings.site_email}`}>✉️ {settings.site_email}</a>
              )}
              {settings.site_address && (
                <span>📍 {settings.site_address}</span>
              )}
              {settings.working_hours && (
                <span>🕐 {settings.working_hours}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ft-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center" style={{ padding: '12px 0', flexWrap: 'wrap', gap: '8px' }}>
            <div className="ft-copy">
              {settings.footer_copyright || `© ${new Date().getFullYear()} ${siteName} · Made in Vietnam`}
            </div>
            <div className="d-flex gap-4">
              <a href="#" style={{ fontSize: '12px', color: 'rgba(255,255,255,.18)', textDecoration: 'none' }}>
                Chính sách bảo mật
              </a>
              <a href="#" style={{ fontSize: '12px', color: 'rgba(255,255,255,.18)', textDecoration: 'none' }}>
                Điều khoản
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
