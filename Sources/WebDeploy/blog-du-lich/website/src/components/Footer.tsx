import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Xê Dịch'
  const brandShort = siteName.split(' ')[0] || 'Xê Dịch'

  return (
    <footer className="bdl-footer">
      <div className="bdl-container">
        <div className="bdl-footer-main">
          <div>
            <Link to="/" className="bdl-footer-logo"><span className="bdl-logo-mark">✈</span><span>{brandShort}</span></Link>
            <p className="bdl-footer-tagline">{settings.footer_description}</p>
            <div className="bdl-footer-social">
              {settings.facebook && <a href={settings.facebook} className="bdl-social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>}
              {settings.instagram && <a href={settings.instagram} className="bdl-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">ig</a>}
              {settings.youtube && <a href={settings.youtube} className="bdl-social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">▶</a>}
            </div>
          </div>
          <div>
            <div className="bdl-footer-col-title">Chuyên mục</div>
            <ul className="bdl-footer-links">
              <li><Link to="/chuyen-muc?cat=trong-nuoc">Điểm đến trong nước</Link></li>
              <li><Link to="/chuyen-muc?cat=quoc-te">Điểm đến quốc tế</Link></li>
              <li><Link to="/chuyen-muc?cat=meo-du-lich">Mẹo du lịch</Link></li>
              <li><Link to="/chuyen-muc?cat=review-luu-tru">Review lưu trú</Link></li>
            </ul>
          </div>
          <div>
            <div className="bdl-footer-col-title">Về blog</div>
            <ul className="bdl-footer-links">
              <li><Link to="/ve-toi">Về tôi</Link></li>
              <li><Link to="/cam-nang-du-lich">Cẩm nang du lịch</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
          <div>
            <div className="bdl-footer-col-title">Nhận bản tin</div>
            <p className="bdl-footer-tagline" style={{ marginBottom: 14 }}>{settings.footer_newsletter_text}</p>
            <NewsletterForm variant="footer" />
          </div>
        </div>
        {settings.map_embed && (
          <div className="bdl-footer-maps">
            <iframe src={settings.map_embed} loading="lazy" title="Bản đồ văn phòng đại diện" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
        <div className="bdl-footer-bottom">
          <span>{settings.footer_copyright}</span>
          <span><Link to="/chinh-sach-bao-mat">Bảo mật</Link> · <Link to="/dieu-khoan">Điều khoản</Link></span>
        </div>
      </div>
    </footer>
  )
}
