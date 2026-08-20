import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const logoText = settings.site_logo_text || 'Digital'
  const facebook  = settings.facebook || '#'
  const twitter   = settings.twitter || '#'
  const linkedin  = settings.linkedin || '#'

  return (
    <footer>
      <div className="wd-container">
        <div className="di-footer-content">
          <div className="di-footer-brand" data-reveal="true">
            <h3>{logoText}.</h3>
            <p>{settings.footer_description || ''}</p>
          </div>
          <div className="di-footer-links" data-reveal="true" data-delay="1">
            <h4>Công ty</h4>
            <ul>
              <li><Link to="/ve-chung-toi">Về chúng tôi</Link></li>
              <li><Link to="/dich-vu">Dịch vụ</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>
          <div className="di-footer-links" data-reveal="true" data-delay="2">
            <h4>Pháp lý</h4>
            <ul>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
          <div className="di-footer-links" data-reveal="true" data-delay="3">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="/">Tài liệu API</Link></li>
              <li><Link to="/">Status page</Link></li>
            </ul>
          </div>
        </div>

        {settings.map_embed && (
          <div className="di-footer-maps" data-reveal="true">
            <iframe src={settings.map_embed} width="100%" height="300" style={{ border: 0 }} loading="lazy" title="Bản đồ" />
          </div>
        )}

        <div className="di-footer-bottom">
          <div className="di-copyright">{settings.footer_copyright || ''}</div>
          <div className="di-social-links">
            <a href={facebook} className="di-social-link" target="_blank" rel="noopener noreferrer">f</a>
            <a href={twitter} className="di-social-link" target="_blank" rel="noopener noreferrer">𝕏</a>
            <a href={linkedin} className="di-social-link" target="_blank" rel="noopener noreferrer">in</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
