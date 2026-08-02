import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = String(settings.site_name || 'Shop Đồ Gia Dụng')
  const tagline = String(settings.site_slogan || 'Đồ gia dụng chất lượng cao, giá tốt cho mọi gia đình')
  const phone = String(settings.site_phone || '')
  const email = String(settings.site_email || '')
  const address = String(settings.site_address || '')
  const facebook = String(settings.facebook || '')
  const youtube = String(settings.youtube || '')
  const instagram = String(settings.instagram || '')
  const year = new Date().getFullYear()

  return (
    <footer id="dg-footer" data-reveal>
      <div className="dg-container">
        <div className="dg-footer__main">
          {/* Brand column */}
          <div>
            <div className="dg-nav__logo" style={{ display: 'block', marginBottom: 14 }}>
              {siteName.split(' ').slice(0, -1).join(' ')} <span>{siteName.split(' ').slice(-1)[0]}</span>
            </div>
            <p className="dg-footer__tagline">{tagline}</p>
            <div className="dg-footer__socials">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="dg-footer__social" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="dg-footer__social" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor" stroke="none"/></svg>
                </a>
              )}
              {youtube && (
                <a href={youtube} target="_blank" rel="noopener noreferrer" className="dg-footer__social" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="dg-footer__col-title">Cửa hàng</p>
            <ul className="dg-footer__links">
              <li><Link to="/san-pham">Tất cả sản phẩm</Link></li>
              <li><Link to="/bo-suu-tap">Bộ sưu tập</Link></li>
              <li><Link to="/san-pham?theme=moi-ve">Hàng mới về</Link></li>
              <li><Link to="/san-pham?theme=giam-gia">Đang giảm giá</Link></li>
              <li><Link to="/san-pham?theme=ban-chay">Bán chạy nhất</Link></li>
            </ul>
          </div>

          {/* About links */}
          <div>
            <p className="dg-footer__col-title">Thông tin</p>
            <ul className="dg-footer__links">
              <li><Link to="/ve-chung-toi">Về chúng tôi</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="dg-footer__col-title">Liên hệ</p>
            <ul className="dg-footer__links">
              {phone && <li><a href={`tel:${phone}`}>{phone}</a></li>}
              {email && <li><a href={`mailto:${email}`}>{email}</a></li>}
              {address && <li style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, lineHeight: 1.6 }}>{address}</li>}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="dg-footer__bottom">
          <p className="dg-footer__copy">
            &copy; {year} {siteName}. Bảo lưu mọi quyền.
          </p>
          <div className="dg-footer__legal">
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
