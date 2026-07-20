import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const val = (k: string, fallback = '') => settings[k] || fallback
  const zaloPhone = val('zalo_number', '0900123456')

  return (
    <>
      <footer id="mt-footer">
        <div className="mt-container">
          <div className="mt-footer-grid">
            <div className="mt-footer-brand">
              <Link to="/" className="mt-logo">Nova<span>.</span>Tech</Link>
              <p>{val('footer_desc', 'Cửa hàng máy tính uy tín — laptop, PC gaming, linh kiện chính hãng và dịch vụ hậu mãi tận tâm.')}</p>
              <div className="mt-footer-social">
                {val('facebook') && (
                  <a href={val('facebook')} className="mt-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
                )}
                {val('instagram') && (
                  <a href={val('instagram')} className="mt-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
                )}
                {val('youtube') && (
                  <a href={val('youtube')} className="mt-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="bi bi-youtube" /></a>
                )}
                <a href={`https://zalo.me/${zaloPhone}`} className="mt-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Zalo"><i className="bi bi-chat-dots" /></a>
              </div>
            </div>
            <div className="mt-footer-col">
              <h4>Sản phẩm</h4>
              <ul>
                <li><Link to="/san-pham">Tất cả sản phẩm</Link></li>
                <li><Link to="/san-pham?cat=laptop">Laptop</Link></li>
                <li><Link to="/san-pham?cat=pc-desktop">PC Desktop</Link></li>
                <li><Link to="/san-pham?new=1">Sản phẩm mới</Link></li>
                <li><Link to="/khuyen-mai">Đang giảm giá</Link></li>
              </ul>
            </div>
            <div className="mt-footer-col">
              <h4>Hỗ trợ</h4>
              <ul>
                <li><Link to="/dich-vu">Dịch vụ</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
                <li><Link to="/gio-hang">Theo dõi đơn hàng</Link></li>
                <li><Link to="/lien-he">Chính sách bảo hành</Link></li>
                <li><Link to="/lien-he">FAQ</Link></li>
              </ul>
            </div>
            <div className="mt-footer-col">
              <h4>Chính sách</h4>
              <ul>
                <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-footer-bottom">
            <p>&copy; 2026 {val('site_name', 'NovaTech')}. Tất cả quyền được bảo lưu.</p>
            <div className="mt-footer-pay">
              <span className="mt-pay-badge">VISA</span>
              <span className="mt-pay-badge">MasterCard</span>
              <span className="mt-pay-badge">MoMo</span>
              <span className="mt-pay-badge">ZaloPay</span>
              <span className="mt-pay-badge">COD</span>
            </div>
          </div>
        </div>
      </footer>

      <div className="mt-zalo-float" aria-label="Chat Zalo">
        <div className="mt-zalo-tooltip">Chat Zalo</div>
        <a href={`https://zalo.me/${zaloPhone}`} className="mt-zalo-btn" target="_blank" rel="noopener noreferrer" aria-label="Liên hệ qua Zalo">
          <i className="bi bi-chat-fill" />
        </a>
      </div>
    </>
  )
}
