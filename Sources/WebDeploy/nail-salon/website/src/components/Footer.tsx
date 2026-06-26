import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const s = (k: string, fb = '') => settings[k] || fb
  const year = new Date().getFullYear()

  return (
    <>
      <footer className="ns-footer">
        <div className="wd-container">
          <div className="ns-ft-inner">
            <div className="row">
              <div className="col-lg-4 mb-4 mb-lg-0">
                <Link to="/" className="ns-ft-logo">
                  {s('site_name', 'Nail Salon').split(' ').slice(0, -1).join(' ')} <strong>{s('site_name', 'Nail Salon').split(' ').slice(-1)[0]}</strong>
                </Link>
                <p className="ns-ft-desc">{s('footer_desc', 'Chăm sóc móng tay & chân chuyên nghiệp. Vẻ đẹp từng chi tiết.')}</p>
                <div className="ns-ft-socials">
                  {s('facebook') && <a href={s('facebook')} target="_blank" rel="noopener noreferrer" className="ns-ft-soc">f</a>}
                  {s('instagram') && <a href={s('instagram')} target="_blank" rel="noopener noreferrer" className="ns-ft-soc">in</a>}
                  {s('tiktok') && <a href={s('tiktok')} target="_blank" rel="noopener noreferrer" className="ns-ft-soc">tt</a>}
                </div>
              </div>

              <div className="col-6 col-lg-2 mb-4 mb-lg-0">
                <div className="ns-ft-col-title">Dịch vụ</div>
                <div className="ns-ft-links">
                  <Link to="/dich-vu">Nail Gel</Link>
                  <Link to="/dich-vu">Nail Art</Link>
                  <Link to="/dich-vu">Pedicure</Link>
                  <Link to="/dich-vu">Nail Dưỡng</Link>
                </div>
              </div>

              <div className="col-6 col-lg-2 mb-4 mb-lg-0">
                <div className="ns-ft-col-title">Liên kết</div>
                <div className="ns-ft-links">
                  <Link to="/">Trang chủ</Link>
                  <Link to="/dich-vu">Dịch vụ & Bảng giá</Link>
                  <Link to="/dat-lich">Đặt lịch</Link>
                  <Link to="/lien-he">Liên hệ</Link>
                </div>
              </div>

              <div className="col-lg-4 mb-4 mb-lg-0">
                <div className="ns-ft-col-title">Liên hệ</div>
                <div className="ns-ft-links">
                  {s('site_address') && <span>{s('site_address')}</span>}
                  {s('site_phone') && <a href={`tel:${s('site_phone')}`}>{s('site_phone')}</a>}
                  {s('site_email') && <a href={`mailto:${s('site_email')}`}>{s('site_email')}</a>}
                  {s('working_hours') && <span>{s('working_hours')}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ns-ft-bottom">
          <div className="wd-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span className="ns-ft-copy">{s('footer_copyright', `© ${year} ${s('site_name', 'Nail Salon')}. All rights reserved.`)}</span>
            <Link to="/dat-lich" style={{ fontSize: 12, color: 'rgba(255,255,255,.32)', textDecoration: 'none' }}>Đặt lịch ngay →</Link>
          </div>
        </div>
      </footer>

      {/* Zalo Float */}
      {s('zalo_number') && (
        <div className="ns-zalo-float">
          <span className="ns-zalo-tip">Nhắn Zalo ngay</span>
          <a href={`https://zalo.me/${s('zalo_number')}`} target="_blank" rel="noopener noreferrer" className="ns-zalo-btn">
            💬
          </a>
        </div>
      )}
    </>
  )
}
