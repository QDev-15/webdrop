import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const siteName = settings.site_name || 'Tươi Mỗi Ngày'
  const year = new Date().getFullYear()

  return (
    <footer className="tp-footer">
      <div className="tp-container">
        <div className="tp-footer-grid">
          <div>
            <Link to="/" className="tp-footer-logo"><span className="tp-logo-dot" />{siteName}</Link>
            <p className="tp-footer-desc">{settings.footer_desc || settings.site_description}</p>
            <div className="tp-footer-social">
              {settings.facebook && (
                <a href={settings.facebook} className="tp-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} className="tp-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              )}
              {settings.zalo_number && (
                <a href={`https://zalo.me/${settings.zalo_number}`} className="tp-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Zalo"><i className="bi bi-chat-fill" /></a>
              )}
            </div>
          </div>
          <div className="tp-footer-col">
            <h4>Danh mục</h4>
            <ul>
              {categories.slice(0, 4).map(c => (
                <li key={c.id}><Link to={`/san-pham?cat=${c.slug}`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="tp-footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/gio-hang">Theo dõi đơn hàng</Link></li>
              <li><Link to="/lien-he">Chính sách đổi trả</Link></li>
              <li><Link to="/lien-he">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>
          <div className="tp-footer-col">
            <h4>Liên hệ</h4>
            <ul className="tp-footer-contact">
              <li><i className="bi bi-geo-alt" /> {settings.site_address}</li>
              <li><i className="bi bi-telephone" /> {settings.site_phone}</li>
              <li><i className="bi bi-envelope" /> {settings.site_email}</li>
              <li><i className="bi bi-clock" /> {settings.working_hours}</li>
            </ul>
          </div>
        </div>
        <div className="tp-footer-bottom">
          <p>&copy; {year} {siteName}. Tất cả quyền được bảo lưu.</p>
          <div className="tp-footer-pay">
            <span className="tp-pay-badge">VISA</span>
            <span className="tp-pay-badge">MoMo</span>
            <span className="tp-pay-badge">ZaloPay</span>
            <span className="tp-pay-badge">COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
