import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const logoText = (settings.site_name || 'Đăng Photography').split(' ')[0].toUpperCase()

  return (
    <footer className="pna-footer">
      <div className="wd-container">
        <div className="pna-footer-main">
          <div>
            <Link to="/" className="pna-footer-logo">{logoText}<span>.</span></Link>
            <p className="pna-footer-tagline">{settings.footer_description || ''}</p>
            <div className="pna-footer-social">
              <a href={settings.facebook || '#'} className="pna-social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href={settings.instagram || '#'} className="pna-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>
              {settings.zalo_phone && (
                <a href={`https://zalo.me/${settings.zalo_phone.replace(/\D/g, '')}`} className="pna-social-link" target="_blank" rel="noopener noreferrer" aria-label="Zalo">zl</a>
              )}
            </div>
          </div>
          <div>
            <div className="pna-footer-col-title">Điều hướng</div>
            <ul className="pna-footer-links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/du-an">Dự án</Link></li>
              <li><Link to="/dich-vu">Dịch vụ</Link></li>
              <li><Link to="/ve-toi">Về tôi</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>
          <div>
            <div className="pna-footer-col-title">Dịch vụ</div>
            <ul className="pna-footer-links">
              <li><Link to="/dich-vu">Phóng sự cưới</Link></li>
              <li><Link to="/dich-vu">Pre-wedding</Link></li>
              <li><Link to="/dich-vu">Destination Wedding</Link></li>
              <li><Link to="/dich-vu">Quay phim cưới</Link></li>
            </ul>
          </div>
          <div>
            <div className="pna-footer-col-title">Nhận tin mới</div>
            <p style={{ fontSize: 13.5, fontWeight: 300, marginBottom: 14 }}>Nhận lịch trống &amp; ưu đãi đặt sớm mỗi mùa cưới.</p>
            <form className="pna-footer-newsletter" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Email của bạn" required />
              <button type="submit">Gửi</button>
            </form>
          </div>
        </div>

        {settings.map_embed && (
          <div className="pna-footer-maps">
            <iframe src={settings.map_embed} loading="lazy" title="Vị trí studio" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}

        <div className="pna-footer-bottom">
          <div>{settings.footer_copyright || ''}</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
