import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()

  const siteName = settings.site_name || 'SmileTech'
  const address = settings.site_address || '123 Nguyễn Đình Chiểu, Q.3, TP.HCM'
  const phone = settings.site_phone || '0901 234 567'
  const email = settings.site_email || 'info@smiletech.vn'
  const hours = settings.working_hours || 'T2–T7: 8:00–20:00 · CN: 8:00–17:00'
  const fbUrl = settings.facebook || 'https://facebook.com/smiletech'
  const igUrl = settings.instagram || 'https://instagram.com/smiletech'
  const ytUrl = settings.youtube || 'https://youtube.com/@smiletech'
  const zaloUrl = settings.zalo || settings.zalo_url || 'https://zalo.me/0901234567'

  return (
    <footer id="st-footer">
      <div className="wd-container">
        <div className="st-footer-grid">
          {/* Brand */}
          <div className="st-footer-brand st-footer-col">
            <div className="st-logo">
              <span className="st-logo-dot" />
              {siteName}
            </div>
            <p>Nha khoa công nghệ cao tại TP.HCM — AI chẩn đoán, scan 3D intraoral và hồ sơ kỹ thuật số mang lại trải nghiệm điều trị chính xác, thoải mái nhất.</p>
            <div className="st-footer-social">
              <a href={fbUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href={ytUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
              </a>
              <a href={zaloUrl} target="_blank" rel="noopener noreferrer" aria-label="Zalo">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 48 48"><path d="M24 4C13 4 4 13 4 24c0 4.8 1.7 9.2 4.5 12.7L6 42l5.6-2.4C14.8 41.6 19.3 44 24 44c11 0 20-9 20-20S35 4 24 4z"/></svg>
              </a>
            </div>
          </div>

          {/* Dịch vụ */}
          <div className="st-footer-col">
            <h4>Dịch vụ</h4>
            <ul>
              <li><Link to="/dich-vu">Cấy ghép Implant</Link></li>
              <li><Link to="/dich-vu">Niềng răng Invisalign</Link></li>
              <li><Link to="/dich-vu">Dán sứ Veneer</Link></li>
              <li><Link to="/dich-vu">Trồng răng sứ</Link></li>
              <li><Link to="/dich-vu">Nha khoa tổng quát</Link></li>
              <li><Link to="/dich-vu">Tẩy trắng răng Laser</Link></li>
            </ul>
          </div>

          {/* Thông tin */}
          <div className="st-footer-col">
            <h4>Liên kết</h4>
            <ul>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/cong-nghe">Công nghệ</Link></li>
              <li><Link to="/bac-si">Đội ngũ bác sĩ</Link></li>
              <li><Link to="/dat-lich">Đặt lịch khám</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><a href="/admin" rel="noopener noreferrer">Quản trị</a></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="st-footer-col">
            <h4>Liên hệ</h4>
            <ul>
              <li>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'inline', marginRight: 7, color: 'var(--accent-h)', verticalAlign: 'middle' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {address}
              </li>
              <li>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'inline', marginRight: 7, color: 'var(--accent-h)', verticalAlign: 'middle' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.62 1.41h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
              </li>
              <li>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'inline', marginRight: 7, color: 'var(--accent-h)', verticalAlign: 'middle' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'inline', marginRight: 7, color: 'var(--accent-h)', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="st-footer-bottom">
          <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
          <div className="st-footer-bottom-links">
            <span>Chính sách bảo mật</span>
            <span>Điều khoản dịch vụ</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
