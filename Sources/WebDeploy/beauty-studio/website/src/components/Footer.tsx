import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const year = new Date().getFullYear()

  return (
    <footer className="bst-footer reveal">
      <div className="wd-container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="bst-footer-logo">
              <span className="bst-logo-dot" />
              {settings.site_name}
              <span>&nbsp;Studio</span>
            </Link>
            <p className="bst-footer-tagline">{settings.footer_about || settings.site_tagline}</p>
            <div className="bst-social-row">
              {settings.facebook   && <a href={settings.facebook}   target="_blank" rel="noopener" className="bst-social-btn" title="Facebook">f</a>}
              {settings.instagram  && <a href={settings.instagram}  target="_blank" rel="noopener" className="bst-social-btn" title="Instagram">📷</a>}
              {settings.tiktok     && <a href={settings.tiktok}     target="_blank" rel="noopener" className="bst-social-btn" title="TikTok">♪</a>}
              {settings.youtube    && <a href={settings.youtube}    target="_blank" rel="noopener" className="bst-social-btn" title="YouTube">▶</a>}
              {settings.zalo       && <a href={`https://zalo.me/${settings.zalo}`} target="_blank" rel="noopener" className="bst-social-btn" title="Zalo" style={{ color: '#0068FF' }}>Z</a>}
            </div>
          </div>

          {/* Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <div className="bst-footer-title">Dịch vụ</div>
            <ul className="bst-footer-links">
              <li><Link to="/dich-vu#hair">Tóc</Link></li>
              <li><Link to="/dich-vu#nail">Nail</Link></li>
              <li><Link to="/dich-vu#makeup">Makeup</Link></li>
              <li><Link to="/dich-vu#skincare">Skincare</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <div className="bst-footer-title">Liên kết</div>
            <ul className="bst-footer-links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/dich-vu">Bảng giá</Link></li>
              <li><Link to="/dat-lich">Đặt lịch</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <div className="bst-footer-title">Liên hệ</div>
            {settings.site_address && (
              <div className="bst-footer-contact-item">
                <span>📍</span>
                <span>{settings.site_address}</span>
              </div>
            )}
            {settings.site_phone && (
              <div className="bst-footer-contact-item">
                <span>📞</span>
                <a href={`tel:${settings.site_phone}`}>{settings.site_phone}</a>
              </div>
            )}
            {settings.site_email && (
              <div className="bst-footer-contact-item">
                <span>✉</span>
                <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a>
              </div>
            )}
            {settings.working_hours && (
              <div className="bst-footer-contact-item">
                <span>🕐</span>
                <span>{settings.working_hours}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bst-footer-bottom">
          <div className="bst-footer-copy">
            &copy; {year} {settings.site_name}. Thiết kế bởi <a href="https://webdrop.vn" target="_blank" rel="noopener">Webdrop.vn</a>
          </div>
          <Link to="/dat-lich" className="bst-nav-cta" style={{ fontSize: 12, padding: '8px 18px' }}>Đặt lịch ngay</Link>
        </div>
      </div>
    </footer>
  )
}
