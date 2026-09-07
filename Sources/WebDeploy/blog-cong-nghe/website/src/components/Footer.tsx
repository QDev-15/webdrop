import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const brandName = settings.site_name || 'PIXEL.'

  return (
    <footer className="bcn-footer">
      <div className="bcn-container">
        <div className="bcn-footer-grid">
          <div>
            <Link to="/" className="bcn-footer-logo"><span className="bcn-logo-mark"></span>{brandName}</Link>
            <p className="bcn-footer-desc">{settings.footer_description || ''}</p>
            <div className="bcn-footer-social">
              <a href={settings.facebook || '#'} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
              <a href={settings.twitter_x || '#'} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><i className="bi bi-twitter-x"></i></a>
              <a href={settings.youtube || '#'} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
              <a href={settings.tiktok || '#'} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="bi bi-tiktok"></i></a>
            </div>
          </div>
          <div>
            <div className="bcn-footer-title">Chuyên mục</div>
            <div className="bcn-footer-links">
              <Link to="/chuyen-muc?cat=tin-tuc">Tin tức công nghệ</Link>
              <Link to="/danh-gia-san-pham">Đánh giá sản phẩm</Link>
              <Link to="/chuyen-muc?cat=thu-thuat">Thủ thuật &amp; Mẹo</Link>
              <Link to="/chuyen-muc?cat=ai-xu-huong">AI &amp; Xu hướng</Link>
              <Link to="/chuyen-muc?cat=bao-mat">Bảo mật</Link>
            </div>
          </div>
          <div>
            <div className="bcn-footer-title">Về {brandName}</div>
            <div className="bcn-footer-links">
              <Link to="/ve-toi">Về tôi</Link>
              <Link to="/chuyen-muc">Chuyên mục</Link>
              <Link to="/danh-gia-san-pham">Đánh giá sản phẩm</Link>
              <Link to="/lien-he">Liên hệ</Link>
            </div>
          </div>
          <div>
            <div className="bcn-footer-title">Pháp lý</div>
            <div className="bcn-footer-links">
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
              <Link to="/lien-he">Hợp tác quảng cáo</Link>
            </div>
          </div>
        </div>

        {settings.map_embed && (
          <div className="bcn-footer-maps">
            <iframe src={settings.map_embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Vị trí văn phòng ${brandName} trên Google Maps`} />
          </div>
        )}

        <div className="bcn-footer-bottom">
          <div>{settings.footer_copyright || ''}</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
