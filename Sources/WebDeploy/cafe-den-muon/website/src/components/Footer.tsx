import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const lat = settings.map_lat || '10.7847'
  const lng = settings.map_lng || '106.6917'
  const phone = settings.site_phone || '0901 234 567'

  return (
    <footer>
      <div className="cdm-container">
        <div className="row g-4 py-5">
          <div className="col-md-4 reveal">
            <div className="ft-logo"><span className="logo-dot"></span>NOX <span>COFFEE</span></div>
            <p className="ft-desc">{settings.footer_description || 'Espresso bar mở đến 2 giờ sáng — nơi thành phố ngủ nhưng công việc, bài vở và ý tưởng của bạn thì chưa xong.'}</p>
            <div className="ft-socials">
              {settings.social_facebook && <a href={settings.social_facebook} className="ft-soc" aria-label="Facebook" target="_blank" rel="noopener noreferrer">fb</a>}
              {settings.social_instagram && <a href={settings.social_instagram} className="ft-soc" aria-label="Instagram" target="_blank" rel="noopener noreferrer">ig</a>}
              {settings.social_zalo && <a href={`https://zalo.me/${settings.social_zalo}`} className="ft-soc" aria-label="Zalo" target="_blank" rel="noopener noreferrer">zl</a>}
              {settings.social_tiktok && <a href={settings.social_tiktok} className="ft-soc" aria-label="TikTok" target="_blank" rel="noopener noreferrer">tt</a>}
            </div>
          </div>
          <div className="col reveal reveal-d1">
            <div className="ft-col-title">Trang</div>
            <div className="ft-links">
              <Link to="/">Trang chủ</Link>
              <Link to="/thuc-don">Thực đơn</Link>
              <Link to="/khong-gian">Không gian</Link>
              <Link to="/gioi-thieu">Giới thiệu</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
          <div className="col reveal reveal-d2">
            <div className="ft-col-title">Dịch vụ</div>
            <div className="ft-links">
              <Link to="/lien-he">Đặt bàn trước</Link>
              <Link to="/lien-he">Đặt phòng học nhóm</Link>
              <Link to="/thuc-don">Mua cà phê hạt</Link>
              <Link to="/lien-he">Hợp tác</Link>
            </div>
          </div>
          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Pháp lý</div>
            <div className="ft-links">
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
            </div>
          </div>
          <div className="col reveal reveal-d3">
            <div className="ft-col-title">Liên hệ</div>
            <div className="ft-links">
              <a href={`tel:${phone.replace(/\s/g, '')}`}>📱 {phone}</a>
              <a href="#">📍 {settings.site_address || 'Đang cập nhật'}</a>
              {settings.site_email && <a href={`mailto:${settings.site_email}`}>✉️ {settings.site_email}</a>}
              <a href="#">🕐 {settings.working_hours || '18:00 – 02:00 hàng ngày'}</a>
            </div>
          </div>
        </div>
        <div className="reveal pb-4">
          <iframe className="cdm-map-embed" src={`https://maps.google.com/maps?q=${lat},${lng}&hl=vi&z=15&output=embed`} title="Bản đồ vị trí NOX Coffee" loading="lazy"></iframe>
        </div>
      </div>
      <div className="ft-bottom">
        <div className="cdm-container">
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div className="ft-copy">{settings.footer_copyright || `© ${new Date().getFullYear()} NOX Coffee · Made in Vietnam 🇻🇳`}</div>
            <div className="ft-copy">Thiết kế bởi webdrop.store</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
