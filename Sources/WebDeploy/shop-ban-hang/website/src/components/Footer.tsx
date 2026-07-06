import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const siteName = settings['site_name'] || 'Shop Hữu Cơ'
  const desc = settings['site_description'] || 'Sản phẩm hữu cơ, thủ công và thân thiện với môi trường.'
  const facebook = settings['facebook']
  const instagram = settings['instagram']
  const year = new Date().getFullYear()

  return (
    <footer id="sb-footer">
      <div className="sb-container">
        <div className="sb-footer-grid">
          <div className="sb-footer-brand">
            <div className="sb-logo">{siteName}</div>
            <p>{desc}</p>
            <div className="sb-footer-social">
              {facebook && (
                <a href={facebook} className="sb-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.62 23.1 24 18.1 24 12.07z" /></svg>
                </a>
              )}
              {instagram && (
                <a href={instagram} className="sb-soc-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
              )}
            </div>
          </div>

          <div className="sb-footer-col">
            <h4>Cửa hàng</h4>
            <ul>
              <li><Link to="/san-pham">Tất cả sản phẩm</Link></li>
              <li><Link to="/san-pham">Hàng mới về</Link></li>
              <li><Link to="/san-pham">Bán chạy nhất</Link></li>
              <li><Link to="/gio-hang">Giỏ hàng</Link></li>
            </ul>
          </div>

          <div className="sb-footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><a href="#!">Chính sách đổi trả</a></li>
              <li><a href="#!">Chính sách vận chuyển</a></li>
              <li><a href="#!">Câu hỏi thường gặp</a></li>
            </ul>
          </div>
        </div>

        <div className="sb-footer-bottom">
          <p>© {year} {siteName}. Thiết kế bởi WebDrop.</p>
          <div className="sb-footer-pay">
            <span className="sb-pay-badge">VISA</span>
            <span className="sb-pay-badge">MasterCard</span>
            <span className="sb-pay-badge">Momo</span>
            <span className="sb-pay-badge">ZaloPay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
