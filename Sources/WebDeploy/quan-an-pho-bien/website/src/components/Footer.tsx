import { Link } from 'react-router-dom'
import { useSite } from '../App'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Quán Ăn Phở Bình Dân'
  const copyright = settings.footer_copyright || `© ${new Date().getFullYear()} ${siteName}. Tất cả quyền được bảo lưu.`

  return (
    <footer>
      <div className="wd-container" style={{ padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,80px)' }}>
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="ft-logo">🍜 <span>{siteName}</span></div>
            <div className="ft-desc">{settings.footer_description || 'Ngon bình dân, no bụng, giá hợp lý. Phục vụ từ 6 giờ sáng mỗi ngày.'}</div>
            <div className="ft-socials">
              {settings.social_facebook && (
                <a href={settings.social_facebook} className="ft-soc" target="_blank" rel="noopener noreferrer" title="Facebook">f</a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} className="ft-soc" target="_blank" rel="noopener noreferrer" title="YouTube">▶</a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} className="ft-soc" target="_blank" rel="noopener noreferrer" title="Instagram">◉</a>
              )}
              {settings.social_tiktok && (
                <a href={settings.social_tiktok} className="ft-soc" target="_blank" rel="noopener noreferrer" title="TikTok">♫</a>
              )}
              {settings.social_zalo && (
                <a href={`https://zalo.me/${settings.social_zalo.replace(/\s/g, '')}`} className="ft-soc" target="_blank" rel="noopener noreferrer" title="Zalo">Z</a>
              )}
            </div>
          </div>
          <div className="col-6 col-lg-2 offset-lg-2">
            <div className="ft-col-title">Trang</div>
            <div className="ft-links">
              <Link to="/">Trang chủ</Link>
              <Link to="/thuc-don">Thực đơn</Link>
              <Link to="/cua-hang">Cửa hàng</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
          <div className="col-6 col-lg-4">
            <div className="ft-col-title">Thông tin</div>
            <div className="ft-links" style={{ gap: 10 }}>
              {settings.site_address && (
                <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,.35)' }}>📍 {settings.site_address}</span>
              )}
              {settings.site_phone && (
                <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`}>📞 {settings.site_phone}</a>
              )}
              {settings.site_email && (
                <a href={`mailto:${settings.site_email}`}>✉ {settings.site_email}</a>
              )}
              {settings.working_hours && (
                <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,.35)' }}>🕐 {settings.working_hours.split('|')[0]?.trim()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="ft-bottom">
        <div className="wd-container" style={{ padding: '16px clamp(20px,5vw,80px)' }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="ft-copy">{copyright}</div>
            <a href="/admin" className="ft-copy" style={{ opacity: .5, textDecoration: 'none' }}>Admin</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
