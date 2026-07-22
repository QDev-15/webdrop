import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const val = (k: string, fallback = '') => settings[k] || fallback
  const zaloPhone = val('zalo_number', '0909123456')

  return (
    <>
      <footer className="ma-footer">
        <div className="ma-container">
          <div className="ma-footer-grid">
            <div>
              <Link to="/" className="ma-footer-logo"><span className="ma-logo-dot" />PhotoPro</Link>
              <p className="ma-footer-desc">{val('footer_desc', 'Cửa hàng máy ảnh & thiết bị nhiếp ảnh chính hãng — thân máy, ống kính, tripod, phụ kiện — bảo hành chính hãng toàn quốc.')}</p>
              <div className="ma-footer-social">
                {val('facebook') && (
                  <a href={val('facebook')} className="ma-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
                )}
                {val('instagram') && (
                  <a href={val('instagram')} className="ma-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
                )}
                <a href={`https://zalo.me/${zaloPhone}`} className="ma-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Zalo"><i className="bi bi-chat-fill" /></a>
              </div>
            </div>
            <div className="ma-footer-col">
              <h4>Danh mục</h4>
              <ul>
                <li><Link to="/san-pham?cat=may-anh-mirrorless">Máy Ảnh Mirrorless</Link></li>
                <li><Link to="/san-pham?cat=may-anh-dslr">Máy Ảnh DSLR</Link></li>
                <li><Link to="/san-pham?cat=ong-kinh">Ống Kính</Link></li>
                <li><Link to="/san-pham?cat=tripod-phu-kien">Tripod & Phụ Kiện</Link></li>
              </ul>
            </div>
            <div className="ma-footer-col">
              <h4>Hỗ trợ</h4>
              <ul>
                <li><Link to="/dich-vu">Dịch vụ</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
                <li><Link to="/gio-hang">Theo dõi đơn hàng</Link></li>
                <li><Link to="/lien-he">Chính sách bảo hành</Link></li>
                <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
            <div className="ma-footer-col">
              <h4>Liên hệ</h4>
              <ul className="ma-footer-contact">
                <li><i className="bi bi-geo-alt" /> {val('site_address', '123 Nguyễn Huệ, Quận 1, TP.HCM')}</li>
                <li><i className="bi bi-telephone" /> {val('site_phone', '0909 123 456')}</li>
                <li><i className="bi bi-envelope" /> {val('site_email', 'lienhe@photopro.vn')}</li>
                <li><i className="bi bi-clock" /> {val('working_hours', '8:30 – 21:00 (Cả tuần)')}</li>
              </ul>
            </div>
          </div>
          <div className="ma-footer-bottom">
            <p>&copy; 2026 {val('site_name', 'PhotoPro')}. Tất cả quyền được bảo lưu.</p>
            <div className="ma-footer-pay">
              <span className="ma-pay-badge">VISA</span>
              <span className="ma-pay-badge">MoMo</span>
              <span className="ma-pay-badge">ZaloPay</span>
              <span className="ma-pay-badge">COD</span>
            </div>
          </div>
        </div>
      </footer>

      <div className="ma-zalo-float">
        <div className="ma-zalo-tooltip">Chat Zalo</div>
        <a href={`https://zalo.me/${zaloPhone}`} className="ma-zalo-btn" target="_blank" rel="noopener noreferrer" aria-label="Liên hệ qua Zalo">
          <i className="bi bi-chat-fill" />
        </a>
      </div>
    </>
  )
}
