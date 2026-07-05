import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name    || 'Sunrise Nha Khoa Gia Đình'
  const tagline  = settings.site_tagline || 'Family Dental Care'
  const phone    = settings.site_phone   || '0900 000 000'
  const address  = settings.site_address || '123 Đường Gia Đình, Quận 1, TP.HCM'
  const hours    = settings.working_hours|| 'Thứ 2 - Chủ nhật: 8:00 - 20:00'
  const fb       = settings.facebook     || ''
  const ig       = settings.instagram    || ''
  const yt       = settings.youtube      || ''
  const cert     = settings.footer_cert  || ''
  const year     = new Date().getFullYear()
  const copy     = settings.footer_copy  || `© ${year} ${siteName}. All rights reserved.`

  return (
    <footer>
      <div className="sr-ft-top">
        <div className="wd-container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px 32px' }}>
            {/* Brand */}
            <div>
              <Link to="/" className="sr-ft-logo">
                <span className="sr-ft-logo-mark" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="1.8">
                    <circle cx="10" cy="10" r="4.5" />
                    <path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18" strokeLinecap="round" />
                  </svg>
                </span>
                <span>
                  <div className="sr-ft-logo-name">{siteName}</div>
                  <div className="sr-ft-logo-sub">{tagline}</div>
                </span>
              </Link>
              <p className="sr-ft-desc">
                Phòng khám nha khoa thân thiện dành cho cả gia đình — từ trẻ em đến người cao tuổi.
                Chăm sóc tận tâm, minh bạch chi phí, an toàn tiệt trùng.
              </p>
              <div className="sr-ft-socials">
                {fb && <a href={fb} target="_blank" rel="noopener noreferrer" className="sr-ft-soc" aria-label="Facebook">f</a>}
                {ig && <a href={ig} target="_blank" rel="noopener noreferrer" className="sr-ft-soc" aria-label="Instagram">ig</a>}
                {yt && <a href={yt} target="_blank" rel="noopener noreferrer" className="sr-ft-soc" aria-label="YouTube">yt</a>}
              </div>
            </div>

            {/* Nav */}
            <div>
              <div className="sr-ft-col-title">Điều hướng</div>
              <div className="sr-ft-links">
                <Link to="/">Trang chủ</Link>
                <Link to="/dich-vu">Dịch vụ</Link>
                <Link to="/bac-si">Bác sĩ</Link>
                <Link to="/dat-lich">Đặt lịch</Link>
                <Link to="/lien-he">Liên hệ</Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <div className="sr-ft-col-title">Dịch vụ nổi bật</div>
              <div className="sr-ft-links">
                <Link to="/dich-vu">Khám tổng quát</Link>
                <Link to="/dich-vu">Nha khoa trẻ em</Link>
                <Link to="/dich-vu">Trám răng Composite</Link>
                <Link to="/dich-vu">Cấy ghép Implant</Link>
                <Link to="/dich-vu">Tẩy trắng răng</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="sr-ft-col-title">Liên hệ</div>
              <div className="sr-ft-contact-item">
                <span className="sr-ft-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <div className="sr-ft-contact-text">
                  <strong>Địa chỉ</strong>{address}
                </div>
              </div>
              <div className="sr-ft-contact-item">
                <span className="sr-ft-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </span>
                <div className="sr-ft-contact-text">
                  <strong>Điện thoại</strong>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'inherit' }}>{phone}</a>
                </div>
              </div>
              <div className="sr-ft-contact-item">
                <span className="sr-ft-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                </span>
                <div className="sr-ft-contact-text">
                  <strong>Giờ làm việc</strong>{hours}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wd-container">
        <div className="sr-ft-bottom">
          <div className="sr-ft-copy">{copy.replace(String(new Date().getFullYear()), String(year))}</div>
          {cert && (
            <div className="sr-ft-cert">
              <span>{cert}</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
