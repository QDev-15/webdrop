import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const s = settings

  return (
    <footer className="xd-footer" role="contentinfo">
      <div className="wd-container">
        <div className="row g-5">
          <div className="col-12 col-md-4">
            <div className="xd-footer-brand">
              <Link to="/" className="xd-logo" style={{ color: '#fff', marginBottom: 16, display: 'inline-flex' }}>
                <div className="xd-logo-mark">
                  <svg viewBox="0 0 24 24"><path d="M3 21V9l9-6 9 6v12H3zM9 21V12h6v9"/></svg>
                </div>
                {(s['site_name'] || 'CÔNG TY').split(' ').slice(0, -1).join(' ')} <span style={{ color: 'var(--accent)' }}>{(s['site_name'] || 'XÂY DỰNG').split(' ').slice(-1)}</span>
              </Link>
            </div>
            <p className="xd-footer-desc">{s['footer_description'] || s['site_description']}</p>
            <div className="xd-footer-social">
              {s['social_facebook'] && <a href={s['social_facebook']} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>}
              {s['social_youtube'] && <a href={s['social_youtube']} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.53C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg></a>}
              {s['social_linkedin'] && <a href={s['social_linkedin']} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></a>}
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h3 className="xd-footer-heading">Dịch vụ</h3>
            <ul className="xd-footer-links">
              <li><Link to="/dich-vu">Thi công dân dụng</Link></li>
              <li><Link to="/dich-vu">Thi công công nghiệp</Link></li>
              <li><Link to="/dich-vu">Thiết kế kiến trúc</Link></li>
              <li><Link to="/dich-vu">Tư vấn dự án</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h3 className="xd-footer-heading">Công ty</h3>
            <ul className="xd-footer-links">
              <li><Link to="/">Về chúng tôi</Link></li>
              <li><Link to="/du-an">Dự án</Link></li>
              <li><Link to="/lien-he">Tuyển dụng</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h3 className="xd-footer-heading">Liên hệ</h3>
            <ul className="xd-footer-links">
              {s['site_phone'] && <li><a href={`tel:${s['site_phone'].replace(/\s/g, '')}`}>{s['site_phone']}</a></li>}
              {s['site_email'] && <li><a href={`mailto:${s['site_email']}`}>{s['site_email']}</a></li>}
              {s['site_address'] && <li style={{ color: 'rgba(255,255,255,.35)', fontSize: 14, lineHeight: 1.6 }}>{s['site_address']}</li>}
            </ul>
            <div style={{ marginTop: 16 }}>
              <Link to="/lien-he" className="xd-btn-solid" style={{ fontSize: 11, padding: '10px 20px' }}>Báo giá miễn phí</Link>
            </div>
          </div>
        </div>

        <hr className="xd-footer-divider" />
        <div className="xd-footer-bottom">
          <p className="xd-footer-copy">{s['footer_copyright'] || `© ${new Date().getFullYear()} ${s['site_name'] || 'Công Ty Xây Dựng'}. Tất cả quyền được bảo lưu.`}</p>
          <div className="xd-footer-legal">
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
