import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Điều Khoản Sử Dụng — ${settings.site_name || 'LUMIÈRE Beauty'}`,
    description: `Điều khoản sử dụng dịch vụ của ${settings.site_name || 'LUMIÈRE Beauty'}.`,
  })

  return (
    <main id="mp-main">
      <section className="mp-page-hero">
        <div className="wd-container">
          <nav aria-label="Breadcrumb">
            <ol className="mp-breadcrumb">
              <li><Link to="/">Trang chủ</Link></li>
              <li><span>Điều khoản sử dụng</span></li>
            </ol>
          </nav>
          <h1 className="mp-page-hero-title">Điều Khoản Sử Dụng</h1>
        </div>
      </section>

      <div className="wd-container">
        <div className="mp-legal-wrap">
          <article className="mp-legal-prose">
            <p>Chào mừng bạn đến với {settings.site_name || 'LUMIÈRE Beauty'}. Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản sử dụng dưới đây. Vui lòng đọc kỹ trước khi mua hàng.</p>

            <h2>1. Chấp nhận điều khoản</h2>
            <p>Khi truy cập, đăng ký tài khoản hoặc đặt hàng trên website, bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi các điều khoản sử dụng này cùng với Chính sách Bảo mật của chúng tôi.</p>

            <h2>2. Điều kiện đặt hàng</h2>
            <p>Khách hàng đặt hàng phải cung cấp thông tin chính xác, đầy đủ (họ tên, số điện thoại, địa chỉ giao hàng). {settings.site_name || 'LUMIÈRE Beauty'} có quyền từ chối hoặc hủy đơn hàng nếu phát hiện thông tin không chính xác hoặc có dấu hiệu gian lận.</p>

            <h2>3. Giá cả và thanh toán</h2>
            <p>Giá sản phẩm được niêm yết bằng VNĐ, đã bao gồm VAT (nếu có), chưa bao gồm phí vận chuyển. Chúng tôi có quyền thay đổi giá bất kỳ lúc nào mà không cần báo trước, tuy nhiên giá áp dụng cho đơn hàng đã xác nhận sẽ không thay đổi. Khách hàng có thể thanh toán khi nhận hàng (COD) hoặc chuyển khoản trước qua SePay.</p>

            <h2>4. Giao hàng</h2>
            <p>Thời gian giao hàng dự kiến 1–2 ngày tại TP.HCM và Hà Nội, 2–5 ngày với các tỉnh thành khác. Miễn phí vận chuyển cho đơn hàng từ 500.000đ. Thời gian giao hàng có thể thay đổi do các yếu tố khách quan (thời tiết, lễ tết, khu vực xa trung tâm).</p>

            <h2>5. Đổi trả và hoàn tiền</h2>
            <p>Sản phẩm được đổi trả miễn phí trong vòng 30 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên seal, chưa qua sử dụng. Hàng lỗi hoặc không đúng mô tả sẽ được đổi mới hoặc hoàn tiền 100%, không tính phí.</p>

            <h2>6. Bảo hành sản phẩm</h2>
            <p>Toàn bộ sản phẩm tại {settings.site_name || 'LUMIÈRE Beauty'} là hàng chính hãng 100%, có hóa đơn và giấy tờ nhập khẩu đầy đủ. Phát hiện hàng giả — hoàn tiền gấp đôi ngay lập tức, không điều kiện kèm theo.</p>

            <h2>7. Sử dụng website</h2>
            <p>Bạn cam kết không sử dụng website vào mục đích vi phạm pháp luật, không thực hiện các hành vi gây hại đến hệ thống (tấn công, khai thác lỗ hổng bảo mật, thu thập dữ liệu trái phép).</p>

            <h2>8. Sở hữu trí tuệ</h2>
            <p>Toàn bộ nội dung trên website (hình ảnh, văn bản, logo, thiết kế) thuộc quyền sở hữu của {settings.site_name || 'LUMIÈRE Beauty'} hoặc các đối tác cấp phép. Nghiêm cấm sao chép, phân phối lại khi chưa được sự đồng ý bằng văn bản.</p>

            <h2>9. Giới hạn trách nhiệm</h2>
            <p>{settings.site_name || 'LUMIÈRE Beauty'} không chịu trách nhiệm với các thiệt hại phát sinh do sử dụng sản phẩm sai hướng dẫn, dị ứng cá nhân không được thông báo trước, hoặc các sự kiện bất khả kháng ngoài tầm kiểm soát.</p>

            <h2>10. Luật áp dụng và giải quyết tranh chấp</h2>
            <p>Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết thông qua thương lượng; nếu không đạt được thỏa thuận, tranh chấp sẽ được đưa ra cơ quan tài phán có thẩm quyền tại Việt Nam.</p>

            <h2>11. Thay đổi điều khoản</h2>
            <p>Chúng tôi có quyền cập nhật, sửa đổi điều khoản sử dụng bất kỳ lúc nào. Phiên bản mới nhất sẽ được đăng tải trên website và có hiệu lực ngay khi công bố.</p>

            <h2>12. Liên hệ</h2>
            <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ:</p>
            <ul>
              <li><strong>Email:</strong> <a href={`mailto:${settings.site_email || 'hello@lumiere-beauty.vn'}`}>{settings.site_email || 'hello@lumiere-beauty.vn'}</a></li>
              <li><strong>Điện thoại:</strong> <a href={`tel:+84${(settings.site_phone || '').replace(/\D/g, '').replace(/^0/, '')}`}>{settings.site_phone || '0901 234 567'}</a></li>
              <li><strong>Địa chỉ:</strong> {settings.site_address || '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'}</li>
            </ul>

            <div className="mp-legal-cta">
              <p>Có câu hỏi về điều khoản sử dụng?</p>
              <Link to="/lien-he" className="mp-btn mp-btn-accent">Liên hệ với chúng tôi</Link>
            </div>
          </article>

          <aside className="mp-legal-sidebar">
            <nav aria-label="Điều hướng tài liệu pháp lý">
              <h3>Văn bản pháp lý</h3>
              <ul>
                <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                <li><Link to="/dieu-khoan" aria-current="page">Điều khoản sử dụng</Link></li>
              </ul>
            </nav>
            <div className="mp-legal-sidebar-box">
              <h4>Cần hỗ trợ?</h4>
              <p>Đội ngũ LUMIÈRE sẵn sàng giải đáp mọi thắc mắc của bạn.</p>
              <Link to="/lien-he" className="mp-btn mp-btn-ghost mp-btn-sm">Liên hệ ngay</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
