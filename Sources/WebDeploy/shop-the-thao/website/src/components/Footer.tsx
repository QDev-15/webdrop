import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  return (
    <footer className="tt-footer">
      <div className="tt-container">
        <div className="tt-footer-grid">
          <div className="tt-footer-col">
            <div className="tt-footer-logo">SPORT<span>THE THAO</span></div>
            <p className="tt-footer-desc">Chuyên cung cấp đồ thể thao & gym chính hãng. Tất cả sản phẩm có bảo hành, đổi size miễn phí trong 30 ngày.</p>
            <div className="tt-footer-social">
              {settings.facebook && <a href={settings.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>}
              {settings.instagram && <a href={settings.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer">ig</a>}
              <a href={`https://zalo.me/${settings.site_phone || '[ZALO_NUMBER]'}`} aria-label="Zalo" target="_blank" rel="noopener noreferrer">z</a>
            </div>
          </div>
          <div className="tt-footer-col">
            <h4>Danh mục</h4>
            <ul>
              <li><Link to="/?category=quan-ao">Quần áo thể thao</Link></li>
              <li><Link to="/?category=giay">Giày chạy bộ & gym</Link></li>
              <li><Link to="/?category=dung-cu">Dụng cụ tập gym</Link></li>
              <li><Link to="/?category=phu-kien">Phụ kiện thể thao</Link></li>
              <li><Link to="/?category=yoga">Yoga & Pilates</Link></li>
            </ul>
          </div>
          <div className="tt-footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="/dich-vu">Dịch vụ</Link></li>
              <li><Link to="/bo-suu-tap">Bộ sưu tập</Link></li>
              <li><Link to="/khuyen-mai">Khuyến mãi</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div className="tt-footer-col">
            <h4>Liên hệ</h4>
            <div className="tt-footer-contact-items">
              <p>📍 {settings.site_address || '[ĐỊA CHỈ CỬA HÀNG]'}</p>
              <p>📞 <a href={`tel:${settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'}`} style={{ color: 'inherit' }}>{settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'}</a></p>
              <p>✉️ <a href={`mailto:${settings.site_email || '[EMAIL@SPORTTHETAO.VN]'}`} style={{ color: 'inherit' }}>{settings.site_email || '[EMAIL@SPORTTHETAO.VN]'}</a></p>
              <p>🕐 {settings.working_hours || 'T2–T7: 8:00–21:00 | CN: 9:00–18:00'}</p>
            </div>
          </div>
        </div>
        <div className="tt-footer-bottom">
          <p>© {new Date().getFullYear()} {settings.site_name || '[TÊN SHOP]'}. Tất cả quyền được bảo lưu.</p>
          <div className="tt-footer-bottom-links">
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản</Link>
          </div>
        </div>
      </div>

      {/* Zalo float button */}
      <a href={`https://zalo.me/${settings.site_phone || '[ZALO_NUMBER]'}`} className="tt-zalo-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.18 1.88 5.81L2.5 21.5l3.8-1.35A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a7.95 7.95 0 01-4.13-1.15l-.29-.18-3.04 1.08 1.09-2.97-.2-.31A8 8 0 1112 20zm4.51-5.95c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.1-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41-.14 0-.3-.01-.46-.01s-.42.06-.64.3c-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.5.57.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z"/></svg>
      </a>
    </footer>
  )
}
