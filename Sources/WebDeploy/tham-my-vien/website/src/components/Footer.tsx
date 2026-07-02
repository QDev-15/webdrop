import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const QUICK_LINKS = [
  { to: '/dich-vu', label: 'Dịch vụ' },
  { to: '/bac-si',  label: 'Đội ngũ bác sĩ' },
  { to: '/tu-van',  label: 'Đặt lịch tư vấn' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name    || 'Thẩm Mỹ Viện Quốc Tế'
  const tagline  = settings.site_tagline || 'Medical Aesthetics'
  const phone    = settings.site_phone   || '0901 234 567'
  const email    = settings.site_email   || 'info@thammy.vn'
  const address  = settings.site_address || '123 Nguyễn Trãi, Quận 1, TP.HCM'
  const hours    = settings.working_hours|| 'T2–T7: 8:00 – 20:00 | CN: 9:00 – 17:00'
  const fb       = settings.facebook_url || ''
  const ig       = settings.instagram_url|| ''
  const yt       = settings.youtube_url  || ''
  const year     = new Date().getFullYear()

  return (
    <footer>
      <div className="wd-container">
        <div className="tmv-ft-top">
          <div className="row g-5">
            {/* Brand */}
            <div className="col-12 col-lg-3">
              <Link to="/" className="tmv-ft-logo" style={{ textDecoration: 'none' }}>
                <div className="tmv-ft-logo-mark">✦</div>
                <div>
                  <div className="tmv-ft-logo-name">{siteName}</div>
                  <div className="tmv-ft-logo-sub">{tagline}</div>
                </div>
              </Link>
              <p className="tmv-ft-desc">Đồng hành cùng vẻ đẹp — tự nhiên, an toàn và bền vững với đội ngũ chuyên gia hàng đầu.</p>
              <div className="tmv-ft-socials">
                {fb && <a href={fb} target="_blank" rel="noopener noreferrer" className="tmv-ft-soc">f</a>}
                {ig && <a href={ig} target="_blank" rel="noopener noreferrer" className="tmv-ft-soc">ig</a>}
                {yt && <a href={yt} target="_blank" rel="noopener noreferrer" className="tmv-ft-soc">yt</a>}
              </div>
            </div>

            {/* Quick links */}
            <div className="col-6 col-lg-2">
              <div className="tmv-ft-col-title">Điều hướng</div>
              <div className="tmv-ft-links">
                {QUICK_LINKS.map(l => (
                  <Link key={l.to} to={l.to}>{l.label}</Link>
                ))}
              </div>
            </div>

            {/* Services quick */}
            <div className="col-6 col-lg-2">
              <div className="tmv-ft-col-title">Dịch vụ nổi bật</div>
              <div className="tmv-ft-links">
                <Link to="/dich-vu">Nâng mũi cấu trúc</Link>
                <Link to="/dich-vu">Độn cằm V-Line</Link>
                <Link to="/dich-vu">Laser CO2 Fractional</Link>
                <Link to="/dich-vu">HIFU 7D căng da</Link>
                <Link to="/dich-vu">Botox &amp; Filler</Link>
              </div>
            </div>

            {/* Contact */}
            <div className="col-12 col-lg-4 offset-lg-1">
              <div className="tmv-ft-col-title">Liên hệ</div>
              <div className="tmv-ft-contact-item">
                <div className="tmv-ft-contact-icon">📍</div>
                <div className="tmv-ft-contact-text">
                  <strong>Địa chỉ</strong>
                  {address}
                </div>
              </div>
              <div className="tmv-ft-contact-item">
                <div className="tmv-ft-contact-icon">📞</div>
                <div className="tmv-ft-contact-text">
                  <strong>Điện thoại</strong>
                  <a href={`tel:${phone.replace(/\s/g,'')}`} style={{ color: 'inherit' }}>{phone}</a>
                </div>
              </div>
              <div className="tmv-ft-contact-item">
                <div className="tmv-ft-contact-icon">✉</div>
                <div className="tmv-ft-contact-text">
                  <strong>Email</strong>
                  <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>
                </div>
              </div>
              <div className="tmv-ft-contact-item">
                <div className="tmv-ft-contact-icon">⏱</div>
                <div className="tmv-ft-contact-text">
                  <strong>Giờ làm việc</strong>
                  {hours}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tmv-ft-bottom">
          <div className="tmv-ft-copy">© {year} {siteName}. Bảo lưu mọi quyền.</div>
          <div className="tmv-ft-cert">
            <span>✓ Bộ Y tế cấp phép</span>
            <span>✓ ISO 9001:2015</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
