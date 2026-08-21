import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const logoText = settings.site_name || 'Tuấn Đặng Studio'

  return (
    <footer className="pkt-footer" data-reveal>
      <div className="pkt-container">
        <div className="pkt-footer-grid">
          <div>
            <Link to="/" className="pkt-footer-logo">{logoText}</Link>
            <p className="pkt-footer-desc">{settings.footer_description || ''}</p>
          </div>
          <div className="pkt-footer-cols">
            <div className="pkt-footer-col">
              <h5>Điều hướng</h5>
              <Link to="/du-an">Dự án</Link>
              <Link to="/dich-vu">Dịch vụ</Link>
              <Link to="/ve-toi">Về tôi</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
            <div className="pkt-footer-col">
              <h5>Liên hệ</h5>
              <span>{settings.site_phone}</span>
              <span>{settings.site_email}</span>
              <span>{settings.site_address}</span>
            </div>
          </div>
        </div>
        {settings.map_embed && (
          <div className="pkt-footer-maps">
            <iframe src={settings.map_embed} loading="lazy" title="Bản đồ studio" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
        <div className="pkt-footer-bottom">
          <span>{settings.footer_copyright || ''}</span>
          <div>
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
