import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const siteName = settings.site_name || 'Vườn Xanh'
  const [namePart1, ...rest] = siteName.split(' ')
  const namePart2 = rest.join(' ') || 'Xanh'
  const year = new Date().getFullYear()

  return (
    <footer id="rx-footer" role="contentinfo">
      <div className="rx-container">
        <div className="rx-footer-top">
          <div className="rx-newsletter-inner" data-reveal>
            <h3>{settings.newsletter_title || 'Nhận ưu đãi mỗi tuần'}</h3>
            <p>{settings.newsletter_desc || 'Đăng ký để nhận mã giảm giá combo rau và thông báo hàng theo mùa mới về.'}</p>
            <form className="rx-newsletter-form" onSubmit={e => e.preventDefault()} noValidate>
              <input type="email" name="email" placeholder="Email của bạn" aria-label="Nhập email đăng ký nhận tin" />
              <button type="submit">Đăng ký</button>
            </form>
          </div>
          <div className="rx-footer-social" data-reveal data-delay="1">
            {settings.facebook && (
              <a href={settings.facebook} className="rx-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} className="rx-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
            )}
            {settings.zalo && (
              <a href={settings.zalo} className="rx-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Zalo"><i className="bi bi-chat-dots" /></a>
            )}
          </div>
        </div>

        <div className="rx-footer-grid">
          <div className="rx-footer-brand">
            <Link to="/" className="rx-logo">{namePart1} <span>{namePart2}</span></Link>
            <p>{settings.footer_desc || settings.site_description}</p>
          </div>
          <div className="rx-footer-col">
            <h4>Sản phẩm</h4>
            <ul>
              <li><Link to="/san-pham">Tất cả sản phẩm</Link></li>
              {categories.slice(0, 3).map(c => (
                <li key={c.id}><Link to={`/san-pham?cat=${c.slug}`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="rx-footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/gio-hang">Giỏ hàng</Link></li>
              <li><Link to="/lien-he">Chính sách đổi trả</Link></li>
              <li><Link to="/lien-he">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>
          <div className="rx-footer-col">
            <h4>Liên hệ</h4>
            <ul>
              <li>{settings.site_address}</li>
              <li>{settings.site_phone}</li>
              <li>{settings.site_email}</li>
            </ul>
          </div>
        </div>

        <div className="rx-footer-bottom">
          <p>&copy; {year} {siteName}. Tất cả quyền được bảo lưu.</p>
          <div className="rx-footer-pay" aria-label="Phương thức thanh toán">
            <span className="rx-pay-badge">MoMo</span>
            <span className="rx-pay-badge">ZaloPay</span>
            <span className="rx-pay-badge">Chuyển khoản</span>
            <span className="rx-pay-badge">COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
