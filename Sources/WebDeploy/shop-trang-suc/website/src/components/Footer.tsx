import { Link } from 'react-router-dom'
import { useSite, type Category } from '../contexts/SiteContext'

const FALLBACK_CATEGORIES: Category[] = [
  { id: 0, name: 'Nhẫn', slug: 'nhan', image: '', product_count: 0 },
  { id: 0, name: 'Dây chuyền', slug: 'day-chuyen', image: '', product_count: 0 },
  { id: 0, name: 'Bông tai', slug: 'bong-tai', image: '', product_count: 0 },
  { id: 0, name: 'Lắc tay', slug: 'lac-tay', image: '', product_count: 0 },
  { id: 0, name: 'Bộ trang sức', slug: 'bo-trang-suc', image: '', product_count: 0 },
]

export default function Footer() {
  const { settings, categories } = useSite()
  const mapUrl = settings.map_embed_url || 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed'
  const cats = categories.length > 0 ? categories : FALLBACK_CATEGORIES
  const zaloNumber = settings.zalo_number || '0901234567'

  return (
    <>
      <footer className="tr-footer" aria-label="Footer">
        <div className="tr-container">
          <div className="tr-footer-top">
            <div>
              <div className="tr-footer-brand">
                <span className="tr-logo-mark">V</span>
                <span className="tr-logo-text">VIOLETTE</span>
              </div>
              <p className="tr-footer-desc">{settings.footer_about || 'Trang sức bạc 925, vàng 18K/24K và đá quý tự nhiên — chế tác tỉ mỉ, kiểm định rõ ràng, bảo hành trọn đời.'}</p>
              <div className="tr-footer-social">
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                  </a>
                )}
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width="15" height="15"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  </a>
                )}
              </div>
            </div>
            <div>
              <h5>Sản phẩm</h5>
              <ul className="tr-footer-links">
                {cats.map(c => <li key={c.slug}><Link to={`/san-pham?category=${c.slug}`}>{c.name}</Link></li>)}
              </ul>
            </div>
            <div>
              <h5>Hỗ trợ</h5>
              <ul className="tr-footer-links">
                <li><Link to="/bo-suu-tap">Bộ sưu tập</Link></li>
                <li><Link to="/ve-chung-toi">Giới thiệu</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
                <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
            <div>
              <h5>Liên hệ</h5>
              <div className="tr-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>{settings.site_address || '25 Đồng Khởi, Quận 1, TP. Hồ Chí Minh'}</span>
              </div>
              <div className="tr-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 1h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z" /></svg>
                <a href={`tel:${(settings.site_phone || '19002726').replace(/\s/g, '')}`}>{settings.site_phone || '1900 2726'}</a>
              </div>
              <div className="tr-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <a href={`mailto:${settings.site_email || 'hello@violette.vn'}`}>{settings.site_email || 'hello@violette.vn'}</a>
              </div>
              <div className="tr-footer-contact-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span>{settings.working_hours || 'Thứ 2 – Chủ nhật: 9:00 – 20:00'}</span>
              </div>
            </div>
          </div>

          <div className="tr-footer-maps">
            <iframe src={mapUrl} loading="lazy" title="Bản đồ cửa hàng VIOLETTE"></iframe>
          </div>

          <div className="tr-footer-bottom">
            <p>© {new Date().getFullYear()} {settings.site_name || 'VIOLETTE'} Fine Jewelry. Tất cả quyền được bảo lưu.</p>
            <div className="tr-footer-bottom-links">
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/dieu-khoan">Điều khoản</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
        </div>
      </footer>

      <div className="tr-zalo-float">
        <a href={`https://zalo.me/${zaloNumber}`} target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
          <svg viewBox="0 0 48 48" width="26" height="26"><text x="50%" y="60%" fontSize="26" fill="#fff" textAnchor="middle" fontFamily="sans-serif" fontWeight="700">Z</text></svg>
        </a>
      </div>
    </>
  )
}
