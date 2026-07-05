import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName  = settings.site_name    || 'Nha Khoa Quốc Tế Việt Đức'
  const phone     = settings.site_phone   || '1900 1234'
  const email     = settings.site_email   || 'contact@vietduc.vn'
  const address   = settings.site_address || '123 Nguyễn Huệ, Q.1, TP.HCM'
  const hours     = settings.working_hours|| 'T2-T7: 8:00-20:00 | CN: 8:00-17:00'
  const footerCopy = settings.footer_copy || `© ${new Date().getFullYear()} ${siteName}`
  const footerCert = settings.footer_cert || 'ISO 9001 Certified'

  const facebook  = settings.facebook  || '#'
  const youtube   = settings.youtube   || '#'
  const zalo      = settings.zalo      || ''

  return (
    <footer className="vd-footer">
      <div className="vd-footer-top">
        <div className="wd-container">
          <div className="row">
            {/* Col 1: Brand */}
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <Link to="/" className="vd-footer-logo" style={{ textDecoration: 'none' }}>
                <div className="vd-footer-logo-mark">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                </div>
                <span className="vd-footer-brand">{siteName.split(' ').slice(0,2).join(' ')} <span>{siteName.split(' ').slice(2).join(' ')}</span></span>
              </Link>
              <p className="vd-footer-desc">
                Hệ thống nha khoa quốc tế chuẩn ISO 9001 — đội ngũ bác sĩ đa quốc gia, trang thiết bị hiện đại.
              </p>
              <div className="vd-footer-license">
                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'currentColor' }}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                {footerCert}
              </div>
              <div className="vd-social-links">
                {facebook !== '#' && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className="vd-social-btn" aria-label="Facebook">
                    <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  </a>
                )}
                {youtube !== '#' && (
                  <a href={youtube} target="_blank" rel="noopener noreferrer" className="vd-social-btn" aria-label="YouTube">
                    <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
                  </a>
                )}
                {zalo && (
                  <a href={`https://zalo.me/${zalo.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="vd-social-btn" aria-label="Zalo">
                    <svg viewBox="0 0 48 48" style={{ width: 15, height: 15 }}>
                      <path d="M14 30V18h3.2v9.3L22.5 18h3.6l-5.4 9.4L26.4 30h-3.7l-4.5-7.4V30H14z" fill="currentColor"/>
                      <path d="M28 30V18h3v12h-3z" fill="currentColor"/>
                      <path d="M33.5 30V18h6.8v2.6h-4v2.2h3.6v2.5h-3.6v2.1h4.1V30h-6.9z" fill="currentColor"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Col 2: Links */}
            <div className="col-lg-2 col-md-6 mb-4 mb-lg-0">
              <div className="vd-footer-col-title">Khám phá</div>
              <ul className="vd-footer-links">
                <li><Link to="/dich-vu">Dịch vụ nha khoa</Link></li>
                <li><Link to="/co-so-vat-chat">Cơ sở vật chất</Link></li>
                <li><Link to="/bac-si">Đội ngũ bác sĩ</Link></li>
                <li><Link to="/dat-lich">Đặt lịch khám</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
              </ul>
            </div>

            {/* Col 3: Services */}
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <div className="vd-footer-col-title">Dịch vụ</div>
              <ul className="vd-footer-links">
                <li><Link to="/dich-vu">Implant nha khoa</Link></li>
                <li><Link to="/dich-vu">Chỉnh nha niềng răng</Link></li>
                <li><Link to="/dich-vu">Răng sứ thẩm mỹ</Link></li>
                <li><Link to="/dich-vu">Tẩy trắng răng</Link></li>
                <li><Link to="/dich-vu">Răng trẻ em</Link></li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div className="col-lg-4 col-md-6">
              <div className="vd-footer-col-title">Liên hệ</div>
              <div className="vd-footer-contact-item">
                <svg className="vd-footer-contact-icon" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <span className="vd-footer-contact-text"><a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></span>
              </div>
              <div className="vd-footer-contact-item">
                <svg className="vd-footer-contact-icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span className="vd-footer-contact-text"><a href={`mailto:${email}`}>{email}</a></span>
              </div>
              <div className="vd-footer-contact-item">
                <svg className="vd-footer-contact-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span className="vd-footer-contact-text">{address}</span>
              </div>
              <div className="vd-footer-contact-item">
                <svg className="vd-footer-contact-icon" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
                <span className="vd-footer-contact-text">{hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wd-container">
        <div className="vd-footer-bottom">
          <p className="vd-footer-copy">{footerCopy}</p>
          <p className="vd-footer-copy">
            Thiết kế bởi <a href="https://webdrop.store" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>webdrop.store</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
