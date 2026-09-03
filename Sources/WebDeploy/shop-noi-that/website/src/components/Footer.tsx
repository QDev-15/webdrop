import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const phone = settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'
  const email = settings.site_email || '[EMAIL]'
  const address = settings.site_address || '[ĐỊA CHỈ SHOWROOM]'
  const mapUrl = settings.map_embed_url || 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed'

  return (
    <footer className="nt-footer" aria-label="Footer">
      <div className="nt-container">
        <div className="nt-footer-grid">
          <div>
            <div className="nt-footer-logo">MỘC <em>AN</em></div>
            <p className="nt-footer-desc">{settings.footer_about || 'Nội thất tối giản cho không gian sống chậm — chất liệu gỗ tự nhiên, thiết kế bền vững, đồng hành cùng tổ ấm Việt.'}</p>
            <div className="nt-footer-social">
              {settings.facebook && (
                <a href={settings.facebook} aria-label="Facebook" rel="noopener noreferrer" target="_blank">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} aria-label="Instagram" rel="noopener noreferrer" target="_blank">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width="15" height="15"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
              )}
              {settings.pinterest && (
                <a href={settings.pinterest} aria-label="Pinterest" rel="noopener noreferrer" target="_blank">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2a10 10 0 00-3.6 19.3c0-.8 0-1.8.2-2.6l1.4-6s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.4.7 1.4 1.6 0 1-.6 2.4-1 3.8-.2 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5 0-2.1-1.4-3.6-4-3.6-2.9 0-4.7 2.1-4.7 4.5 0 .8.2 1.4.6 1.9.2.2.2.3.1.5l-.2 1c-.1.3-.3.4-.6.2-1.2-.5-1.7-1.9-1.7-3.4 0-2.6 2.2-5.6 6.5-5.6 3.4 0 5.7 2.5 5.7 5.2 0 3.5-1.9 6.2-4.7 6.2-1 0-1.9-.5-2.2-1.1l-.6 2.4c-.2.9-.7 1.9-1.2 2.6a10 10 0 1013.3-14.4A10 10 0 0012 2z" /></svg>
                </a>
              )}
            </div>
          </div>
          <div>
            <h5>Danh mục</h5>
            <ul className="nt-footer-links">
              {categories.length > 0 ? categories.slice(0, 5).map(c => (
                <li key={c.id}><Link to={`/?category=${c.slug}`}>{c.name}</Link></li>
              )) : (
                <>
                  <li><Link to="/?category=sofa">Sofa &amp; ghế bành</Link></li>
                  <li><Link to="/?category=ban">Bàn</Link></li>
                  <li><Link to="/?category=tu-ke">Tủ &amp; kệ</Link></li>
                  <li><Link to="/?category=giuong">Giường ngủ</Link></li>
                  <li><Link to="/?category=den">Đèn trang trí</Link></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h5>Hỗ trợ</h5>
            <ul className="nt-footer-links">
              <li><Link to="/bo-suu-tap">Bộ sưu tập</Link></li>
              <li><Link to="/khuyen-mai">Khuyến mãi</Link></li>
              <li><Link to="/ve-chung-toi">Giới thiệu</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
          <div>
            <h5>Liên hệ</h5>
            <div className="nt-footer-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>{address}</span>
            </div>
            <div className="nt-footer-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
              <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'inherit' }}>{phone}</a>
            </div>
            <div className="nt-footer-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>
            </div>
            <div className="nt-footer-contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <span>{settings.working_hours || 'T2–CN: 8:30–20:00'}</span>
            </div>
          </div>
        </div>

        <iframe className="nt-footer-maps" src={mapUrl} loading="lazy" title="Bản đồ showroom MỘC AN"></iframe>

        <div className="nt-footer-bottom">
          <p>© {new Date().getFullYear()} {settings.site_name || 'MỘC AN'}. Tất cả quyền được bảo lưu.</p>
          <div className="nt-footer-bottom-links">
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản</Link>
            <Link to="/lien-he">Liên hệ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
