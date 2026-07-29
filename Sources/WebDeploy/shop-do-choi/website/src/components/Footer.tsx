import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings['site_name'] || 'KidZone'
  const sitePhone = settings['site_phone'] || '[0901234567]'
  const siteEmail = settings['site_email'] || '[email@example.com]'
  const siteAddress = settings['site_address'] || '[Địa chỉ]'

  return (
    <footer className="dc-footer">
      <div className="dc-container">
        <div className="dc-footer-cols">
          <div className="dc-footer-col">
            <h4>Về {siteName}</h4>
            <p>{siteName} — Shop đồ chơi trẻ em an toàn, chất lượng cao, được kiểm định chặt chẽ. Chúng tôi cam kết mang đến niềm vui cho các bé yêu.</p>
            <div className="dc-footer-socials">
              {settings['social_facebook'] && <a href={settings['social_facebook']} target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>}
              {settings['social_instagram'] && <a href={settings['social_instagram']} target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>}
              {settings['social_tiktok'] && <a href={settings['social_tiktok']} target="_blank" rel="noopener noreferrer" aria-label="TikTok">♪</a>}
            </div>
          </div>
          <div className="dc-footer-col">
            <h4>Danh mục</h4>
            <ul>
              <li><a href="#" onClick={e => { e.preventDefault(); window.location.href = '/san-pham?category=do-choi-giao-duc' }}>Đồ chơi giáo dục</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); window.location.href = '/san-pham?category=lego-xep-hinh' }}>Lego & Xếp hình</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); window.location.href = '/san-pham?category=xe-mo-hinh' }}>Xe & Mô hình</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); window.location.href = '/san-pham?category=bup-be-thu-bong' }}>Búp bê & Thú bông</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); window.location.href = '/san-pham?category=do-choi-ngoai-troi' }}>Đồ chơi ngoài trời</a></li>
            </ul>
          </div>
          <div className="dc-footer-col">
            <h4>Chính sách</h4>
            <ul>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
              <li><a href="#" onClick={e => { e.preventDefault(); window.location.href = '/ve-chung-toi' }}>Về chúng tôi</a></li>
              <li><a href="mailto:info@example.com">Liên hệ hợp tác</a></li>
            </ul>
          </div>
          <div className="dc-footer-col">
            <h4>Liên hệ</h4>
            <p><strong>Địa chỉ:</strong> {siteAddress}</p>
            <p><strong>Điện thoại:</strong> <a href={`tel:${sitePhone}`}>{sitePhone}</a></p>
            <p><strong>Email:</strong> <a href={`mailto:${siteEmail}`}>{siteEmail}</a></p>
            <p className="dc-footer-hours"><strong>Giờ làm việc:</strong> {settings['working_hours'] || 'Thứ 2–7: 9h–20h; CN: 10h–18h'}</p>
          </div>
        </div>
        <div className="dc-footer-bottom">
          <p>&copy; 2024 {siteName}. Tất cả quyền được bảo lưu.</p>
          <p>Powered by <a href="https://webdrop.store" target="_blank" rel="noopener noreferrer">webdrop.store</a></p>
        </div>
      </div>
    </footer>
  )
}
