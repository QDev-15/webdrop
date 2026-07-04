import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const QUICK_LINKS = [
  { to: '/dich-vu',         label: 'Dịch vụ niềng răng' },
  { to: '/quy-trinh-nieng', label: 'Quy trình điều trị' },
  { to: '/bac-si',          label: 'Đội ngũ bác sĩ' },
  { to: '/dat-lich',        label: 'Đặt lịch tư vấn' },
  { to: '/lien-he',         label: 'Liên hệ' },
]

const SERVICE_LINKS = [
  { to: '/dich-vu', label: 'Mắc cài kim loại' },
  { to: '/dich-vu', label: 'Mắc cài sứ thẩm mỹ' },
  { to: '/dich-vu', label: 'Mắc cài tự buộc' },
  { to: '/dich-vu', label: 'Invisalign' },
  { to: '/dich-vu', label: 'Khay trong suốt' },
]

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name    || 'Chỉnh Nha Sài Gòn'
  const tagline  = settings.site_tagline || 'Orthodontic Center'
  const phone    = settings.site_phone   || '028 3822 0000'
  const email    = settings.site_email   || 'lienhe@chinhnhasaigon.vn'
  const address  = settings.site_address || '123 Nguyễn Văn Trỗi, P.12, Q. Phú Nhuận, TP.HCM'
  const hours    = settings.working_hours|| 'T2–T7: 8:00–20:00 | CN: 8:00–12:00'
  const fb       = settings.facebook_url || ''
  const ig       = settings.instagram_url|| ''
  const yt       = settings.youtube_url  || ''
  const year     = new Date().getFullYear()

  return (
    <footer>
      <div className="wd-container">
        <div className="cn-ft-top">
          <div className="row g-5">
            {/* Brand */}
            <div className="col-12 col-lg-3">
              <Link to="/" className="cn-ft-logo" style={{ textDecoration: 'none' }}>
                <div className="cn-ft-logo-mark" aria-hidden="true" />
                <div>
                  <div className="cn-ft-logo-name">{siteName}</div>
                  <span className="cn-ft-logo-sub">{tagline}</span>
                </div>
              </Link>
              <p className="cn-ft-desc">Chuyên khoa niềng răng ứng dụng công nghệ số — scan 3D, kế hoạch điều trị kỹ thuật số, chính xác từng milimet.</p>
              <div className="cn-ft-socials">
                {fb && <a href={fb} target="_blank" rel="noopener noreferrer" className="cn-ft-soc">f</a>}
                {ig && <a href={ig} target="_blank" rel="noopener noreferrer" className="cn-ft-soc">ig</a>}
                {yt && <a href={yt} target="_blank" rel="noopener noreferrer" className="cn-ft-soc">yt</a>}
              </div>
            </div>

            {/* Quick links */}
            <div className="col-6 col-lg-2">
              <div className="cn-ft-col-title">Điều hướng</div>
              <div className="cn-ft-links">
                {QUICK_LINKS.map(l => (
                  <Link key={l.to + l.label} to={l.to}>{l.label}</Link>
                ))}
              </div>
            </div>

            {/* Services quick */}
            <div className="col-6 col-lg-2">
              <div className="cn-ft-col-title">Dịch vụ chỉnh nha</div>
              <div className="cn-ft-links">
                {SERVICE_LINKS.map(l => (
                  <Link key={l.label} to={l.to}>{l.label}</Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="col-12 col-lg-4 offset-lg-1">
              <div className="cn-ft-col-title">Liên hệ</div>
              <div className="cn-ft-contact-item">
                <div className="cn-ft-contact-icon">📍</div>
                <div className="cn-ft-contact-text">
                  <strong>Địa chỉ</strong>
                  {address}
                </div>
              </div>
              <div className="cn-ft-contact-item">
                <div className="cn-ft-contact-icon">📞</div>
                <div className="cn-ft-contact-text">
                  <strong>Điện thoại</strong>
                  <a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a>
                </div>
              </div>
              <div className="cn-ft-contact-item">
                <div className="cn-ft-contact-icon">✉</div>
                <div className="cn-ft-contact-text">
                  <strong>Email</strong>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              </div>
              <div className="cn-ft-contact-item">
                <div className="cn-ft-contact-icon">⏱</div>
                <div className="cn-ft-contact-text">
                  <strong>Giờ làm việc</strong>
                  {hours}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cn-ft-bottom">
          <div className="cn-ft-copy">© {year} {siteName}. Bảo lưu mọi quyền.</div>
          <div className="cn-ft-cert">
            <span>✓ Bộ Y tế cấp phép</span>
            <span>✓ Chỉnh nha chuyên khoa</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
