import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName  = settings.site_name    || 'Văn Phòng Luật Sư'
  const tagline   = settings.footer_description || settings.site_description || ''
  const phone     = settings.site_phone   || ''
  const email     = settings.site_email   || ''
  const address   = settings.site_address || ''
  const copyright = settings.footer_copyright || `© ${new Date().getFullYear()} ${siteName}. Bảo lưu mọi quyền.`
  const facebook  = settings.social_facebook || '#'
  const linkedin  = settings.social_linkedin  || '#'
  const zalo      = settings.social_zalo      || '#'

  return (
    <footer className="lv-footer">
      <div className="wd-container">
        <div className="lv-footer-grid">
          <div>
            <div className="lv-footer-logo">{siteName} <em>&amp; Đồng Nghiệp</em></div>
            {tagline && <p className="lv-footer-tagline">{tagline}</p>}
            {phone   && <p className="lv-footer-contact-line"><a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></p>}
            {email   && <p className="lv-footer-contact-line"><a href={`mailto:${email}`}>{email}</a></p>}
            {address && <p className="lv-footer-contact-line">{address}</p>}
          </div>
          <div>
            <div className="lv-footer-col-title">Lĩnh vực</div>
            <ul className="lv-footer-links">
              <li><Link to="/dich-vu">Luật Doanh Nghiệp &amp; M&amp;A</Link></li>
              <li><Link to="/dich-vu">Luật Lao Động</Link></li>
              <li><Link to="/dich-vu">Luật Bất Động Sản</Link></li>
              <li><Link to="/dich-vu">Tranh Tụng</Link></li>
              <li><Link to="/dich-vu">Tư Vấn Hợp Đồng</Link></li>
            </ul>
          </div>
          <div>
            <div className="lv-footer-col-title">Văn phòng</div>
            <ul className="lv-footer-links">
              <li><Link to="/luat-su">Đội Ngũ Luật Sư</Link></li>
              <li><Link to="/du-an">Vụ Việc Tiêu Biểu</Link></li>
              <li><Link to="/lien-he">Liên Hệ &amp; Tư Vấn</Link></li>
              <li><Link to="/lien-he">Chính Sách Bảo Mật</Link></li>
            </ul>
          </div>
        </div>
        <hr className="lv-footer-divider" />
        <div className="lv-footer-bottom">
          <p className="lv-footer-copy">{copyright}</p>
          <div className="lv-footer-social">
            {facebook !== '#' && <a href={facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
            {linkedin !== '#' && <a href={linkedin}  target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {zalo     !== '#' && <a href={zalo}      target="_blank" rel="noopener noreferrer">Zalo</a>}
            {facebook === '#' && <a href="#" rel="noopener noreferrer">Facebook</a>}
            {linkedin === '#' && <a href="#" rel="noopener noreferrer">LinkedIn</a>}
            {zalo     === '#' && <a href="#" rel="noopener noreferrer">Zalo</a>}
          </div>
        </div>
      </div>
    </footer>
  )
}
