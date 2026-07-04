import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name    || 'Chỉnh Nha Sài Gòn'
  const tagline  = settings.site_tagline || 'Orthodontic Center'
  const phone    = settings.site_phone   || '028 3822 XXXX'
  const email    = settings.site_email   || 'lienhe@chinhnhasaigon.vn'
  const address  = settings.site_address || '123 Nguyễn Văn Trỗi, P.12, Q. Phú Nhuận, TP.HCM'
  const hours    = settings.working_hours|| 'T2–T7: 8:00–20:00 · CN: 8:00–12:00'
  const fb       = settings.facebook_url || ''
  const ig       = settings.instagram_url|| ''
  const yt       = settings.youtube_url  || ''
  const year     = new Date().getFullYear()

  return (
    <footer className="cn-footer">
      <div className="wd-container">
        <div className="cn-footer-grid">
          {/* Brand */}
          <div className="cn-footer-brand">
            <Link to="/" className="cn-logo">
              <span className="cn-logo-mark" aria-hidden="true" />
              <span className="cn-logo-text">
                {siteName}
                <span>{tagline}</span>
              </span>
            </Link>
            <p className="cn-footer-tagline">Chuyên khoa chỉnh nha — niềng răng công nghệ số, chính xác từng milimet cho nụ cười hoàn hảo.</p>
            <div className="cn-footer-social">
              {fb && (
                <a href={fb} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8H6v4h3v12h5V12h3.6l.4-4H14V6.3c0-1 .2-1.3 1.2-1.3H19V0h-4.4C10.8 0 9 1.7 9 5.3V8z"/></svg>
                </a>
              )}
              {ig && (
                <a href={ig} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.7 0 3 0 4.1.06 1.1.05 1.8.2 2.5.5.7.3 1.2.6 1.7 1.1.5.5.9 1 1.1 1.7.3.6.4 1.4.5 2.5C22 8.9 22 9.3 22 12s0 3-.06 4.1c-.05 1.1-.2 1.9-.5 2.5-.2.7-.6 1.2-1.1 1.7-.5.5-1 .9-1.7 1.1-.6.3-1.4.4-2.5.5C15 22 14.7 22 12 22s-3 0-4.1-.06c-1.1-.05-1.9-.2-2.5-.5-.7-.2-1.2-.6-1.7-1.1-.5-.5-.9-1-1.1-1.7-.3-.6-.4-1.4-.5-2.5C2 15.1 2 14.7 2 12s0-3 .06-4.1c.05-1.1.2-1.9.5-2.5.2-.7.6-1.2 1.1-1.7.5-.5 1-.9 1.7-1.1.6-.3 1.4-.4 2.5-.5C8.9 2 9.3 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.2-8.4a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z"/></svg>
                </a>
              )}
              {yt && (
                <a href={yt} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.6-.5-5.3c-.3-1-1-1.7-2-2C18.9 4.2 12 4.2 12 4.2s-6.9 0-8.5.5c-1 .3-1.7 1-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3c.3 1 1 1.7 2 2 1.6.5 8.5.5 8.5.5s6.9 0 8.5-.5c1-.3 1.7-1 2-2 .5-1.7.5-5.3.5-5.3zM9.7 15.5V8.5L15.8 12l-6.1 3.5z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Nav */}
          <div>
            <div className="cn-footer-col-title">Điều hướng</div>
            <ul className="cn-footer-links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/dich-vu">Dịch vụ</Link></li>
              <li><Link to="/quy-trinh-nieng">Quy trình niềng</Link></li>
              <li><Link to="/bac-si">Đội ngũ bác sĩ</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="cn-footer-col-title">Dịch vụ</div>
            <ul className="cn-footer-links">
              <li><Link to="/dich-vu">Mắc cài kim loại</Link></li>
              <li><Link to="/dich-vu">Mắc cài sứ</Link></li>
              <li><Link to="/dich-vu">Invisalign</Link></li>
              <li><Link to="/dat-lich">Đặt lịch tư vấn</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="cn-footer-col-title">Liên hệ</div>
            <ul className="cn-footer-contact">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {address}
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'inherit' }}>{phone}</a>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="M4 6l8 6 8-6"/></svg>
                <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                {hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="cn-footer-divider" />
        <div className="cn-footer-bottom">
          <div className="cn-footer-copy">© {year} {siteName}. All rights reserved.</div>
          <div className="cn-footer-legal">
            <a href="#!">Chính sách bảo mật</a>
            <a href="#!">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
