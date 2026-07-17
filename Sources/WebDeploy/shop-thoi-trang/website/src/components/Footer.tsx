import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const siteName = settings.site_name || 'Nova Store'
  const [namePart1, ...rest] = siteName.split(' ')
  const namePart2 = rest.join(' ') || 'Store'
  const year = new Date().getFullYear()

  return (
    <footer className="st-footer" aria-label="Footer">
      <div className="st-container">
        <div className="st-footer-grid">
          <div>
            <div className="st-footer-logo">{namePart1}<span>.</span>{namePart2}</div>
            <p className="st-footer-desc">{settings.footer_desc || settings.site_description}</p>
            <div className="st-footer-socials">
              {settings.facebook && (
                <a href={settings.facebook} className="st-footer-social" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} className="st-footer-social" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} className="st-footer-social" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="bi bi-tiktok" /></a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} className="st-footer-social" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="bi bi-youtube" /></a>
              )}
            </div>
          </div>

          <div>
            <div className="st-footer-col-title">Sản Phẩm</div>
            <ul className="st-footer-links">
              {categories.map(c => (
                <li key={c.id}><Link to={`/san-pham?cat=${c.slug}`}>{c.name}</Link></li>
              ))}
              <li><Link to="/san-pham?sale=1">Sale</Link></li>
            </ul>
          </div>

          <div>
            <div className="st-footer-col-title">Hỗ Trợ</div>
            <ul className="st-footer-links">
              <li><Link to="/lien-he">Hướng dẫn mua hàng</Link></li>
              <li><Link to="/lien-he">Chính sách đổi trả</Link></li>
              <li><Link to="/lien-he">Chính sách vận chuyển</Link></li>
              <li><Link to="/lien-he">Câu hỏi thường gặp</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          <div>
            <div className="st-footer-col-title">Liên Hệ</div>
            <div className="st-footer-contact-row">
              <i className="bi bi-geo-alt" />
              <span>{settings.site_address}</span>
            </div>
            <div className="st-footer-contact-row">
              <i className="bi bi-telephone" />
              <span>{settings.site_phone}</span>
            </div>
            <div className="st-footer-contact-row">
              <i className="bi bi-envelope" />
              <span>{settings.site_email}</span>
            </div>
            <div className="st-footer-contact-row">
              <i className="bi bi-clock" />
              <span>{settings.working_hours}</span>
            </div>
          </div>
        </div>

        <div className="st-footer-bottom">
          <span>© {year} {siteName}. Bảo lưu mọi quyền.</span>
          <div className="st-pay-badges">
            <span className="st-pay-badge">VNPAY</span>
            <span className="st-pay-badge">MoMo</span>
            <span className="st-pay-badge">ZaloPay</span>
            <span className="st-pay-badge">COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
