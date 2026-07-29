import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="dg-footer">
      <div className="dg-container">
        <div className="dg-footer-content">
          {/* Brand */}
          <div className="dg-footer-section">
            <h3>{settings.site_name || 'Shop Đồ Gia Dụng'}</h3>
            <p className="dg-footer-desc">
              {settings.site_description || 'Cửa hàng đồ gia dụng chất lượng cao, mang lại sự thoải mái cho ngôi nhà của bạn.'}
            </p>
            <div className="dg-footer-socials">
              <a href="#facebook" target="_blank" rel="noopener noreferrer">f</a>
              <a href="#instagram" target="_blank" rel="noopener noreferrer">📷</a>
              <a href="#youtube" target="_blank" rel="noopener noreferrer">▶</a>
            </div>
          </div>

          {/* Sản phẩm */}
          <div className="dg-footer-section">
            <h4>Sản phẩm</h4>
            <ul>
              <li><Link to="/san-pham?category=nha-bep">Nhà bếp</Link></li>
              <li><Link to="/san-pham?category=trang-tri">Trang trí</Link></li>
              <li><Link to="/san-pham?category=phong-tam">Phòng tắm</Link></li>
              <li><Link to="/san-pham?category=noi-that-nho">Nội thất nhỏ</Link></li>
              <li><Link to="/san-pham?category=den-chieu-sang">Đèn & Ánh sáng</Link></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div className="dg-footer-section">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản</Link></li>
              <li><a href="#return-policy">Chính sách hoàn trả</a></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="dg-footer-section">
            <h4>Liên hệ</h4>
            <p>
              <strong>Địa chỉ:</strong><br />
              {settings.site_address || '[ĐỊA CHỈ]'}
            </p>
            <p>
              <strong>Điện thoại:</strong><br />
              <a href={`tel:${settings.site_phone}`}>{settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'}</a>
            </p>
            <p>
              <strong>Email:</strong><br />
              <a href={`mailto:${settings.site_email}`}>{settings.site_email || '[EMAIL]'}</a>
            </p>
            <p>
              <strong>Giờ làm việc:</strong><br />
              {settings.working_hours || '[GIỜ LÀM VIỆC]'}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="dg-footer-bottom">
          <p>&copy; {currentYear} {settings.site_name || 'Shop Đồ Gia Dụng'}. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  )
}
