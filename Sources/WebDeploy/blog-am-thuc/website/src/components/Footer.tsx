import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Bếp Xanh'
  const lastSpace = siteName.lastIndexOf(' ')
  const logoMain = lastSpace === -1 ? siteName : siteName.slice(0, lastSpace + 1)
  const logoAccent = lastSpace === -1 ? '' : siteName.slice(lastSpace + 1)
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="bam-footer-top bam-container">
        <div className="bam-footer-grid">
          <div>
            <div className="bam-footer-logo">🥗 {logoMain}<span style={{ color: 'var(--accent)' }}>{logoAccent}</span></div>
            <p className="bam-footer-desc">{settings.footer_description || settings.site_description}</p>
            <div className="bam-footer-social">
              <a href={settings.social_facebook || '#'} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a href={settings.social_instagram || '#'} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a href={settings.social_youtube || '#'} target="_blank" rel="noopener noreferrer" aria-label="Youtube"><i className="bi bi-youtube" /></a>
              <a href={settings.social_pinterest || '#'} target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><i className="bi bi-pinterest" /></a>
            </div>
          </div>
          <div>
            <div className="bam-footer-col-title">Khám phá</div>
            <div className="bam-footer-links">
              <Link to="/chuyen-muc?tab=mon-chinh">Món chính</Link>
              <Link to="/chuyen-muc?tab=trang-mieng">Tráng miệng</Link>
              <Link to="/chuyen-muc?tab=do-uong">Đồ uống</Link>
              <Link to="/chuyen-muc?tab=review">Review quán ăn</Link>
            </div>
          </div>
          <div>
            <div className="bam-footer-col-title">Về {logoAccent || logoMain}</div>
            <div className="bam-footer-links">
              <Link to="/ve-toi">Câu chuyện của tôi</Link>
              <Link to="/cong-thuc-nau-an">Công thức nấu ăn</Link>
              <Link to="/lien-he">Liên hệ hợp tác</Link>
              <Link to="/#faq">Câu hỏi thường gặp</Link>
            </div>
          </div>
          <div>
            <div className="bam-footer-col-title">Pháp lý</div>
            <div className="bam-footer-links">
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
            </div>
          </div>
        </div>
        {settings.map_embed_url && (
          <div className="bam-footer-maps">
            <iframe src={settings.map_embed_url} loading="lazy" title={`Bản đồ vị trí ${siteName}`} />
          </div>
        )}
      </div>
      <div className="bam-container bam-footer-bottom">
        <div className="bam-footer-copy">{(settings.footer_copyright || `© ${year} ${siteName}. Mọi quyền được bảo lưu.`)}</div>
        <div className="bam-footer-legal">
          <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
          <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
        </div>
      </div>

      {settings.zalo_number && (
        <a href={`https://zalo.me/${settings.zalo_number}`} className="bam-zf" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
          <span className="bam-zf-tip">Chat Zalo</span>
          <span className="bam-zf-btn">💬</span>
        </a>
      )}
    </footer>
  )
}
