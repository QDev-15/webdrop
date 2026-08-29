import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { IconFacebook, IconYoutube, IconZalo, IconPin, IconPhone, IconMail } from './icons'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Nhà Đất Việt'
  const nameParts = siteName.trim().split(' ')
  const nameLast = nameParts.pop() || ''
  const nameRest = nameParts.join(' ')
  const zalo = settings.zalo_phone || '0909888777'
  const lat = settings.contact_map_lat || '10.7756'
  const lng = settings.contact_map_lng || '106.7019'

  return (
    <footer className="ndv-footer" data-reveal="">
      <div className="ndv-container">
        <div className="ndv-footer-grid">
          <div className="ndv-footer-brand">
            <Link to="/" className="ndv-logo">
              <span className="ndv-logo-mark"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 10h3v10h6v-6h2v6h6V10h3z" /></svg></span>
              {nameRest ? nameRest + ' ' : ''}<span>{nameLast}</span>
            </Link>
            <p>{settings.footer_description || settings.site_description}</p>
            <div className="ndv-footer-social">
              {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebook /></a>}
              {settings.social_youtube && <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" aria-label="Youtube"><IconYoutube /></a>}
              <a href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener noreferrer" aria-label="Zalo"><IconZalo /></a>
            </div>
          </div>
          <div>
            <h4>Khám phá</h4>
            <ul>
              <li><Link to="/bat-dong-san?listingType=ban">Nhà đất bán</Link></li>
              <li><Link to="/bat-dong-san?listingType=cho-thue">Nhà đất cho thuê</Link></li>
              <li><Link to="/du-an">Dự án đang phân phối</Link></li>
              <li><Link to="/ve-chung-toi">Về {siteName}</Link></li>
            </ul>
          </div>
          <div>
            <h4>Công ty</h4>
            <ul>
              <li><Link to="/ve-chung-toi">Giới thiệu</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
          <div>
            <h4>Liên hệ</h4>
            <ul className="ndv-footer-contact">
              <li><IconPin /> {settings.site_address}</li>
              <li><IconPhone /> Hotline: {settings.site_phone} — {settings.site_phone2}</li>
              <li><IconMail /> {settings.site_email}</li>
            </ul>
          </div>
        </div>
        <div className="ndv-footer-maps">
          <iframe src={`https://maps.google.com/maps?q=${lat},${lng}&hl=vi&z=15&output=embed`} loading="lazy" title={`Bản đồ văn phòng ${siteName}`}></iframe>
        </div>
        <div className="ndv-footer-bottom">
          <span>{settings.footer_copyright || `© 2026 ${siteName}. Đã đăng ký bản quyền.`}</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
