import { useSite } from '../App'

export default function Footer() {
  const { settings } = useSite()

  const siteName    = settings['site_name'] || 'Lặng Trang'
  const description = settings['footer_description'] || 'Không gian cà phê sách yên tĩnh — nơi bạn có thể đọc, làm việc và chậm lại giữa một ngày bận rộn. Mượn sách miễn phí, đồ uống nhẹ nhàng, luôn giữ sự tĩnh lặng cần thiết.'
  const copyright   = settings['footer_copyright'] || '© 2026 Lặng Trang. Tất cả các quyền được bảo lưu.'
  const phone       = settings['site_phone'] || '0912 345 678'
  const email       = settings['site_email'] || 'hello@langtrang.cafe'
  const address     = settings['site_address'] || 'Số nhà, Ngõ nhỏ, Quận Hoàn Kiếm, Hà Nội'
  const hours       = settings['working_hours'] || '7:30 – 21:30 hàng ngày'
  const mapEmbed    = settings['contact_map_embed'] || 'https://maps.google.com/maps?q=21.0285,105.8542&hl=vi&z=15&output=embed'
  const zaloPhone   = (settings['zalo_phone'] || '0912345678').replace(/\s/g, '')

  return (
    <>
      <footer className="csa-footer">
        <div className="csa-container">
          <div className="csa-footer-grid">
            <div>
              <a href="/" className="csa-footer-logo">{siteName}<span>Cà Phê Sách Yên Tĩnh</span></a>
              <p className="csa-footer-desc">{description}</p>
            </div>
            <div className="csa-footer-cols">
              <div className="csa-footer-col">
                <h5>Khám phá</h5>
                <a href="/menu">Thực đơn</a>
                <a href="/khong-gian">Không gian</a>
                <a href="/gioi-thieu">Giới thiệu</a>
                <a href="/lien-he">Liên hệ</a>
              </div>
              <div className="csa-footer-col">
                <h5>Thông tin</h5>
                <span>{phone}</span>
                <span>{email}</span>
                <span>{address}</span>
                <span>{hours}</span>
              </div>
            </div>
          </div>
          <div className="csa-footer-maps">
            <iframe src={mapEmbed} loading="lazy" title="Bản đồ Lặng Trang Cà Phê Sách" allowFullScreen></iframe>
          </div>
          <div className="csa-footer-bottom">
            <span>{copyright}</span>
            <div>
              <a href="/chinh-sach-bao-mat">Chính sách bảo mật</a>
              <a href="/dieu-khoan">Điều khoản sử dụng</a>
            </div>
          </div>
        </div>
      </footer>

      <div className="csa-zalo">
        <span className="csa-zalo-tip">Chat Zalo đặt chỗ</span>
        <a href={`https://zalo.me/${zaloPhone}`} target="_blank" rel="noopener noreferrer" className="csa-zalo-btn" aria-label="Chat Zalo">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/></svg>
        </a>
      </div>
    </>
  )
}
