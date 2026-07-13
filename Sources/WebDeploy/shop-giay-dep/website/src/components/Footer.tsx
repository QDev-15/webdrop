import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const siteName = settings.site_name || 'Volt Kicks'
  const [namePart1, ...rest] = siteName.split(' ')
  const namePart2 = rest.join(' ') || 'Kicks'
  const year = new Date().getFullYear()

  return (
    <footer id="gd-footer" role="contentinfo">
      <div className="gd-container">
        <div className="gd-footer-grid">
          <div className="gd-footer-brand">
            <Link to="/" className="gd-logo">{namePart1}<span>.</span>{namePart2}</Link>
            <p>{settings.footer_desc || settings.site_description}</p>
            <div className="gd-footer-social">
              {settings.facebook && (
                <a href={settings.facebook} className="gd-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} className="gd-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} className="gd-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="bi bi-tiktok" /></a>
              )}
              {settings.zalo_number && (
                <a href={`https://zalo.me/${settings.zalo_number}`} className="gd-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Zalo"><i className="bi bi-chat-dots" /></a>
              )}
            </div>
          </div>

          <div className="gd-footer-col">
            <h4>Sản phẩm</h4>
            <ul>
              <li><Link to="/san-pham">Tất cả sản phẩm</Link></li>
              {categories.slice(0, 4).map(c => (
                <li key={c.id}><Link to={`/san-pham?cat=${c.slug}`}>{c.name}</Link></li>
              ))}
              <li><Link to="/san-pham?sale=1">Đang giảm giá</Link></li>
            </ul>
          </div>

          <div className="gd-footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/gio-hang">Theo dõi đơn hàng</Link></li>
              <li><Link to="/lien-he">Chính sách đổi trả</Link></li>
              <li><Link to="/lien-he">Hướng dẫn chọn size</Link></li>
              <li><Link to="/lien-he">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="gd-footer-bottom">
          <p>&copy; {year} {siteName}. Tất cả quyền được bảo lưu.</p>
          <div className="gd-footer-pay">
            <span className="gd-pay-badge">VISA</span>
            <span className="gd-pay-badge">MasterCard</span>
            <span className="gd-pay-badge">MoMo</span>
            <span className="gd-pay-badge">ZaloPay</span>
            <span className="gd-pay-badge">COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
