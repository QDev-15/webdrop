import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const zaloNumber = settings.zalo_number || ''

  return (
    <>
      <footer className="am-footer" role="contentinfo">
        <div className="am-container">
          <div className="am-footer-grid">
            <div className="am-footer-brand">
              <span className="am-footer-logo">AMI</span>
              <p>{settings.footer_about || 'Thời trang tối giản, chất liệu chuẩn. Mỗi sản phẩm AMI được chọn lọc kỹ lưỡng để mang lại sự thoải mái và phong cách bền vững.'}</p>
              <div className="am-footer-socials">
                <a href={settings.facebook || '#'} rel="noopener noreferrer" target="_blank">Facebook</a>
                <a href={settings.instagram || '#'} rel="noopener noreferrer" target="_blank">Instagram</a>
                <a href={settings.tiktok || '#'} rel="noopener noreferrer" target="_blank">TikTok</a>
              </div>
            </div>
            <div className="am-footer-col">
              <p className="am-footer-col-title">Mua sắm</p>
              <ul>
                <li><Link to="/san-pham">Tất cả sản phẩm</Link></li>
                {categories.map(c => (
                  <li key={c.id}><Link to={`/san-pham?category=${c.slug}`}>{c.name}</Link></li>
                ))}
                <li><Link to="/san-pham?theme=giam-gia">Đang giảm giá</Link></li>
              </ul>
            </div>
            <div className="am-footer-col">
              <p className="am-footer-col-title">Hỗ trợ</p>
              <ul>
                <li><Link to="/ve-chung-toi">Giới thiệu AMI</Link></li>
                <li><Link to="/lien-he">Liên hệ</Link></li>
                <li><Link to="/lien-he">Hướng dẫn chọn size</Link></li>
                <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              </ul>
            </div>
          </div>
          <div className="am-footer-bottom">
            <p className="am-footer-copy">&copy; {new Date().getFullYear()} {settings.site_name || 'AMI Fashion'}. Tất cả quyền được bảo lưu.</p>
            <div className="am-footer-legal">
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/dieu-khoan">Điều khoản</Link>
            </div>
          </div>
        </div>
      </footer>

      {zaloNumber && (
        <a href={`https://zalo.me/${zaloNumber}`} className="am-zalo-float" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
          <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M24 4C13 4 4 13 4 24c0 5.3 2 10.1 5.3 13.7L7 44l6.6-2.2C16.7 43.5 20.2 44 24 44c11 0 20-9 20-20S35 4 24 4z" /><text x="12" y="30" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="#0068FF">Zalo</text></svg>
        </a>
      )}
    </>
  )
}
