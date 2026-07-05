import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Future Dental'
  const address = settings.site_address || ''
  const phone = settings.site_phone || ''
  const hours = settings.working_hours || 'T2–T7: 8:00–20:00 | CN: 9:00–17:00'
  const footerCopy = settings.footer_copy || `© 2026 ${siteName}. Bảo lưu mọi quyền.`
  const fbUrl = settings.facebook_url || 'https://facebook.com/futuredental'
  const igUrl = settings.instagram_url || 'https://instagram.com/futuredental'
  const ytUrl = settings.youtube_url || ''
  const ttUrl = settings.tiktok_url || ''

  return (
    <footer>
      <div className="wd-container">
        <div className="ft-ft-top">
          <div className="row g-5">
            <div className="col-lg-4">
              <div className="ft-ft-logo">
                <div className="ft-logo-mark" style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" width="22" height="22">
                    <path d="M12 3c-2.5 0-4.5 1.6-5.2 3.8C6 8.4 5.5 10 5.5 12c0 3 1 6.5 2.3 8.2.6.8 1.4.8 1.9-.1.4-.7.8-2.3 1-3.6.15-.9.7-1.5 1.3-1.5s1.15.6 1.3 1.5c.2 1.3.6 2.9 1 3.6.5.9 1.3.9 1.9.1C17.5 18.5 18.5 15 18.5 12c0-2-.5-3.6-1.3-5.2C16.5 4.6 14.5 3 12 3z"/>
                  </svg>
                </div>
                <div>
                  <div className="ft-ft-logo-name">{siteName}</div>
                  <div className="ft-ft-logo-sub">Implant 3D Clinic</div>
                </div>
              </div>
              <p className="ft-ft-desc">Chuyên khoa cấy ghép Implant ứng dụng công nghệ số hóa toàn diện — chính xác, an toàn, bền vững theo thời gian.</p>
              <div className="ft-ft-socials">
                {fbUrl && <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="ft-ft-soc" aria-label="Facebook">f</a>}
                {igUrl && <a href={igUrl} target="_blank" rel="noopener noreferrer" className="ft-ft-soc" aria-label="Instagram">in</a>}
                {ytUrl && <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="ft-ft-soc" aria-label="YouTube">▶</a>}
                {ttUrl && <a href={ttUrl} target="_blank" rel="noopener noreferrer" className="ft-ft-soc" aria-label="TikTok">♪</a>}
              </div>
            </div>

            <div className="col-md-4 col-lg-2 offset-lg-1">
              <div className="ft-ft-col-title">Dịch vụ</div>
              <div className="ft-ft-links">
                <Link to="/dich-vu-implant">Implant một răng</Link>
                <Link to="/dich-vu-implant">All-on-4</Link>
                <Link to="/dich-vu-implant">All-on-6</Link>
                <Link to="/cong-nghe-3d">Scan 3D Intraoral</Link>
                <Link to="/cong-nghe-3d">CAD-CAM Design</Link>
              </div>
            </div>

            <div className="col-md-4 col-lg-2">
              <div className="ft-ft-col-title">Liên kết</div>
              <div className="ft-ft-links">
                <Link to="/">Trang chủ</Link>
                <Link to="/bac-si">Đội ngũ bác sĩ</Link>
                <Link to="/dat-lich">Đặt lịch</Link>
                <Link to="/lien-he">Liên hệ</Link>
              </div>
            </div>

            <div className="col-md-4 col-lg-3">
              <div className="ft-ft-col-title">Liên hệ</div>
              {address && (
                <div className="ft-ft-contact-item">
                  <div className="ft-ft-contact-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-h)" strokeWidth="1.8"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div className="ft-ft-contact-text"><strong>Địa chỉ</strong>{address}</div>
                </div>
              )}
              {phone && (
                <div className="ft-ft-contact-item">
                  <div className="ft-ft-contact-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-h)" strokeWidth="1.8"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div className="ft-ft-contact-text"><strong>Điện thoại</strong>{phone}</div>
                </div>
              )}
              <div className="ft-ft-contact-item">
                <div className="ft-ft-contact-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-h)" strokeWidth="1.8"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div className="ft-ft-contact-text"><strong>Giờ làm việc</strong>{hours}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="ft-ft-bottom">
          <div className="ft-ft-copy">{footerCopy}</div>
          <div className="ft-ft-cert">
            <span>Giấy phép CSYT</span>
            <span>Bộ Y Tế cấp phép</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
