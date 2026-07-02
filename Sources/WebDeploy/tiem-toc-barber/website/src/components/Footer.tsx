import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Tiệm Tóc Barber'
  const year = new Date().getFullYear()

  return (
    <footer className="tb-footer">
      <div className="wd-container">
        <div className="tb-footer-top">
          <div className="row g-5">
            <div className="col-lg-4">
              <div className="tb-footer-brand">
                <span className="tb-logo-mark">B</span>
                {siteName}
              </div>
              <p className="tb-footer-tagline">
                {settings.footer_tagline || 'Tiệm tóc phong cách barber Mỹ — nơi kỹ thuật gặp nghệ thuật. Đặt lịch hôm nay để trải nghiệm sự khác biệt.'}
              </p>
              <div className="tb-footer-social">
                {settings.facebook_url && <a href={settings.facebook_url} className="tb-social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>}
                {settings.instagram_url && <a href={settings.instagram_url} className="tb-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>}
                {settings.tiktok_url && <a href={settings.tiktok_url} className="tb-social-link" target="_blank" rel="noopener noreferrer" aria-label="TikTok">tt</a>}
                {settings.zalo_url && <a href={settings.zalo_url} className="tb-social-link" target="_blank" rel="noopener noreferrer" aria-label="Zalo">zl</a>}
              </div>
            </div>
            <div className="col-6 col-lg-2">
              <div className="tb-footer-col-title">Điều hướng</div>
              <ul className="tb-footer-links">
                <li><Link to="/">Trang chủ</Link></li>
                <li><Link to="/dich-vu">Dịch vụ</Link></li>
                <li><Link to="/dat-lich">Đặt lịch</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
              </ul>
            </div>
            <div className="col-6 col-lg-2">
              <div className="tb-footer-col-title">Dịch vụ</div>
              <ul className="tb-footer-links">
                <li><Link to="/dich-vu">Cắt tóc nam</Link></li>
                <li><Link to="/dich-vu">Cắt tóc nữ</Link></li>
                <li><Link to="/dich-vu">Cạo râu</Link></li>
                <li><Link to="/dich-vu">Uốn / Nhuộm</Link></li>
                <li><Link to="/dich-vu">Chăm sóc tóc</Link></li>
              </ul>
            </div>
            <div className="col-lg-4">
              <div className="tb-footer-col-title">Giờ mở cửa</div>
              <ul className="tb-footer-hours">
                <li><span>Thứ 2 – Thứ 6</span><span>8:00 – 20:00</span></li>
                <li><span>Thứ 7</span><span>8:00 – 21:00</span></li>
                <li><span>Chủ nhật</span><span>9:00 – 19:00</span></li>
              </ul>
              <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,.35)', fontWeight: 300 }}>
                📍 {settings.site_address || 'Số nhà, Tên đường, Phường, Quận, TP'}
              </div>
            </div>
          </div>
        </div>
        <div className="tb-footer-bottom">
          <div className="tb-footer-copy">&copy; {year} {siteName}. Mọi quyền được bảo lưu.</div>
          <div className="tb-footer-copy">Được xây dựng bởi <a href="https://webdrop.store" target="_blank" rel="noopener noreferrer">webdrop.store</a></div>
        </div>
      </div>
    </footer>
  )
}
