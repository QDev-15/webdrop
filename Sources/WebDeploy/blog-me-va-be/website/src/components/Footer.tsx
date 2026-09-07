import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const siteName = settings.site_name || 'Cỏ Non Blog'
  const brandFirstWord = siteName.split(' ')[0] || 'Cỏ Non'

  return (
    <footer className="bmb-footer">
      <div className="bmb-container">
        <div className="bmb-ft-top">
          <div>
            <div className="bmb-ft-logo">🌱 {brandFirstWord}<em>.blog</em></div>
            <p className="bmb-ft-desc">{settings.footer_description || ''}</p>
            <div className="bmb-ft-social">
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>}
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>}
              {settings.youtube && <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="Youtube">▶️</a>}
            </div>
          </div>
          <div>
            <div className="bmb-ft-col-title">Chuyên mục</div>
            <div className="bmb-ft-links">
              {categories.map(c => (
                <Link key={c.id} to={`/chuyen-muc?cat=${c.slug}`}>{c.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="bmb-ft-col-title">Khám phá</div>
            <div className="bmb-ft-links">
              <Link to="/">Trang chủ</Link>
              <Link to="/cam-nang">Cẩm nang</Link>
              <Link to="/ve-toi">Về tôi</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
          <div>
            <div className="bmb-ft-col-title">Liên hệ</div>
            <div className="bmb-ft-links">
              {settings.site_email && <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a>}
              {settings.site_phone && <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`}>{settings.site_phone}</a>}
              <Link to="/lien-he">Gửi tin nhắn</Link>
            </div>
          </div>
        </div>
        {settings.map_embed && (
          <iframe className="bmb-footer-maps" src={settings.map_embed} loading="lazy" title={`Vị trí ${siteName}`} referrerPolicy="no-referrer-when-downgrade" />
        )}
      </div>
      <div className="bmb-ft-bottom">
        <div className="bmb-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div className="bmb-ft-copy">{settings.footer_copyright || ''}</div>
          <div className="bmb-ft-legal">
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
