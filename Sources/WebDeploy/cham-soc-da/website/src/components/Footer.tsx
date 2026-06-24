import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const name = settings['site_name'] || 'DermaCare Clinic'
  const phone = settings['site_phone'] || '0901 234 567'
  const email = settings['site_email'] || 'info@dermacare.vn'
  const address = settings['site_address'] || '123 Nguyễn Huệ, Q.1, TP.HCM'
  const hours = settings['working_hours'] || 'Thứ 2 – Thứ 7: 8:00 – 18:00'
  const facebook = settings['facebook'] || '#'
  const instagram = settings['instagram'] || '#'
  const footerDesc = settings['footer_desc'] || 'Phòng khám da liễu chuyên sâu — điều trị bằng công nghệ hiện đại, đội ngũ bác sĩ giàu kinh nghiệm.'
  const copy = settings['footer_copy'] || `© ${new Date().getFullYear()} ${name}`
  const zaloNumber = settings['zalo_number'] || '0901234567'

  return (
    <>
      <footer className="csd-footer" data-reveal>
        <div className="wd-container py-5">
          <div className="row g-5">
            <div className="col-12 col-md-4">
              <div className="csd-ft-logo">
                <div className="csd-ft-logo-mark">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.134 2 5 5.134 5 9c0 2.32 1.06 4.384 2.72 5.76C9.1 15.84 10.5 18.2 10.5 21h3c0-2.8 1.4-5.16 2.78-6.24C17.94 13.384 19 11.32 19 9c0-3.866-3.134-7-7-7z"/></svg>
                </div>
                <span className="csd-ft-logo-text">Derma<span>Care</span></span>
              </div>
              <p className="csd-ft-desc">{footerDesc}</p>
              <div className="csd-ft-socials">
                {facebook && facebook !== '#' && (
                  <a href={facebook} className="csd-ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
                )}
                {instagram && instagram !== '#' && (
                  <a href={instagram} className="csd-ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Instagram">in</a>
                )}
                <a href={`https://zalo.me/${zaloNumber}`} className="csd-ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Zalo">z</a>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <div className="csd-ft-col-title">Dịch vụ</div>
              <div className="csd-ft-links">
                <Link to="/dich-vu">Điều trị mụn</Link>
                <Link to="/dich-vu">Trị nám & tàn nhang</Link>
                <Link to="/dich-vu">Trẻ hóa da</Link>
                <Link to="/dich-vu">Laser thẩm mỹ</Link>
                <Link to="/dich-vu">Xem tất cả →</Link>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <div className="csd-ft-col-title">Liên kết</div>
              <div className="csd-ft-links">
                <Link to="/">Trang chủ</Link>
                <Link to="/dich-vu">Dịch vụ</Link>
                <Link to="/dat-lich">Đặt lịch</Link>
                <Link to="/lien-he">Liên hệ</Link>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="csd-ft-col-title">Thông tin liên hệ</div>
              <div className="csd-ft-links">
                <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                <a href={`mailto:${email}`}>{email}</a>
                <span style={{ color: 'rgba(255,255,255,.32)', fontWeight: 300, fontSize: 13 }}>{address}</span>
                <span style={{ color: 'rgba(255,255,255,.32)', fontWeight: 300, fontSize: 13 }}>{hours}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="csd-ft-bottom py-3">
          <div className="wd-container d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="csd-ft-copy">{copy}</span>
            <div className="csd-ft-links-bottom">
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Zalo float */}
      <div className="csd-zf">
        <div className="csd-zf-tip">Nhắn Zalo ngay</div>
        <a
          href={`https://zalo.me/${zaloNumber}`}
          className="csd-zf-btn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
        >
          <svg viewBox="0 0 48 48" width="24" height="24" fill="currentColor" aria-hidden="true">
            <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm-4.2 27.6H17V20.4h2.8v11.2zm-1.4-12.6c-.9 0-1.6-.7-1.6-1.6s.7-1.6 1.6-1.6 1.6.7 1.6 1.6-.7 1.6-1.6 1.6zm14.8 12.6h-2.8V25c0-1.5-.5-2.5-1.8-2.5-1 0-1.5.7-1.8 1.3-.1.2-.1.5-.1.8v7.1H24v-8.5c0-1.1 0-2-.1-2.8h2.4l.1 1.5h.1c.4-.7 1.3-1.8 2.9-1.8 1.9 0 3.4 1.3 3.4 4v5.6z"/>
          </svg>
        </a>
      </div>
    </>
  )
}
