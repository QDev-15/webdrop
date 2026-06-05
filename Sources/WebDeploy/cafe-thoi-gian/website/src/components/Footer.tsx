import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName  = settings.site_name  || 'Cà Phê Thời Gian'
  const phone     = settings.site_phone || '0901 234 567'
  const address   = settings.site_address || 'Địa chỉ quán'
  const email     = settings.site_email  || 'hello@caphethogian.vn'
  const copyright = settings.footer_copyright || `© ${new Date().getFullYear()} ${siteName} · Made in Vietnam`
  const fbLink    = settings.social_facebook  || '#'
  const igLink    = settings.social_instagram || '#'
  const zlLink    = settings.social_zalo      || '#'
  const ttLink    = settings.social_tiktok    || '#'

  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4 py-5">
          <div className="col-md-4 reveal">
            <div className="ft-logo">☕ {siteName} <span>Cafe</span></div>
            <p className="ft-desc">Không gian cà phê ấm cúng, rang xay thủ công. Nơi thời gian chậm lại và mỗi tách là một trải nghiệm.</p>
            <div className="ft-socials">
              <a href={fbLink} className="ft-soc" aria-label="Facebook" target="_blank" rel="noopener noreferrer">fb</a>
              <a href={igLink} className="ft-soc" aria-label="Instagram" target="_blank" rel="noopener noreferrer">ig</a>
              <a href={zlLink} className="ft-soc" aria-label="Zalo" target="_blank" rel="noopener noreferrer">zl</a>
              <a href={ttLink} className="ft-soc" aria-label="TikTok" target="_blank" rel="noopener noreferrer">tt</a>
            </div>
          </div>
          <div className="col reveal reveal-d1">
            <div className="ft-col-title">Trang</div>
            <div className="ft-links">
              <Link to="/">Trang chủ</Link>
              <Link to="/menu">Thực đơn</Link>
              <Link to="/khong-gian">Không gian</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
          <div className="col reveal reveal-d2">
            <div className="ft-col-title">Dịch vụ</div>
            <div className="ft-links">
              <Link to="/lien-he">Đặt chỗ trước</Link>
              <Link to="/lien-he">Đặt tiệc nhỏ</Link>
              <Link to="/menu">Mua cà phê hạt</Link>
              <Link to="/lien-he">Hợp tác</Link>
            </div>
          </div>
          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Liên hệ</div>
            <div className="ft-links">
              <a href={`tel:${phone.replace(/\s/g, '')}`}>📱 {phone}</a>
              <a href="#">📍 {address}</a>
              <a href={`mailto:${email}`}>✉️ {email}</a>
              <a href="#">🕐 7:00 – 22:00 hàng ngày</a>
            </div>
          </div>
        </div>
      </div>
      <div className="ft-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div className="ft-copy">{copyright}</div>
            <div className="ft-copy">Thiết kế bởi webdrop.vn</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
