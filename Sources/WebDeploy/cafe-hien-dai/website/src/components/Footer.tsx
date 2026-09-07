import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  return (
    <footer className="chd-footer">
      <div className="chd-container">
        <div className="chd-footer-grid">
          <div>
            <Link to="/" className="chd-footer-logo"><span className="chd-logo-dot"></span>{settings.site_name || 'MONO Coffee'}</Link>
            <p className="chd-footer-desc">{settings.footer_description}</p>
            <div className="chd-footer-social">
              <a href={settings.social_facebook || '#'} className="chd-soc-btn" aria-label="Facebook" target="_blank" rel="noopener noreferrer">FB</a>
              <a href={settings.social_instagram || '#'} className="chd-soc-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">IG</a>
              <a href={settings.social_tiktok || '#'} className="chd-soc-btn" aria-label="TikTok" target="_blank" rel="noopener noreferrer">TT</a>
            </div>
          </div>
          <div className="chd-footer-col">
            <h4>Trang</h4>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/menu">Thực đơn</Link></li>
              <li><Link to="/khong-gian">Không gian</Link></li>
              <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>
          <div className="chd-footer-col">
            <h4>Dịch vụ</h4>
            <ul>
              <li><Link to="/lien-he">Đặt chỗ nhóm</Link></li>
              <li><Link to="/lien-he">Đặt tiệc công ty</Link></li>
              <li><Link to="/menu">Mua hạt cà phê</Link></li>
              <li><Link to="/lien-he">Giao văn phòng</Link></li>
            </ul>
          </div>
          <div className="chd-footer-col">
            <h4>Liên hệ</h4>
            <ul className="chd-footer-contact">
              <li><i>📍</i>{settings.site_address}</li>
              <li><i>📱</i><a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`}>{settings.site_phone}</a></li>
              <li><i>✉️</i><a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></li>
              <li><i>🕐</i>{settings.working_hours}</li>
            </ul>
          </div>
        </div>
        <div className="chd-contact-map" style={{ marginBottom: 32 }}>
          <iframe src={settings.map_embed} loading="lazy" title={`Bản đồ ${settings.site_name || 'MONO Coffee'}`} allowFullScreen></iframe>
        </div>
        <div className="chd-footer-bottom">
          <p>{settings.footer_copyright}</p>
          <div className="chd-footer-legal">
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
          </div>
          <p>Thiết kế bởi webdrop.store</p>
        </div>
      </div>

      <div className="chd-zalo-float">
        <div className="chd-zalo-tooltip">Chat Zalo với quán</div>
        <a href={`https://zalo.me/${(settings.zalo_phone || '0901234567').replace(/\D/g, '')}`} className="chd-zalo-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">💬</a>
      </div>
    </footer>
  )
}
