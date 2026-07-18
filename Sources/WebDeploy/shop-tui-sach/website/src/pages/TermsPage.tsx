import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function TermsPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Maison Cuir'

  return (
    <>
      <section className="ts-page-header">
        <div className="ts-container">
          <h1>Điều khoản sử dụng</h1>
          <div className="ts-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span className="current">Điều khoản sử dụng</span>
          </div>
        </div>
      </section>

      <section className="sec-pad">
        <div className="ts-container">
          <div className="ts-legal-content" data-reveal>
            <p className="ts-legal-updated">Cập nhật lần cuối: 18/07/2026</p>

            <p>Khi truy cập và sử dụng website của {siteName}, quý khách đồng ý tuân thủ các điều khoản sử dụng được nêu dưới đây. Vui lòng đọc kỹ trước khi đặt hàng hoặc sử dụng bất kỳ dịch vụ nào trên website.</p>

            <h2>1. Điều khoản đặt hàng &amp; thanh toán</h2>
            <p>Khi đặt hàng tại {siteName}, khách hàng cần cung cấp thông tin chính xác về họ tên, số điện thoại và địa chỉ giao hàng. Đơn hàng được xác nhận sau khi hệ thống hoặc nhân viên tư vấn liên hệ xác nhận với khách hàng.</p>
            <ul>
              <li>Giá sản phẩm hiển thị trên website đã bao gồm thuế VAT (nếu có), chưa bao gồm phí vận chuyển.</li>
              <li>Chấp nhận thanh toán qua chuyển khoản ngân hàng, ví điện tử, thẻ tín dụng/ghi nợ hoặc thanh toán khi nhận hàng (COD) tùy khu vực.</li>
              <li>{siteName} có quyền từ chối hoặc hủy đơn hàng trong trường hợp phát hiện thông tin không chính xác, có dấu hiệu gian lận hoặc sản phẩm hết hàng ngoài dự kiến.</li>
            </ul>

            <h2>2. Chính sách đổi trả</h2>
            <p>Sản phẩm được hỗ trợ đổi trả trong vòng {settings.return_days || 30} ngày kể từ ngày nhận hàng nếu còn nguyên tem mác, chưa qua sử dụng và có hóa đơn mua hàng hợp lệ. Chi tiết điều kiện, quy trình đổi trả tham chiếu chính sách đổi trả cụ thể được công bố tại showroom hoặc cung cấp khi khách hàng liên hệ qua trang <Link to="/lien-he" className="ts-inline-link">Liên hệ</Link>.</p>

            <h2>3. Trách nhiệm các bên</h2>
            <p>{siteName} có trách nhiệm cung cấp sản phẩm đúng như mô tả, đảm bảo chất lượng da thật và thực hiện đúng cam kết bảo hành đã công bố. Khách hàng có trách nhiệm cung cấp thông tin đặt hàng chính xác, thanh toán đầy đủ theo thỏa thuận và bảo quản sản phẩm đúng hướng dẫn để duy trì hiệu lực bảo hành.</p>
            <ul>
              <li>{siteName} không chịu trách nhiệm với hư hỏng phát sinh do sử dụng sai cách hoặc tác động ngoại lực sau khi giao hàng.</li>
              <li>Khách hàng chịu trách nhiệm kiểm tra tình trạng sản phẩm khi nhận hàng và thông báo ngay nếu phát hiện lỗi từ nhà sản xuất.</li>
            </ul>

            <h2>4. Quyền sở hữu trí tuệ</h2>
            <p>Toàn bộ nội dung trên website bao gồm hình ảnh sản phẩm, văn bản, logo, thiết kế giao diện và các tài sản trí tuệ khác thuộc quyền sở hữu của {siteName} hoặc được cấp phép sử dụng hợp pháp. Nghiêm cấm sao chép, phân phối lại hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.</p>

            <h2>5. Thay đổi điều khoản</h2>
            <p>{siteName} có quyền cập nhật, chỉnh sửa các điều khoản sử dụng này bất kỳ lúc nào nhằm phù hợp với hoạt động kinh doanh và quy định pháp luật hiện hành. Phiên bản điều khoản mới nhất sẽ được đăng tải trên trang này, khách hàng nên kiểm tra định kỳ để cập nhật thông tin.</p>

            <h2>6. Luật áp dụng &amp; giải quyết tranh chấp</h2>
            <p>Điều khoản sử dụng này được điều chỉnh bởi pháp luật hiện hành của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh trong quá trình sử dụng dịch vụ sẽ được ưu tiên giải quyết thông qua thương lượng, hòa giải; trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra cơ quan có thẩm quyền giải quyết theo quy định pháp luật.</p>
          </div>
        </div>
      </section>
    </>
  )
}
