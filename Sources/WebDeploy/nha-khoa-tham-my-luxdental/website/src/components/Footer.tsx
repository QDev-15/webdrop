import { NavLink } from 'react-router-dom'
import { useSite } from '../App'

export default function Footer() {
  const { settings } = useSite()
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="wd-container">
        <div className="lx-ft-top">
          <div className="row gy-5">
            {/* Brand */}
            <div className="col-lg-4">
              <div className="lx-ft-logo">
                <div className="lx-ft-logo-mark">L</div>
                <div>
                  <div className="lx-ft-logo-name">{settings.site_name}</div>
                  <div className="lx-ft-logo-sub">{settings.site_tagline}</div>
                </div>
              </div>
              <p className="lx-ft-desc">
                Nha khoa thẩm mỹ cao cấp — chuyên Veneer sứ, bọc răng sứ, tẩy trắng và thiết kế nụ cười hoàn hảo theo chuẩn quốc tế.
              </p>
              <div className="lx-ft-socials">
                {settings.facebook && settings.facebook !== '#' && (
                  <a href={settings.facebook} className="lx-ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
                )}
                {settings.instagram && settings.instagram !== '#' && (
                  <a href={settings.instagram} className="lx-ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>
                )}
                {settings.zalo && settings.zalo !== '#' && (
                  <a href={settings.zalo} className="lx-ft-soc" target="_blank" rel="noopener noreferrer" aria-label="Zalo">zl</a>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="col-6 col-lg-2">
              <div className="lx-ft-col-title">Menu</div>
              <nav className="lx-ft-links">
                <NavLink to="/">Trang chủ</NavLink>
                <NavLink to="/dich-vu">Dịch vụ</NavLink>
                <NavLink to="/truoc-sau">Trước &amp; Sau</NavLink>
                <NavLink to="/bac-si">Bác sĩ</NavLink>
                <NavLink to="/dat-lich">Đặt lịch</NavLink>
                <NavLink to="/lien-he">Liên hệ</NavLink>
              </nav>
            </div>

            {/* Services */}
            <div className="col-6 col-lg-3">
              <div className="lx-ft-col-title">Dịch vụ</div>
              <nav className="lx-ft-links">
                <NavLink to="/dich-vu">Veneer sứ cao cấp</NavLink>
                <NavLink to="/dich-vu">Bọc răng sứ thẩm mỹ</NavLink>
                <NavLink to="/dich-vu">Tẩy trắng răng</NavLink>
                <NavLink to="/dich-vu">Thiết kế nụ cười</NavLink>
                <NavLink to="/dich-vu">Niềng răng thẩm mỹ</NavLink>
                <NavLink to="/dich-vu">Cấy ghép Implant</NavLink>
              </nav>
            </div>

            {/* Contact */}
            <div className="col-lg-3">
              <div className="lx-ft-col-title">Liên hệ</div>
              <div className="lx-ft-contact-item">
                <div className="lx-ft-contact-icon">📍</div>
                <div className="lx-ft-contact-text">
                  <strong>Địa chỉ</strong>
                  {settings.site_address}
                </div>
              </div>
              <div className="lx-ft-contact-item">
                <div className="lx-ft-contact-icon">📞</div>
                <div className="lx-ft-contact-text">
                  <strong>Hotline</strong>
                  <a href={`tel:${settings.site_phone}`} style={{ color: 'inherit' }}>{settings.site_phone}</a>
                </div>
              </div>
              <div className="lx-ft-contact-item">
                <div className="lx-ft-contact-icon">🕐</div>
                <div className="lx-ft-contact-text">
                  <strong>Giờ làm việc</strong>
                  {settings.working_hours}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mega brand text */}
        <div className="lx-ft-mega">Lux<span>Dental</span></div>

        {/* Bottom bar */}
        <div className="lx-ft-bottom">
          <div className="lx-ft-copy">
            © {year} {settings.site_name}. All rights reserved.
          </div>
          <div className="lx-ft-cert">
            <span>ISO 9001:2015</span>
            <span>Bộ Y tế cấp phép</span>
            <span>An toàn &amp; Bảo mật</span>
          </div>
        </div>
      </div>

      {/* Zalo float */}
      {settings.zalo && settings.zalo !== '#' && (
        <a href={settings.zalo} className="lx-zalo" target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M13 2C7.477 2 3 6.477 3 12c0 2.09.637 4.031 1.726 5.644L3.5 21.5l4.06-1.215A9.955 9.955 0 0013 22c5.523 0 10-4.477 10-10S18.523 2 13 2z" fill="#fff"/>
            <path d="M8.8 10.3c0-.28.22-.5.5-.5h.4c.28 0 .5.22.5.5v4.6c0 .28-.22.5-.5.5h-.4a.5.5 0 01-.5-.5v-4.6zm2.6 0c0-.28.22-.5.5-.5h.3c.2 0 .38.12.46.3l1.74 3.44V10.3c0-.28.22-.5.5-.5h.3c.28 0 .5.22.5.5v4.6c0 .28-.22.5-.5.5h-.3a.5.5 0 01-.46-.3L12.7 11.7v3.2c0 .28-.22.5-.5.5h-.3a.5.5 0 01-.5-.5v-4.6z" fill="#0068FF"/>
          </svg>
        </a>
      )}
    </footer>
  )
}
