import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const logoText = settings.site_logo_text || 'Strategy'

  return (
    <footer>
      <div className="wd-container">
        <div className="sc-footer-content">
          <div className="sc-footer-brand" data-reveal="true">
            <h3>{logoText} &amp; Co</h3>
            <p>{settings.footer_description || ''}</p>
          </div>
          <div className="sc-footer-links" data-reveal="true" data-delay="1">
            <h4>Công ty</h4>
            <ul>
              <li><Link to="/ve-chung-toi">Về chúng tôi</Link></li>
              <li><Link to="/dich-vu">Dịch vụ</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>
          <div className="sc-footer-links" data-reveal="true" data-delay="2">
            <h4>Tài nguyên</h4>
            <ul>
              <li><Link to="/">Blog</Link></li>
              <li><Link to="/">Case Study</Link></li>
              <li><Link to="/">Whitepaper</Link></li>
            </ul>
          </div>
          <div className="sc-footer-links" data-reveal="true" data-delay="3">
            <h4>Pháp lý</h4>
            <ul>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
        </div>

        {settings.map_embed && (
          <div className="sc-footer-maps" data-reveal="true">
            <iframe src={settings.map_embed} width="100%" height="300" style={{ border: 0 }} loading="lazy" title="Bản đồ" />
          </div>
        )}

        <div className="sc-footer-bottom">
          {settings.footer_copyright || ''}
        </div>
      </div>
    </footer>
  )
}
