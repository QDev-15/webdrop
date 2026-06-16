import { useSite } from '../App'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name || 'La Maison'
  const copyright = settings.footer_copyright || `© ${new Date().getFullYear()} La Maison. Bảo lưu mọi quyền.`
  const footerDesc = settings.footer_description || 'Trải nghiệm ẩm thực Pháp đỉnh cao tại trung tâm Hà Nội.'

  return (
    <footer>
      <div className="wd-container" style={{ padding: 'clamp(48px, 7vw, 80px) clamp(20px, 5vw, 80px)' }}>
        <div className="row g-5">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="ft-logo">{siteName} <em>Fine Dining</em></div>
            <p className="ft-desc">{footerDesc}</p>
            <div className="ft-socials">
              {settings.social_facebook && (
                <a href={settings.social_facebook} className="ft-soc" target="_blank" rel="noopener noreferrer" title="Facebook">f</a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} className="ft-soc" target="_blank" rel="noopener noreferrer" title="Instagram">IG</a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} className="ft-soc" target="_blank" rel="noopener noreferrer" title="YouTube">YT</a>
              )}
              {settings.social_tiktok && (
                <a href={settings.social_tiktok} className="ft-soc" target="_blank" rel="noopener noreferrer" title="TikTok">TK</a>
              )}
            </div>
          </div>

          {/* Nav */}
          <div className="col-lg-2 col-md-6 col-6">
            <div className="ft-col-title">Điều hướng</div>
            <div className="ft-links">
              <a href="#trang-chu">Trang chủ</a>
              <a href="#gioi-thieu">Giới thiệu</a>
              <a href="#thuc-don">Thực đơn</a>
              <a href="#thu-vien">Thư viện</a>
              <a href="#dat-ban">Đặt bàn</a>
              <a href="#lien-he">Liên hệ</a>
            </div>
          </div>

          {/* Thực đơn */}
          <div className="col-lg-2 col-md-6 col-6">
            <div className="ft-col-title">Thực đơn</div>
            <div className="ft-links">
              <a href="#thuc-don">Menu Tasting 5 món</a>
              <a href="#thuc-don">Menu Tasting 8 món</a>
              <a href="#thuc-don">Omakase</a>
              <a href="#thuc-don">À la carte</a>
              <a href="#thuc-don">Wine Pairing</a>
            </div>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <div className="ft-col-title">Liên hệ</div>
            <div className="ft-links">
              {settings.site_address && <a href={`https://maps.google.com/?q=${encodeURIComponent(settings.site_address)}`} target="_blank" rel="noopener noreferrer">{settings.site_address}</a>}
              {settings.site_phone && <a href={`tel:${settings.site_phone}`}>{settings.site_phone}</a>}
              {settings.site_phone_2 && <a href={`tel:${settings.site_phone_2}`}>{settings.site_phone_2}</a>}
              {settings.site_email && <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a>}
              {settings.working_hours && <span>{settings.working_hours}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="ft-bottom">
        <div className="wd-container" style={{ padding: '16px clamp(20px, 5vw, 80px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div className="ft-copy">{copyright}</div>
          <div className="ft-copy">
            <a href="#trang-chu" style={{ color: 'inherit', opacity: .6 }}>Về đầu trang ↑</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
