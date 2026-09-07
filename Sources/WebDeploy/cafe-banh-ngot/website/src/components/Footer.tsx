import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Rosette Bakery & Cafe'
  const [logoMain, ...rest] = siteName.split(' ')
  const logoTagline = rest.join(' ') || 'Bakery & Cafe'
  const zalo = (settings.zalo_phone || '0901234567').replace(/\D/g, '')

  return (
    <footer className="cbn-footer">
      <div className="cbn-container">
        <div className="row g-4 py-5">
          <div className="col-md-4 cbn-reveal">
            <div className="cbn-ft-logo">🌸 {logoMain} <span style={{ color: 'var(--accent)' }}>{logoTagline}</span></div>
            <p className="cbn-ft-desc">{settings.footer_description}</p>
            <div className="cbn-ft-socials">
              <a href={settings.facebook_url || '#'} className="cbn-ft-soc fb" aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>
              <a href={settings.instagram_url || '#'} className="cbn-ft-soc ig" aria-label="Instagram" target="_blank" rel="noopener noreferrer">ig</a>
              <a href={`https://zalo.me/${zalo}`} className="cbn-ft-soc zl" aria-label="Zalo" target="_blank" rel="noopener noreferrer">zl</a>
              <a href={settings.tiktok_url || '#'} className="cbn-ft-soc tt" aria-label="TikTok" target="_blank" rel="noopener noreferrer">tt</a>
            </div>
          </div>
          <div className="col cbn-reveal cbn-reveal-d1">
            <div className="cbn-ft-col-title">Trang</div>
            <div className="cbn-ft-links">
              <Link to="/">Trang chủ</Link>
              <Link to="/menu">Thực đơn</Link>
              <Link to="/khong-gian">Không gian</Link>
              <Link to="/gioi-thieu">Giới thiệu</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
          <div className="col cbn-reveal cbn-reveal-d2">
            <div className="cbn-ft-col-title">Dịch vụ</div>
            <div className="cbn-ft-links">
              <Link to="/lien-he">Đặt bánh sinh nhật</Link>
              <Link to="/lien-he">Đặt chỗ trước</Link>
              <Link to="/lien-he">Đặt tiệc trà nhóm</Link>
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/dieu-khoan">Điều khoản dịch vụ</Link>
            </div>
          </div>
          <div className="col cbn-reveal cbn-reveal-d3">
            <div className="cbn-ft-col-title">Liên hệ</div>
            <div className="cbn-ft-links">
              <a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`}>📱 {settings.site_phone}</a>
              <span>📍 {settings.site_address}</span>
              <a href={`mailto:${settings.site_email}`}>✉️ {settings.site_email}</a>
              <span>🕐 {settings.working_hours}</span>
            </div>
          </div>
        </div>
        {settings.map_embed && (
          <div className="cbn-reveal pb-5">
            <iframe className="cbn-ft-map" src={settings.map_embed} loading="lazy" title="Bản đồ Rosette Bakery & Cafe" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
      </div>
      <div className="cbn-ft-bottom">
        <div className="cbn-container">
          <div className="d-flex justify-content-between align-items-center py-3 flex-wrap gap-2">
            <div className="cbn-ft-copy">{settings.footer_copyright}</div>
            <div className="cbn-ft-copy"><a href="https://webdrop.store" target="_blank" rel="noopener noreferrer">Thiết kế bởi webdrop.store</a></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
