import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name || 'Balance Pilates Studio'
  const logoText  = (siteName.split(' ')[0] || 'BALANCE').toUpperCase()

  const year = new Date().getFullYear()

  return (
    <footer className="ps-footer">
      <div className="wd-container ps-footer-top">
        <div className="row g-4">
          <div className="col-md-4 reveal">
            <div className="ps-ft-logo">{logoText}<span className="ps-ft-logo-dot"></span></div>
            <p className="ps-ft-desc">{settings.footer_description || 'Studio pilates chuyên nghiệp — nơi sức khỏe, sự cân bằng và vẻ đẹp gặp nhau.'}</p>
            <div className="ps-ft-socials">
              {settings.social_facebook  && <a href={settings.social_facebook}  className="ps-ft-soc" target="_blank" rel="noopener noreferrer">fb</a>}
              {settings.social_instagram && <a href={settings.social_instagram} className="ps-ft-soc" target="_blank" rel="noopener noreferrer">ig</a>}
              {settings.social_youtube   && <a href={settings.social_youtube}   className="ps-ft-soc" target="_blank" rel="noopener noreferrer">yt</a>}
              {settings.social_zalo      && <a href={`https://zalo.me/${settings.social_zalo}`} className="ps-ft-soc" target="_blank" rel="noopener noreferrer">zl</a>}
            </div>
          </div>

          <div className="col reveal reveal-d1">
            <div className="ps-ft-col-title">Lớp học</div>
            <div className="ps-ft-links">
              <Link to="/dich-vu">Mat Pilates</Link>
              <Link to="/dich-vu">Reformer Pilates</Link>
              <Link to="/dich-vu">Clinical Pilates</Link>
              <Link to="/dich-vu">Prenatal Pilates</Link>
            </div>
          </div>

          <div className="col reveal reveal-d2">
            <div className="ps-ft-col-title">Studio</div>
            <div className="ps-ft-links">
              <Link to="/dat-lich">Đăng ký lớp</Link>
              <Link to="/dich-vu">Gói thành viên</Link>
              <Link to="/dich-vu">Huấn luyện viên</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>

          <div className="col reveal reveal-d3">
            <div className="ps-ft-col-title">Liên hệ</div>
            <div className="ps-ft-links">
              {settings.site_phone  && <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`}>{settings.site_phone}</a>}
              {settings.site_email  && <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a>}
              {settings.site_address && <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 13, fontWeight: 300 }}>{settings.site_address}</span>}
              {settings.working_hours && <span style={{ color: 'rgba(255,255,255,.28)', fontSize: 13, fontWeight: 300 }}>{settings.working_hours}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="ps-footer-bottom">
        <div className="wd-container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="ps-ft-copy">© {year} {siteName}. All rights reserved.</div>
            <div className="ps-ft-copy">Thiết kế bởi <a href="https://webdrop.store" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.3)', textDecoration: 'none' }}>webdrop.store</a></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
