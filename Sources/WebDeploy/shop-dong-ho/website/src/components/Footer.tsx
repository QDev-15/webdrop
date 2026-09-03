import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const phone = settings.site_phone || '[SỐ_ĐIỆN_THOẠI]'
  const email = settings.site_email || '[EMAIL]'
  const address = settings.site_address || '[ĐỊA CHỈ SHOWROOM]'
  const mapUrl = settings.map_embed_url || 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed'

  return (
    <footer id="dh-footer">
      <div className="dh-container">
        <div className="dh-footer-top">
          <div className="dh-footer-brand">
            <div className="dh-logo"><span className="dh-logo-mark">M</span>MERIDIAN</div>
            <p>{settings.footer_about || 'Đồng hồ chính hãng đa thương hiệu — cam kết nguồn gốc rõ ràng, bảo hành đầy đủ, giao hàng toàn quốc.'}</p>
            <div className="dh-footer-social">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9H16l-.4 2.9h-2.1v7A10 10 0 0022 12z" /></svg>
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22.5 6.5s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.4 3 12 3 12 3s-4.4 0-7.3.2c-.4 0-1.4.1-2.3 1-.7.7-.9 2.3-.9 2.3S1.3 8.4 1.3 10.3v1.4c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.1.2 7.1.2s4.4 0 7.3-.2c.4 0 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.4c0-1.9-.2-3.8-.2-3.8z" /><path d="M9.8 14.5l5.9-3.2-5.9-3.2z" fill="currentColor" /></svg>
                </a>
              )}
            </div>
          </div>
          <div className="dh-footer-col">
            <h5>Khám phá</h5>
            <Link to="/san-pham">Sản phẩm</Link>
            <Link to="/bo-suu-tap">Bộ sưu tập</Link>
            <Link to="/ve-chung-toi">Giới thiệu</Link>
            <Link to="/lien-he">Liên hệ</Link>
          </div>
          <div className="dh-footer-col">
            <h5>Hỗ trợ</h5>
            <Link to="/lien-he">Liên hệ</Link>
            <Link to="/gio-hang">Giỏ hàng</Link>
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
          </div>
          <div className="dh-footer-col">
            <h5>Liên hệ</h5>
            <a href={`tel:${phone.replace(/\s/g, '')}`}>Hotline: {phone}</a>
            <a href={`mailto:${email}`}>{email}</a>
            <Link to="/lien-he">{address}</Link>
          </div>
        </div>
        <div className="dh-footer-maps"><iframe src={mapUrl} loading="lazy" title="Bản đồ cửa hàng MERIDIAN"></iframe></div>
        <div className="dh-footer-bottom">
          <span>© {new Date().getFullYear()} {settings.site_name || 'MERIDIAN'}. Toàn bộ nội dung là dữ liệu demo cho mục đích minh họa template.</span>
          <span>
            <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
