import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Đông Đô'
  const phone    = settings.site_phone || ''
  const email    = settings.site_email || ''
  const address  = settings.site_address || ''
  const zaloNum  = settings.zalo_number || ''
  const fbUrl    = settings.facebook_url || '#'
  const igUrl    = settings.instagram_url || '#'
  const copy     = settings.footer_copy || `© ${new Date().getFullYear()} Nha Khoa Đông Đô. Bảo lưu mọi quyền.`

  const nameParts = siteName.split(' ')
  const nameFirst = nameParts[0] || 'Đông'
  const nameRest  = nameParts.slice(1).join(' ') || 'Đô'

  return (
    <footer className="dd-footer">
      <div className="wd-container">
        <div className="dd-footer-grid">
          <div className="dd-footer-brand">
            <span className="dd-logo-main">{nameFirst} <em>{nameRest}</em></span>
            <p className="dd-footer-desc">Nha khoa cao cấp — dịch vụ trọn gói dành cho khách hàng thành đạt. Chuẩn mực điều trị quốc tế, kín đáo và tận tâm trong từng chi tiết.</p>
          </div>
          <div className="dd-footer-cols">
            <div className="dd-footer-col">
              <h5>Điều hướng</h5>
              <Link to="/dich-vu">Dịch vụ</Link>
              <Link to="/doi-ngu-bac-si">Đội ngũ bác sĩ</Link>
              <Link to="/cong-nghe">Công nghệ</Link>
              <Link to="/dat-lich">Đặt lịch</Link>
            </div>
            <div className="dd-footer-col">
              <h5>Liên hệ</h5>
              {phone && <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>}
              {email && <a href={`mailto:${email}`}>{email}</a>}
              {address && <p>{address}</p>}
            </div>
            <div className="dd-footer-col">
              <h5>Kết nối</h5>
              {zaloNum && <a href={`https://zalo.me/${zaloNum}`} target="_blank" rel="noopener noreferrer">Zalo</a>}
              {fbUrl && fbUrl !== '#' && <a href={fbUrl} target="_blank" rel="noopener noreferrer">Facebook</a>}
              {igUrl && igUrl !== '#' && <a href={igUrl} target="_blank" rel="noopener noreferrer">Instagram</a>}
            </div>
          </div>
        </div>
        <div className="dd-footer-bottom">
          <p>{copy}</p>
        </div>
      </div>
    </footer>
  )
}
