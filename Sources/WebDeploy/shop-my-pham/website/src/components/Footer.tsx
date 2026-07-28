import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const zaloNumber = settings.zalo_number || ''

  return (
    <>
      <footer id="mp-footer" role="contentinfo">
        <div className="wd-container">
          <div className="mp-footer-grid">
            <div className="mp-footer-brand">
              <Link to="/" className="mp-footer-logo" aria-label="LUMIÈRE Beauty"><em>L</em>UMIÈRE</Link>
              <p className="mp-footer-tagline">{settings.footer_about || 'Mỹ phẩm cao cấp, thành phần an toàn. Vẻ đẹp đích thực từ thiên nhiên.'}</p>
              <div className="mp-footer-social" aria-label="Mạng xã hội">
                <a href={settings.facebook || '#'} aria-label="Facebook LUMIÈRE" rel="noopener noreferrer" target="_blank">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href={settings.instagram || '#'} aria-label="Instagram LUMIÈRE" rel="noopener noreferrer" target="_blank">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
                <a href={settings.youtube || '#'} aria-label="YouTube LUMIÈRE" rel="noopener noreferrer" target="_blank">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
                </a>
                <a href={settings.tiktok || '#'} aria-label="TikTok LUMIÈRE" rel="noopener noreferrer" target="_blank">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.88a8.16 8.16 0 0 0 4.77 1.53V6.96a4.85 4.85 0 0 1-1-.27z" /></svg>
                </a>
              </div>
            </div>
            <div className="mp-footer-col">
              <h4>Danh mục</h4>
              <ul>
                {categories.map(c => (
                  <li key={c.id}><Link to={`/san-pham?category=${c.slug}`}>{c.name}</Link></li>
                ))}
              </ul>
            </div>
            <div className="mp-footer-col">
              <h4>Hỗ trợ</h4>
              <ul>
                <li><Link to="/ve-chung-toi">Giới thiệu</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
                <li><Link to="/lien-he#doi-tra">Chính sách đổi trả</Link></li>
                <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
          </div>
          <div className="mp-footer-bottom">
            <span>&copy; {new Date().getFullYear()} {settings.site_name || 'LUMIÈRE Beauty'}. Bảo lưu mọi quyền.</span>
            <div className="mp-footer-legal">
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/dieu-khoan">Điều khoản</Link>
            </div>
          </div>
        </div>
      </footer>

      {zaloNumber && (
        <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer" className="mp-zalo-float" aria-label="Liên hệ qua Zalo">
          <svg viewBox="0 0 50 50" fill="white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true"><text x="6" y="34" fontSize="28" fontWeight="bold" fontFamily="Arial,sans-serif">Z</text></svg>
        </a>
      )}
    </>
  )
}
