import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Tam Thu Massage'
  const phone = settings.site_phone || '028 3812 7500'
  const address = settings.site_address || '45 Nguyen Dinh Chieu, Quan 3, TP.HCM'
  const email = settings.site_email || 'info@tamthumassage.vn'
  const facebook = settings.social_facebook || ''
  const instagram = settings.social_instagram || ''
  const zalo = settings.social_zalo || ''
  const year = new Date().getFullYear()

  return (
    <footer id="mrt-footer">
      <div className="mrt-ft-top">
        <div className="wd-container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <Link to="/" className="mrt-ft-logo">
                <div className="mrt-ft-logo-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3c-1 3-4 5-4 9a4 4 0 008 0c0-4-3-6-4-9z" />
                    <path d="M8 17s0 3 4 3 4-3 4-3" />
                  </svg>
                </div>
                {siteName}
              </Link>
              <p className="mrt-ft-desc">
                Trung tâm massage trị liệu chuyên nghiệp. Kết hợp kỹ thuật Thái cổ truyền và liệu pháp hiện đại.
              </p>
              <div className="mrt-ft-socials">
                {facebook && (
                  <a href={facebook} className="mrt-ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
                )}
                {instagram && (
                  <a href={instagram} className="mrt-ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Instagram">in</a>
                )}
                {zalo && (
                  <a href={zalo} className="mrt-ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Zalo">z</a>
                )}
              </div>
            </div>

            <div className="col-lg-2 col-md-6 offset-lg-1">
              <div className="mrt-ft-col-title">Liên kết</div>
              <div className="mrt-ft-links">
                <Link to="/">Trang chủ</Link>
                <Link to="/dich-vu">Dịch vụ &amp; Giá</Link>
                <Link to="/dat-lich">Đặt lịch</Link>
                <Link to="/lien-he">Liên hệ</Link>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="mrt-ft-col-title">Giờ làm việc</div>
              <div className="mrt-ft-hours">
                <div className="mrt-ft-hour-row"><span>Thứ 2 - Thứ 6</span><span>9:00 - 21:00</span></div>
                <div className="mrt-ft-hour-row"><span>Thứ 7 - CN</span><span>8:00 - 22:00</span></div>
                <div className="mrt-ft-hour-row"><span>Lễ, Tết</span><span>9:00 - 20:00</span></div>
              </div>
            </div>

            <div className="col-lg-2 col-md-6">
              <div className="mrt-ft-col-title">Liên hệ</div>
              <div className="mrt-ft-links">
                <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                <a href={`mailto:${email}`}>{email}</a>
                <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,.35)', lineHeight: 1.5 }}>{address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mrt-ft-bottom">
        <div className="wd-container">
          <p className="mrt-ft-copy">
            &copy; {year} {siteName}. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  )
}
