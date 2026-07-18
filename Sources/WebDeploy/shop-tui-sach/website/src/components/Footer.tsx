import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings, categories } = useSite()
  const year = new Date().getFullYear()

  return (
    <>
      <footer className="ts-footer">
        <div className="ts-container">
          <div className="ts-footer-grid">
            <div className="ts-footer-brand">
              <Link to="/" className="ts-logo">Maison<span>Cuir</span></Link>
              <p>{settings.footer_desc || settings.site_description}</p>
              <div className="ts-footer-social">
                {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>}
                {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>}
                {settings.tiktok && <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="bi bi-tiktok" /></a>}
              </div>
            </div>

            <div className="ts-footer-col">
              <h3>Danh mục</h3>
              <ul>
                {categories.length > 0 ? categories.map(c => (
                  <li key={c.id}><Link to={`/san-pham?cat=${c.slug}`}>{c.name}</Link></li>
                )) : (
                  <>
                    <li><Link to="/san-pham">Túi xách tay</Link></li>
                    <li><Link to="/san-pham">Túi đeo chéo</Link></li>
                    <li><Link to="/san-pham">Ví &amp; Clutch</Link></li>
                    <li><Link to="/san-pham">Phụ kiện da</Link></li>
                  </>
                )}
              </ul>
            </div>

            <div className="ts-footer-col">
              <h3>Hỗ trợ</h3>
              <ul>
                <li><Link to="/lien-he">Liên hệ</Link></li>
                <li><Link to="/lien-he">Chính sách bảo hành</Link></li>
                <li><Link to="/lien-he">Hướng dẫn bảo quản</Link></li>
                <li><Link to="/lien-he">Vận chuyển &amp; Đổi trả</Link></li>
                <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              </ul>
            </div>

            <div className="ts-footer-col">
              <h3>Liên hệ</h3>
              <ul>
                <li><a href={`tel:${(settings.site_phone || '').replace(/\s/g, '')}`}>{settings.site_phone}</a></li>
                <li><a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></li>
                <li><span>{settings.site_address}</span></li>
              </ul>
            </div>
          </div>

          <div className="ts-footer-bottom">
            <div className="ts-footer-pay">
              <span>Visa</span><span>Mastercard</span><span>Momo</span><span>COD</span>
            </div>
            <div className="ts-footer-copy">© {year} Maison Cuir. Toàn bộ bản quyền được bảo lưu.</div>
          </div>
        </div>
      </footer>

      {settings.zalo_number && (
        <a href={`https://zalo.me/${settings.zalo_number}`} target="_blank" rel="noopener noreferrer" className="ts-zalo-float" aria-label="Chat Zalo với chúng tôi">
          <i className="bi bi-chat-dots-fill" />
        </a>
      )}
    </>
  )
}
