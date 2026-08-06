import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const CATEGORY_LINKS = [
  { slug: 'but-viet', label: 'Bút viết' },
  { slug: 'so-tay', label: 'Sổ tay & giấy note' },
  { slug: 'file-kep', label: 'File & kẹp tài liệu' },
  { slug: 'dung-cu', label: 'Dụng cụ văn phòng' },
  { slug: 'balo-tui', label: 'Balo & túi laptop' },
]

export default function Footer() {
  const { settings } = useSite()
  const year = new Date().getFullYear()

  return (
    <footer className="vp-footer" aria-label="Footer">
      <div className="vp-container">
        <div className="vp-footer-grid">
          <div>
            <div className="vp-footer-logo">
              <span className="vp-logo-mark">OH</span>
              <span className="vp-logo-text">OFFICE<span>HUB</span></span>
            </div>
            <p className="vp-footer-desc">{settings.footer_about || 'Chuyên cung cấp văn phòng phẩm chính hãng cho cá nhân, doanh nghiệp và trường học trên toàn quốc.'}</p>
            <div className="vp-footer-social">
              {settings.facebook && (
                <a href={settings.facebook} aria-label="Facebook" rel="noopener noreferrer" target="_blank">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} aria-label="Instagram" rel="noopener noreferrer" target="_blank">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} aria-label="YouTube" rel="noopener noreferrer" target="_blank">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <h5>Sản phẩm</h5>
            <ul className="vp-footer-links">
              {CATEGORY_LINKS.map(c => (
                <li key={c.slug}><Link to={`/?category=${c.slug}`}>{c.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h5>Hỗ trợ</h5>
            <ul className="vp-footer-links">
              <li><Link to="/dich-vu">Dịch vụ doanh nghiệp</Link></li>
              <li><Link to="/khuyen-mai">Khuyến mãi</Link></li>
              <li><Link to="/bo-suu-tap">Bộ sưu tập</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          <div>
            <h5>Liên hệ</h5>
            {settings.site_address && (
              <div className="vp-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>{settings.site_address}</span>
              </div>
            )}
            {settings.site_phone && (
              <div className="vp-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`} style={{ color: 'inherit' }}>{settings.site_phone}</a>
              </div>
            )}
            {settings.site_email && (
              <div className="vp-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <a href={`mailto:${settings.site_email}`} style={{ color: 'inherit' }}>{settings.site_email}</a>
              </div>
            )}
            {settings.working_hours && (
              <div className="vp-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span>{settings.working_hours}</span>
              </div>
            )}
          </div>
        </div>

        <div className="vp-footer-bottom">
          <p>© {year} {settings.site_name || 'OFFICEHUB'}. Tất cả quyền được bảo lưu.</p>
          <div className="vp-footer-bottom-links">
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản</Link>
            <Link to="/lien-he">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
