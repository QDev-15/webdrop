import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const siteName = settings.site_name || 'Lys Chic'
  const [namePart1, ...rest] = siteName.split(' ')
  const namePart2 = rest.join(' ') || 'Chic'
  const year = new Date().getFullYear()

  return (
    <footer id="qa-footer" role="contentinfo">
      <div className="qa-container">
        <div className="qa-footer-grid">
          <div className="qa-footer-brand">
            <Link to="/" className="qa-logo">{namePart1}<span>.</span>{namePart2}</Link>
            <p>{settings.footer_desc || settings.site_description}</p>
            <div className="qa-footer-social">
              {settings.facebook && (
                <a href={settings.facebook} className="qa-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} className="qa-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} className="qa-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="bi bi-tiktok" /></a>
              )}
              {settings.zalo_number && (
                <a href={`https://zalo.me/${settings.zalo_number}`} className="qa-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Zalo"><i className="bi bi-chat-dots" /></a>
              )}
            </div>
          </div>

          <div className="qa-footer-col">
            <h4>Sản phẩm</h4>
            <ul>
              <li><Link to="/san-pham">Tất cả sản phẩm</Link></li>
              <li><Link to="/bo-suu-tap">Bộ sưu tập</Link></li>
              {categories.slice(0, 4).map(c => (
                <li key={c.id}><Link to={`/san-pham?cat=${c.slug}`}>{c.name}</Link></li>
              ))}
              <li><Link to="/san-pham?sale=1">Đang giảm giá</Link></li>
            </ul>
          </div>

          <div className="qa-footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="/ve-chung-toi">Về chúng tôi</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/gio-hang">Theo dõi đơn hàng</Link></li>
              <li><Link to="/lien-he">Chính sách đổi trả</Link></li>
              <li><Link to="/lien-he">Hướng dẫn chọn size</Link></li>
              <li><Link to="/lien-he">FAQ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
        </div>

        <div className="qa-footer-bottom">
          <p>&copy; {year} {siteName}. Tất cả quyền được bảo lưu.</p>
          <div className="qa-footer-pay">
            <span className="qa-pay-badge">VISA</span>
            <span className="qa-pay-badge">MasterCard</span>
            <span className="qa-pay-badge">MoMo</span>
            <span className="qa-pay-badge">ZaloPay</span>
            <span className="qa-pay-badge">COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
