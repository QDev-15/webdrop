import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function PrivacyPage() {
  useDocumentMeta({ title: 'Chính sách bảo mật | RaoNhà', description: 'Chính sách bảo mật của RaoNhà — thông tin thu thập, mục đích sử dụng, chia sẻ thông tin và quyền của người dùng.' })
  return (
    <>
      <section className="rn-page-hero">
        <div className="rn-container"><h1 className="sec-title">Chính sách <em>bảo mật</em></h1><p className="sec-sub" style={{ margin: '0 auto' }}>Cập nhật lần cuối: 23/08/2026</p></div>
      </section>
      <section className="sec-pad">
        <div className="rn-container rn-legal-content" style={{ maxWidth: 820 }}>
          <h2>1. Thông tin chúng tôi thu thập</h2>
          <p>Khi bạn sử dụng RaoNhà, chúng tôi có thể thu thập: thông tin liên hệ (họ tên, số điện thoại, email) khi bạn đăng tin, đặt lịch xem nhà hoặc gửi liên hệ; thông tin bất động sản do người đăng tin cung cấp; dữ liệu truy cập (loại thiết bị, trang đã xem) nhằm cải thiện trải nghiệm sử dụng.</p>

          <h2>2. Mục đích sử dụng thông tin</h2>
          <ul>
            <li>Hiển thị tin đăng công khai và kết nối người mua/thuê với người đăng tin.</li>
            <li>Xác minh tính hợp lệ của tin đăng trước khi hiển thị.</li>
            <li>Gửi thông báo liên quan đến tin đăng, gói tin VIP đã đăng ký.</li>
            <li>Phân tích, cải thiện chất lượng dịch vụ và trải nghiệm người dùng.</li>
          </ul>

          <h2>3. Chia sẻ thông tin</h2>
          <p>Số điện thoại và tên người đăng tin được hiển thị công khai trên trang chi tiết bất động sản để người mua/thuê có thể liên hệ trực tiếp — đây là tính chất cốt lõi của mô hình sàn giao dịch. RaoNhà không bán thông tin cá nhân cho bên thứ ba ngoài mục đích trên.</p>

          <h2>4. Bảo mật dữ liệu</h2>
          <p>Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý để bảo vệ thông tin người dùng khỏi truy cập trái phép. Tuy nhiên, không có hệ thống nào an toàn tuyệt đối — người dùng nên thận trọng khi cung cấp thông tin nhạy cảm qua bất kỳ kênh trực tuyến nào.</p>

          <h2>5. Quyền của người dùng</h2>
          <p>Bạn có quyền yêu cầu chỉnh sửa hoặc gỡ bỏ tin đăng, thông tin liên hệ của mình bằng cách gửi yêu cầu qua trang Liên hệ hoặc hotline 1900 6789.</p>

          <h2>6. Thay đổi chính sách</h2>
          <p>RaoNhà có thể cập nhật chính sách này theo thời gian. Phiên bản mới nhất luôn được đăng tải tại trang này.</p>
        </div>
      </section>
    </>
  )
}
