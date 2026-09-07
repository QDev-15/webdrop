import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: 'Điều Khoản Dịch Vụ — Rosette Bakery & Cafe',
    description: 'Điều khoản dịch vụ đặt bánh, đặt chỗ và đặt tiệc trà nhóm tại Rosette Bakery & Cafe.',
  })

  return (
    <>
      <section className="cbn-page-hero">
        <div className="cbn-container">
          <div className="cbn-ph-eyebrow">Pháp lý</div>
          <h1 className="cbn-ph-title">Điều Khoản <em>Dịch Vụ</em></h1>
          <p className="cbn-ph-sub">Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </section>

      <section className="cbn-sec-pad" style={{ paddingTop: 'clamp(48px,7vw,80px)' }}>
        <div className="cbn-container">
          <div className="cbn-legal-content" style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2>1. Chấp nhận điều khoản</h2>
            <p>Khi truy cập và sử dụng website hoặc dịch vụ của Rosette Bakery &amp; Cafe (đặt bánh, đặt chỗ, đặt tiệc trà nhóm), bạn đồng ý tuân thủ các điều khoản được nêu trong trang này.</p>
            <h2>2. Đặt bánh &amp; đặt chỗ</h2>
            <ul>
              <li>Bánh kem thiết kế theo yêu cầu cần đặt trước tối thiểu 48 giờ; bánh mẫu có sẵn cần đặt trước 24 giờ.</li>
              <li>Đặt chỗ được giữ tối đa 20 phút kể từ giờ hẹn, sau đó bàn có thể được ưu tiên cho khách khác.</li>
              <li>Đặt tiệc trà nhóm cần liên hệ trước ít nhất 3 ngày để quán chuẩn bị.</li>
            </ul>
            <h2>3. Thanh toán &amp; đặt cọc</h2>
            <p>Với bánh kem thiết kế riêng, Rosette thu trước 50% giá trị đơn hàng qua chuyển khoản để xác nhận đơn. Phần còn lại thanh toán khi nhận bánh. Đơn đặt cọc đã xác nhận không được hoàn lại nếu hủy trong vòng 24 giờ trước giờ giao/nhận.</p>
            <h2>4. Hủy &amp; đổi lịch</h2>
            <p>Khách hàng có thể hủy hoặc đổi lịch đặt chỗ miễn phí trước 2 giờ so với giờ hẹn. Với đơn đặt bánh, việc hủy hoặc thay đổi mẫu bánh cần thông báo trước tối thiểu 24 giờ so với giờ giao dự kiến.</p>
            <h2>5. Chất lượng sản phẩm</h2>
            <p>Rosette Bakery &amp; Cafe cam kết sử dụng nguyên liệu tươi và quy trình chế biến an toàn vệ sinh thực phẩm. Nếu phát hiện sản phẩm không đạt chất lượng khi nhận, khách hàng vui lòng phản ánh trong vòng 2 giờ để được hỗ trợ đổi hoặc hoàn tiền.</p>
            <h2>6. Trách nhiệm về dị ứng thực phẩm</h2>
            <p>Khách hàng có tiền sử dị ứng thực phẩm (gluten, trứng, sữa, các loại hạt...) vui lòng thông báo trước khi đặt hàng. Rosette không chịu trách nhiệm với các phản ứng dị ứng phát sinh nếu khách hàng không thông báo trước.</p>
            <h2>7. Thay đổi điều khoản</h2>
            <p>Rosette Bakery &amp; Cafe có quyền cập nhật điều khoản dịch vụ theo thời gian. Phiên bản mới nhất luôn được đăng tải công khai trên trang này.</p>
            <h2>8. Liên hệ</h2>
            <p>Mọi thắc mắc liên quan đến điều khoản dịch vụ, vui lòng liên hệ qua số điện thoại {settings.site_phone} hoặc email {settings.site_email}.</p>
          </div>
        </div>
      </section>
    </>
  )
}
