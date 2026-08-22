import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const brandName = (settings.site_name || 'Lam Trúc Illustration').split(' ').slice(0, 2).join(' ').toUpperCase()

  return (
    <footer id="pmhFooter">
      <div className="pmh-container">
        <div className="pmh-footer-top">
          <div className="pmh-footer-brand">
            <Link to="/" className="pmh-logo"><span className="dot"></span>{brandName}</Link>
            <p>{settings.footer_description || ''}</p>
            <div className="pmh-social-row">
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>}
              {settings.behance && <a href={settings.behance} target="_blank" rel="noopener noreferrer" aria-label="Behance">Be</a>}
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>}
            </div>
          </div>
          <div className="pmh-footer-col">
            <h5>Điều hướng</h5>
            <Link to="/">Trang chủ</Link>
            <Link to="/du-an">Dự án</Link>
            <Link to="/dich-vu">Dịch vụ</Link>
            <Link to="/ve-toi">Về tôi</Link>
          </div>
          <div className="pmh-footer-col">
            <h5>Liên hệ</h5>
            {settings.site_email && <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a>}
            {settings.site_phone && <a href={`tel:+84${settings.site_phone.replace(/\D/g, '').replace(/^0/, '')}`}>{settings.site_phone}</a>}
            {settings.site_address && <p>{settings.site_address}</p>}
          </div>
          <div className="pmh-footer-col">
            <h5>Vị trí studio</h5>
            {settings.map_embed && (
              <div className="pmh-footer-maps">
                <iframe src={settings.map_embed} loading="lazy" title="Vị trí studio trên Google Maps" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            )}
          </div>
        </div>
        <div className="pmh-footer-bottom">
          <span>{settings.footer_copyright || ''}</span>
          <div className="legal-links">
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
