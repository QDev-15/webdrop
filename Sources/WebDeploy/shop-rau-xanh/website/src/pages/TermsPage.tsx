import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function TermsPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Vườn Xanh'

  return (
    <main>
      <div className="rx-page-header">
        <div className="rx-container">
          <nav className="rx-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Điều khoản sử dụng</span>
          </nav>
          <h1 className="rx-page-title">Điều khoản sử dụng</h1>
          <p className="rx-page-count">Vui lòng đọc kỹ các điều khoản trước khi đặt hàng tại {siteName}.</p>
        </div>
      </div>

      <div className="rx-container-sm rx-policy-section">
        <div className="rx-policy-block" data-reveal>
          <h2>1. Đặt hàng & thanh toán</h2>
          <p>Khi đặt hàng trên website, bạn xác nhận thông tin sản phẩm (loại rau củ, số lượng, combo) và địa chỉ giao hàng là chính xác. {siteName} chỉ xử lý đơn hàng sau khi nhận được xác nhận từ hệ thống; đơn hàng có thể bị hủy nếu sản phẩm hết hàng đột xuất theo mùa vụ. Khách hàng có thể thanh toán khi nhận hàng (COD) hoặc chuyển khoản/ví điện tử theo phương thức được hiển thị tại trang thanh toán.</p>
        </div>

        <div className="rx-policy-block" data-reveal data-delay="1">
          <h2>2. Đổi trả sản phẩm</h2>
          <p>Do đặc thù rau củ quả tươi sống, việc đổi trả được áp dụng khi sản phẩm không đạt chất lượng lúc giao hàng (dập nát, hư hỏng, sai chủng loại). Khách hàng vui lòng phản ánh trong vòng 24 giờ kể từ khi nhận hàng kèm hình ảnh sản phẩm để được hỗ trợ đổi mới hoặc hoàn tiền. Chi tiết quy trình đổi trả được giải đáp tại trang <Link to="/lien-he" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Liên hệ</Link>.</p>
        </div>

        <div className="rx-policy-block" data-reveal>
          <h2>3. Trách nhiệm các bên</h2>
          <ul>
            <li>{siteName} có trách nhiệm cung cấp thông tin sản phẩm trung thực, đóng gói và giao hàng đúng cam kết về thời gian, chất lượng.</li>
            <li>Khách hàng có trách nhiệm cung cấp thông tin liên hệ, địa chỉ giao hàng chính xác và nhận hàng đúng hẹn đã đặt.</li>
            <li>Trường hợp giao hàng không thành công do thông tin sai hoặc khách hàng không có mặt nhận hàng, chi phí giao lại (nếu có) sẽ do khách hàng chi trả.</li>
          </ul>
        </div>

        <div className="rx-policy-block" data-reveal data-delay="1">
          <h2>4. Sở hữu trí tuệ</h2>
          <p>Toàn bộ nội dung trên website — bao gồm hình ảnh sản phẩm, logo, bài viết, thiết kế giao diện — thuộc quyền sở hữu của {siteName}. Nghiêm cấm sao chép, sử dụng lại vì mục đích thương mại khi chưa có sự đồng ý bằng văn bản.</p>
        </div>

        <div className="rx-policy-block" data-reveal>
          <h2>5. Thay đổi điều khoản</h2>
          <p>{siteName} có quyền cập nhật, điều chỉnh điều khoản sử dụng này bất kỳ lúc nào để phù hợp với hoạt động kinh doanh và quy định pháp luật hiện hành. Phiên bản điều khoản mới nhất sẽ được đăng tải công khai trên trang này, việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các thay đổi đó.</p>
        </div>

        <div className="rx-policy-block" data-reveal data-delay="1">
          <h2>6. Luật áp dụng & giải quyết tranh chấp</h2>
          <p>Điều khoản sử dụng này được điều chỉnh theo pháp luật Việt Nam. Mọi tranh chấp phát sinh trong quá trình sử dụng dịch vụ sẽ được ưu tiên giải quyết thông qua thương lượng, hòa giải giữa hai bên; trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra cơ quan có thẩm quyền theo quy định pháp luật để giải quyết.</p>
        </div>
      </div>
    </main>
  )
}
