import { Link } from 'react-router-dom'
import { useSite, type Category } from '../contexts/SiteContext'

const FALLBACK_CATEGORIES: Category[] = [
  { id: 0, name: 'Vang đỏ', slug: 'vang-do', image: '', product_count: 0 },
  { id: 0, name: 'Vang trắng', slug: 'vang-trang', image: '', product_count: 0 },
  { id: 0, name: 'Vang sủi', slug: 'vang-sui', image: '', product_count: 0 },
  { id: 0, name: 'Vang hồng', slug: 'vang-hong', image: '', product_count: 0 },
  { id: 0, name: 'Set quà tặng', slug: 'qua-tang-set', image: '', product_count: 0 },
]

export default function Footer() {
  const { settings, categories } = useSite()
  const mapUrl = settings.map_embed_url || 'https://maps.google.com/maps?q=10.7769,106.7009&hl=vi&z=15&output=embed'
  const cats = categories.length > 0 ? categories : FALLBACK_CATEGORIES

  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.currentTarget.reset()
    // eslint-disable-next-line no-alert
    alert('Cảm ơn bạn đã đăng ký!')
  }

  const zaloNumber = settings.zalo_number || '0900000000'

  return (
    <>
    <footer className="rv-footer">
      <div className="rv-footer-brand-bg">MỘC VANG</div>
      <div className="wd-container">
        <div className="rv-footer-legal-strip">
          <div className="rv-age-badge">18+</div>
          <p>Sản phẩm chỉ dành cho người từ 18 tuổi trở lên. Uống có trách nhiệm — không lái xe hoặc vận hành máy móc sau khi sử dụng rượu bia. Mộc Vang hoạt động tuân thủ Nghị định số 105/2017/NĐ-CP về kinh doanh rượu.</p>
        </div>
        <div className="rv-footer-inner">
          <div className="rv-footer-about">
            <div className="rv-footer-logo">MỘC<em>VANG</em></div>
            <p>{settings.footer_about || 'Nhà nhập khẩu & phân phối rượu vang chính hãng — hơn 200 nhãn hiệu từ Pháp, Ý, Chile, Tây Ban Nha, Úc, Argentina, Mỹ. Bảo quản kho lạnh chuẩn 16°C, giao hàng toàn quốc.'}</p>
            <div className="rv-footer-social">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" /></svg>
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1" /></svg>
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3Z" fill="currentColor" /></svg>
                </a>
              )}
            </div>
          </div>
          <div className="rv-footer-col">
            <h6>Danh mục</h6>
            <ul>
              {cats.map(c => <li key={c.slug}><Link to={`/?category=${c.slug}`}>{c.name}</Link></li>)}
            </ul>
          </div>
          <div className="rv-footer-col">
            <h6>Hỗ trợ</h6>
            <ul>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/ve-chung-toi">Giới thiệu</Link></li>
              <li><Link to="/gio-hang">Giỏ hàng</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
          <div className="rv-footer-col rv-footer-newsletter">
            <h6>Nhận ưu đãi mới</h6>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 10 }}>Đăng ký để nhận thông báo vang mới về &amp; mã giảm giá.</p>
            <form onSubmit={handleNewsletter}>
              <label htmlFor="rvNewsletterEmail" className="visually-hidden">Email</label>
              <input type="email" id="rvNewsletterEmail" placeholder="Email của bạn" required />
              <button type="submit">Gửi</button>
            </form>
          </div>
        </div>
        <div className="rv-footer-maps">
          <iframe src={mapUrl} loading="lazy" title="Bản đồ cửa hàng Mộc Vang"></iframe>
        </div>
        <div className="rv-footer-bottom">
          <span>© {new Date().getFullYear()} {settings.site_name || 'Mộc Vang'}. Nội dung trên website chỉ mang tính chất minh họa demo.</span>
          <span>{settings.license_number || 'Giấy phép kinh doanh rượu số [XXXX/GP-KDR] · TP. Hồ Chí Minh'}</span>
        </div>
      </div>
    </footer>
    <a href={`https://zalo.me/${zaloNumber}`} className="rv-zalo-float" target="_blank" rel="noopener noreferrer" aria-label="Chat qua Zalo">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#0068FF" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">Zalo</text>
      </svg>
    </a>
    </>
  )
}
