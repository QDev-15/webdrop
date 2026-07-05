import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName   = settings.site_name    || 'Nụ Cười Xưa'
  const tagline    = settings.site_tagline || 'Nha Khoa'
  const phone      = settings.site_phone   || '0901 234 567'
  const email      = settings.site_email   || 'hello@nucoixua.vn'
  const address    = settings.site_address || '123 Nguyễn Văn Linh, Q.7, TP.HCM'
  const hours      = settings.working_hours|| 'T2-CN: 8:00 — 20:00'
  const footerCopy = settings.footer_copy  || `© ${new Date().getFullYear()} Nụ Cười Xưa Nha Khoa`

  const facebook  = settings.facebook  || '#'
  const instagram = settings.instagram || '#'
  const tiktok    = settings.tiktok    || '#'
  const zalo      = settings.zalo_number || settings.zalo || '#'

  return (
    <footer className="nc-footer">
      <div className="nc-footer-top">
        <div className="wd-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
            {/* Brand column */}
            <div>
              <Link to="/" className="nc-footer-brand">
                {siteName} <span>·</span> {tagline}
              </Link>
              <p className="nc-footer-tagline">
                Phòng khám nha khoa phong cách retro — nơi nụ cười đẹp gặp ký ức đẹp.
              </p>
              <div className="nc-footer-social">
                <a href={facebook} target="_blank" rel="noopener noreferrer" className="nc-social-link" aria-label="Facebook">f</a>
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="nc-social-link" aria-label="Instagram">ig</a>
                <a href={tiktok} target="_blank" rel="noopener noreferrer" className="nc-social-link" aria-label="TikTok">tt</a>
                <a href={`https://zalo.me/${zalo}`} target="_blank" rel="noopener noreferrer" className="nc-social-link" aria-label="Zalo">zl</a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <div className="nc-footer-col-title">Khám phá</div>
              <ul className="nc-footer-links">
                <li><Link to="/dich-vu">Dịch vụ nha khoa</Link></li>
                <li><Link to="/cau-chuyen">Câu chuyện của chúng tôi</Link></li>
                <li><Link to="/bac-si">Đội ngũ bác sĩ</Link></li>
                <li><Link to="/dat-lich">Đặt lịch khám</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <div className="nc-footer-col-title">Liên hệ</div>
              <ul className="nc-footer-links">
                <li><a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></li>
                <li><a href={`mailto:${email}`}>{email}</a></li>
                <li style={{ color: 'rgba(245,239,221,.62)', fontSize: '13.5px', lineHeight: 1.65 }}>{address}</li>
              </ul>
            </div>

            {/* Opening hours */}
            <div>
              <div className="nc-footer-col-title">Giờ làm việc</div>
              <ul className="nc-footer-hours">
                <li><span>Thứ 2 — Thứ 6</span><span>8:00 — 20:00</span></li>
                <li><span>Thứ 7</span><span>8:00 — 18:00</span></li>
                <li><span>Chủ nhật</span><span>8:00 — 12:00</span></li>
              </ul>
              {hours && (
                <p style={{ fontSize: '11.5px', color: 'rgba(245,239,221,.4)', marginTop: '12px', lineHeight: 1.6 }}>
                  {hours}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="wd-container">
        <div className="nc-footer-bottom">
          <p className="nc-footer-copy">{footerCopy}</p>
          <p className="nc-footer-copy">
            Thiết kế bởi <a href="https://webdrop.store" target="_blank" rel="noopener noreferrer">webdrop.store</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
