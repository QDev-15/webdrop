import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({ title: 'Điều khoản sử dụng — Mộc Vang', description: 'Điều khoản sử dụng website và dịch vụ của Mộc Vang.' })

  return (
    <div className="wd-container rv-policy">
      <h1 className="rv-sec-title" style={{ fontSize: 32 }}>Điều khoản sử dụng</h1>
      <p className="rv-updated">Cập nhật lần cuối: 01/01/2026</p>

      <div className="rv-notice-box">
        <strong>Cảnh báo:</strong> Uống rượu bia không đảm bảo sức khỏe cho thai nhi và trẻ nhỏ. Không sử dụng rượu bia khi lái xe hoặc vận hành máy móc. Nghiêm cấm bán rượu cho người dưới 18 tuổi.
      </div>

      <h2>1. Chấp thuận điều khoản</h2>
      <p>Khi truy cập và sử dụng website Mộc Vang, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ điều khoản sử dụng dưới đây, cũng như xác nhận mình đã đủ 18 tuổi trở lên theo quy định pháp luật Việt Nam về kinh doanh rượu (Nghị định số 105/2017/NĐ-CP và các văn bản sửa đổi, bổ sung).</p>

      <h2>2. Điều kiện độ tuổi</h2>
      <p>Website và dịch vụ của Mộc Vang chỉ dành cho người từ đủ 18 tuổi trở lên. Chúng tôi có quyền từ chối xử lý đơn hàng hoặc giao hàng nếu không xác minh được độ tuổi hợp lệ của khách hàng.</p>

      <h2>3. Đặt hàng &amp; thanh toán</h2>
      <p>Đơn hàng được xác nhận sau khi khách hàng hoàn tất thông tin đặt hàng và Mộc Vang xác nhận qua điện thoại/email. Giá sản phẩm hiển thị trên website có thể thay đổi mà không cần báo trước, tuy nhiên giá tại thời điểm xác nhận đơn hàng sẽ được giữ nguyên cho đơn hàng đó.</p>

      <h2>4. Giao nhận hàng hóa</h2>
      <p>Mộc Vang giao hàng trong phạm vi thời gian đã cam kết (2 giờ nội thành Hà Nội/TP.HCM, 2–4 ngày các tỉnh thành khác). Người nhận hàng phải xuất trình giấy tờ tùy thân chứng minh đã đủ 18 tuổi; Mộc Vang có quyền từ chối giao hàng nếu không xác minh được.</p>

      <h2>5. Đổi trả &amp; hoàn tiền</h2>
      <p>Áp dụng đổi trả miễn phí trong 24 giờ đối với sản phẩm bị vỡ, sai mẫu hoặc lỗi vận chuyển. Mộc Vang không chịu trách nhiệm đổi trả với lý do thay đổi ý định mua hàng sau khi đã nhận sản phẩm nguyên vẹn.</p>

      <h2>6. Sở hữu trí tuệ</h2>
      <p>Toàn bộ nội dung, hình ảnh, logo, thương hiệu hiển thị trên website thuộc quyền sở hữu của Mộc Vang hoặc đối tác cung cấp, được bảo hộ theo quy định pháp luật về sở hữu trí tuệ. Nghiêm cấm sao chép, sử dụng lại khi chưa được cho phép.</p>

      <h2>7. Giới hạn trách nhiệm</h2>
      <p>Mộc Vang không chịu trách nhiệm đối với các thiệt hại phát sinh từ việc sử dụng rượu bia sai mục đích, sai đối tượng hoặc vi phạm quy định pháp luật của người mua hàng sau khi nhận sản phẩm.</p>

      <h2>8. Thay đổi điều khoản</h2>
      <p>Mộc Vang có quyền cập nhật, điều chỉnh điều khoản sử dụng vào bất kỳ thời điểm nào. Điều khoản mới sẽ có hiệu lực ngay khi được đăng tải trên website.</p>

      <h2>9. Liên hệ</h2>
      <p>Mọi thắc mắc liên quan đến điều khoản sử dụng, vui lòng liên hệ qua trang <Link to="/lien-he" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Liên hệ</Link>.</p>
    </div>
  )
}
