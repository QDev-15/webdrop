import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName   = settings.site_name || 'CÔNG TY'
  const phone      = settings.site_phone || ''
  const email      = settings.site_email || ''
  const address    = settings.site_address || ''
  const copyright  = settings.footer_copyright || `© 2024 ${siteName} Xây Dựng. Tất cả quyền được bảo lưu.`
  const footerDesc = settings.footer_description || ''
  const facebook   = settings.social_facebook || '#'
  const youtube    = settings.social_youtube || '#'

  return (
    <footer className="xd-footer" role="contentinfo">
      <div className="wd-container">
        <div className="row g-5">
          <div className="col-12 col-md-4">
            <div className="xd-footer-brand">
              <Link to="/" className="xd-logo" style={{ color: '#fff', marginBottom: 16, display: 'inline-flex' }}>
                <div className="xd-logo-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V9l9-6 9 6v12H3zM9 21V12h6v9" /></svg>
                </div>
                {siteName} <span style={{ color: 'var(--accent)' }}>XÂY DỰNG</span>
              </Link>
            </div>
            <p className="xd-footer-desc">{footerDesc}</p>
            <div className="xd-footer-social" aria-label="Mạng xã hội">
              {facebook && facebook !== '#' && (
                <a href={facebook} aria-label="Facebook" rel="noopener noreferrer" target="_blank">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
              )}
              {youtube && youtube !== '#' && (
                <a href={youtube} aria-label="YouTube" rel="noopener noreferrer" target="_blank">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.53C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
                </a>
              )}
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h3 className="xd-footer-heading">Dịch vụ</h3>
            <ul className="xd-footer-links">
              <li><Link to="/dich-vu">Thi công dân dụng</Link></li>
              <li><Link to="/dich-vu">Thi công công nghiệp</Link></li>
              <li><Link to="/dich-vu">Thiết kế kiến trúc</Link></li>
              <li><Link to="/dich-vu">Tư vấn dự án</Link></li>
              <li><Link to="/dich-vu">Cải tạo & sửa chữa</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h3 className="xd-footer-heading">Công ty</h3>
            <ul className="xd-footer-links">
              <li><Link to="/">Về chúng tôi</Link></li>
              <li><Link to="/du-an">Dự án</Link></li>
              <li><Link to="/lien-he">Tuyển dụng</Link></li>
              <li><Link to="/lien-he">Tin tức</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h3 className="xd-footer-heading">Liên hệ</h3>
            <ul className="xd-footer-links">
              {phone && <li><a href={`tel:${phone}`}>{phone}</a></li>}
              {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
              {address && <li style={{ color: 'rgba(255,255,255,.35)', fontSize: 14, lineHeight: 1.6 }}>{address}</li>}
            </ul>
            <div style={{ marginTop: 16 }}>
              <Link to="/lien-he" className="xd-btn-solid" style={{ fontSize: 11, padding: '10px 20px' }}>Báo giá miễn phí</Link>
            </div>
          </div>
        </div>

        <hr className="xd-footer-divider" />
        <div className="xd-footer-bottom">
          <p className="xd-footer-copy">{copyright}</p>
          <div className="xd-footer-legal">
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
