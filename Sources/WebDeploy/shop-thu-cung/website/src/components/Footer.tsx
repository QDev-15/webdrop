import { Link } from 'react-router-dom'
import { useSite, type Category } from '../contexts/SiteContext'

const FALLBACK_CATEGORIES: Category[] = [
  { id: 0, name: 'Thức ăn', slug: 'thuc-an', image: '', product_count: 0 },
  { id: 0, name: 'Phụ kiện', slug: 'phu-kien', image: '', product_count: 0 },
  { id: 0, name: 'Đồ chơi', slug: 'do-choi', image: '', product_count: 0 },
  { id: 0, name: 'Chuồng & Nhà ở', slug: 'chuong-nha', image: '', product_count: 0 },
  { id: 0, name: 'Chăm sóc & Vệ sinh', slug: 'cham-soc', image: '', product_count: 0 },
]

export default function Footer() {
  const { settings, categories } = useSite()
  const mapUrl = settings.map_embed_url || 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed'
  const cats = categories.length > 0 ? categories : FALLBACK_CATEGORIES
  const zaloNumber = settings.zalo_number || '0900000000'

  return (
    <>
      <footer className="tc-footer">
        <div className="tc-container">
          <div className="tc-footer-grid">
            <div className="tc-footer-col">
              <div className="tc-footer-logo"><span className="tc-logo-dot"></span>PET<span style={{ color: 'var(--accent-mid)' }}>HAUS</span></div>
              <p className="tc-footer-desc">{settings.footer_about || 'Cửa hàng thú cưng chính hãng — thức ăn, phụ kiện, đồ chơi, chuồng nhà & chăm sóc cho chó mèo. Nguồn gốc rõ ràng, kiểm định trước khi bán.'}</p>
              <div className="tc-footer-social">
                {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>}
                {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>}
                <a href={`https://zalo.me/${zaloNumber}`} aria-label="Zalo" target="_blank" rel="noopener noreferrer">z</a>
              </div>
            </div>
            <div className="tc-footer-col">
              <h4>Danh mục</h4>
              <ul>
                {cats.map(c => <li key={c.slug}><Link to={`/?category=${c.slug}`}>{c.name}</Link></li>)}
              </ul>
            </div>
            <div className="tc-footer-col">
              <h4>Hỗ trợ</h4>
              <ul>
                <li><Link to="/bo-suu-tap">Bộ sưu tập</Link></li>
                <li><Link to="/khuyen-mai">Khuyến mãi</Link></li>
                <li><Link to="/ve-chung-toi">Giới thiệu</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
                <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
            <div className="tc-footer-col">
              <h4>Liên hệ</h4>
              <div className="tc-footer-contact-items">
                <p>📍 {settings.site_address || '52 Nguyễn Văn Trỗi, Phường 15, Quận Phú Nhuận, TP. Hồ Chí Minh'}</p>
                <p>📞 <a href={`tel:${settings.site_phone || ''}`} style={{ color: 'inherit' }}>{settings.site_phone || '1900 636 963'}</a></p>
                <p>✉️ <a href={`mailto:${settings.site_email || ''}`} style={{ color: 'inherit' }}>{settings.site_email || 'hello@pethaus.vn'}</a></p>
                <p>🕐 {settings.working_hours || 'T2–CN: 8:00–20:00'}</p>
              </div>
            </div>
          </div>
          <div className="tc-footer-maps">
            <iframe src={mapUrl} loading="lazy" title="Bản đồ cửa hàng Pet Haus"></iframe>
          </div>
          <div className="tc-footer-bottom">
            <p>© {new Date().getFullYear()} {settings.site_name || 'Pet Haus'}. Tất cả quyền được bảo lưu.</p>
            <div className="tc-footer-bottom-links">
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/dieu-khoan">Điều khoản</Link>
            </div>
          </div>
        </div>
      </footer>

      <a href={`https://zalo.me/${zaloNumber}`} className="tc-zalo-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.18 1.88 5.81L2.5 21.5l3.8-1.35A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a7.95 7.95 0 01-4.13-1.15l-.29-.18-3.04 1.08 1.09-2.97-.2-.31A8 8 0 1112 20zm4.51-5.95c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.1-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41-.14 0-.3-.01-.46-.01s-.42.06-.64.3c-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.5.57.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z" /></svg>
      </a>
    </>
  )
}
