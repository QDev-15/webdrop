import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const year = new Date().getFullYear()

  return (
    <footer className="rn-footer">
      <div className="rn-container">
        <div className="rn-footer-grid">
          <div>
            <Link to="/" className="rn-footer-logo">Rao<span>Nhà</span></Link>
            <p className="rn-footer-desc">{settings.footer_description || 'Sàn giao dịch bất động sản trực tuyến — kết nối trực tiếp người mua, người thuê với chính chủ, môi giới tự do và công ty môi giới trên khắp Việt Nam.'}</p>
            <div className="rn-social">
              <a href={settings.social_facebook || '#'} aria-label="Facebook">f</a>
              <a href={settings.social_zalo || '#'} aria-label="Zalo">Z</a>
              <a href={settings.social_youtube || '#'} aria-label="Youtube">▶</a>
            </div>
          </div>
          <div className="rn-footer-col">
            <h4>Khám phá</h4>
            <Link to="/">Trang chủ</Link>
            <Link to="/bat-dong-san?nhu-cau=ban">Nhà đất bán</Link>
            <Link to="/bat-dong-san?nhu-cau=cho-thue">Nhà đất cho thuê</Link>
            <Link to="/dang-tin">Đăng tin</Link>
          </div>
          <div className="rn-footer-col">
            <h4>Về RaoNhà</h4>
            <Link to="/ve-chung-toi">Giới thiệu</Link>
            <Link to="/tin-tuc">Tin tức</Link>
            <Link to="/lien-he">Liên hệ</Link>
          </div>
          <div className="rn-footer-col">
            <h4>Pháp lý</h4>
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
            <p style={{ marginTop: 14, color: '#fff', fontWeight: 700 }}>Hotline: {settings.site_phone || '1900 6789'}</p>
          </div>
        </div>
        <iframe className="rn-footer-maps" src={settings.footer_map_embed || 'https://maps.google.com/maps?q=21.0308,105.7988&hl=vi&z=15&output=embed'} loading="lazy" title="Bản đồ văn phòng RaoNhà"></iframe>
        <div className="rn-footer-bottom">
          <span>{settings.footer_copyright || `© ${year} RaoNhà. Mọi quyền được bảo lưu.`}</span>
          <span>{settings.footer_office || 'Văn phòng đại diện: Cầu Giấy, Hà Nội'}</span>
        </div>
      </div>
    </footer>
  )
}
