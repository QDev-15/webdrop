import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name || 'VietFinance'
  const email    = settings.site_email || 'info@vietfinance.vn'
  const phone    = settings.site_phone || '028 3823 4567'
  const address  = settings.site_address || '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'
  const hours    = settings.working_hours || 'Thứ 2–6: 8:00–17:30'
  const license  = settings.license_number || 'XXXX/UBCKNN'
  const copyright = settings.footer_copyright || `2025 ${siteName}. Bảo lưu mọi quyền.`
  const disclaimer = settings.footer_disclaimer || 'Các thông tin trên website chỉ mang tính tham khảo và không cấu thành lời khuyên đầu tư. Đầu tư có rủi ro.'
  const facebook = settings.social_facebook || ''
  const linkedin = settings.social_linkedin || ''
  const youtube  = settings.social_youtube || ''
  const tagline  = settings.footer_tagline || 'Đồng hành cùng bạn trên hành trình xây dựng tự do tài chính — từ kế hoạch đến thực thi.'

  return (
    <footer className="tc-footer">
      <div className="wd-container">
        <div className="tc-footer-top">
          <div className="row g-5">
            <div className="col-lg-4 col-md-6">
              <div className="tc-footer-logo">
                <div className="tc-footer-logo-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>
                </div>
                <span className="tc-footer-brand">{siteName.split(' ')[0]} <span>Finance</span></span>
              </div>
              <p className="tc-footer-desc">{tagline}</p>
              <div className="tc-footer-license">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                Giấy phép số {license}
              </div>
              {(facebook || linkedin || youtube) && (
                <div className="tc-social-links mt-3">
                  {facebook && (
                    <a href={facebook} className="tc-social-btn" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                  )}
                  {linkedin && (
                    <a href={linkedin} className="tc-social-btn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  )}
                  {youtube && (
                    <a href={youtube} className="tc-social-btn" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="col-lg-2 col-md-6">
              <div className="tc-footer-col-title">Dịch vụ</div>
              <ul className="tc-footer-links">
                <li><Link to="/dich-vu">Quản lý Đầu tư</Link></li>
                <li><Link to="/dich-vu">Tư vấn Thuế</Link></li>
                <li><Link to="/dich-vu">Hoạch định Tài chính</Link></li>
                <li><Link to="/dich-vu">Quản lý Rủi ro</Link></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6">
              <div className="tc-footer-col-title">Công ty</div>
              <ul className="tc-footer-links">
                <li><Link to="/doi-ngu">Đội ngũ chuyên gia</Link></li>
                <li><Link to="/">Trang chủ</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="tc-footer-col-title">Liên hệ</div>
              <div className="tc-footer-contact-item">
                <svg className="tc-footer-contact-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span className="tc-footer-contact-text">{address}</span>
              </div>
              <div className="tc-footer-contact-item">
                <svg className="tc-footer-contact-icon" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <span className="tc-footer-contact-text">{phone}<br />{hours}</span>
              </div>
              <div className="tc-footer-contact-item">
                <svg className="tc-footer-contact-icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span className="tc-footer-contact-text">{email}</span>
              </div>
              {settings.google_map_embed && (
                <div style={{ marginTop: '16px', borderRadius: '8px', overflow: 'hidden', height: '160px' }}>
                  <iframe src={settings.google_map_embed} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="tc-footer-bottom">
          <p className="tc-footer-copy">&copy; {copyright}</p>
          <p className="tc-footer-disclaimer">{disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
