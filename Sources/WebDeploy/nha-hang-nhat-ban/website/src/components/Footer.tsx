import { Link } from 'react-router-dom'
import { useSite } from '../App'

export default function Footer() {
  const { settings } = useSite()
  const name = settings.site_name || 'Nhà Hàng Nhật Bản'
  const copyright = settings.footer_copyright || `© ${new Date().getFullYear()} ${name} · Made in Vietnam 🇻🇳`
  const desc = settings.footer_description || 'Nhà hàng Nhật Bản chính thống — nơi nghệ thuật ẩm thực và triết lý thiền định gặp nhau trên từng đĩa thức ăn.'

  return (
    <footer>
      <div className="wd-container">
        <div className="row g-4 py-5">
          <div className="col-md-4 reveal">
            <div className="ft-logo">鮨 {name} <span>日本</span></div>
            <p className="ft-desc">{desc}</p>
            <div className="ft-socials">
              {settings.social_facebook && <a href={settings.social_facebook} className="ft-soc" target="_blank" rel="noreferrer" aria-label="Facebook">fb</a>}
              {settings.social_instagram && <a href={settings.social_instagram} className="ft-soc" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>}
              {settings.social_zalo && <a href={`https://zalo.me/${settings.social_zalo}`} className="ft-soc" target="_blank" rel="noreferrer" aria-label="Zalo">zl</a>}
              {settings.social_youtube && <a href={settings.social_youtube} className="ft-soc" target="_blank" rel="noreferrer" aria-label="YouTube">yt</a>}
            </div>
          </div>
          <div className="col reveal reveal-d1">
            <div className="ft-col-title">Menu</div>
            <div className="ft-links">
              <Link to="/thuc-don">Thực đơn</Link>
              <Link to="/sushi-bar">Sushi Bar</Link>
              <Link to="/thuc-don">Omakase</Link>
              <Link to="/thuc-don">Sake & Rượu</Link>
            </div>
          </div>
          <div className="col reveal reveal-d2">
            <div className="ft-col-title">Nhà hàng</div>
            <div className="ft-links">
              <Link to="/">Trang chủ</Link>
              <Link to="/dat-ban">Đặt bàn</Link>
              <Link to="/lien-he">Liên hệ</Link>
              <a href="#">Sự kiện riêng</a>
            </div>
          </div>
          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Liên hệ</div>
            <div className="ft-links">
              {settings.site_phone && <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`}>📱 {settings.site_phone}</a>}
              {settings.site_address && <a href="#">📍 {settings.site_address}</a>}
              {settings.site_email && <a href={`mailto:${settings.site_email}`}>✉️ {settings.site_email}</a>}
              <a href="#">🕙 11:30–14:00 / 17:30–22:00</a>
            </div>
          </div>
        </div>
      </div>
      <div className="ft-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div className="ft-copy">{copyright}</div>
            <div className="ft-copy">お食事 寿司 日本料理</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
