import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const logoPrefix = settings.site_logo_prefix || 'Mark'
  const logoSuffix = settings.site_logo_suffix || 'co'
  const facebook  = settings.facebook || '#'
  const twitter   = settings.twitter || '#'
  const linkedin  = settings.linkedin || '#'

  return (
    <footer>
      <div className="wd-container">
        <div className="mc-footer-content">
          <div className="mc-footer-brand" data-reveal="true">
            <h3>{logoPrefix}{logoSuffix}</h3>
            <p>{settings.footer_description || ''}</p>
          </div>
          <div className="mc-footer-links" data-reveal="true" data-delay="1">
            <h4>Công ty</h4>
            <ul>
              <li><Link to="/ve-chung-toi">Về chúng tôi</Link></li>
              <li><Link to="/dich-vu">Dịch vụ</Link></li>
              <li><Link to="/doi-ngu">Đội ngũ</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>
          <div className="mc-footer-links" data-reveal="true" data-delay="2">
            <h4>Tài nguyên</h4>
            <ul>
              <li><Link to="/">Blog</Link></li>
              <li><Link to="/">Case Study</Link></li>
              <li><Link to="/">Hướng dẫn</Link></li>
              <li><Link to="/">Tài liệu</Link></li>
            </ul>
          </div>
          <div className="mc-footer-links" data-reveal="true" data-delay="3">
            <h4>Pháp lý</h4>
            <ul>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              <li><Link to="/">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        {settings.map_embed && (
          <div className="mc-footer-maps" data-reveal="true">
            <iframe src={settings.map_embed} width="100%" height="300" style={{ border: 0 }} loading="lazy" title="Bản đồ" />
          </div>
        )}

        <div className="mc-footer-bottom">
          <div className="mc-copyright">{settings.footer_copyright || ''}</div>
          <div className="mc-social-links">
            <a href={facebook} className="mc-social-link" target="_blank" rel="noopener noreferrer" title="Facebook">f</a>
            <a href={twitter} className="mc-social-link" target="_blank" rel="noopener noreferrer" title="Twitter">𝕏</a>
            <a href={linkedin} className="mc-social-link" target="_blank" rel="noopener noreferrer" title="LinkedIn">in</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
