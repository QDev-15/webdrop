import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({ title: 'Điều khoản sử dụng — Pet Haus', description: 'Điều khoản sử dụng website và dịch vụ của Pet Haus.' })

  return (
    <div className="tc-container" style={{ paddingTop: 140, paddingBottom: 80, maxWidth: 820 }}>
      <h1 className="tc-sec-title" style={{ fontSize: 32 }}>Điều khoản sử dụng</h1>
      <p style={{ color: 'var(--text-3)', fontSize: 13.5, marginBottom: 28 }}>Cập nhật lần cuối: 01/01/2026</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>1. Chấp thuận điều khoản</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Khi truy cập và sử dụng website Pet Haus, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ toàn bộ điều khoản sử dụng dưới đây.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>2. Đặt hàng & thanh toán</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Đơn hàng được xác nhận sau khi khách hàng hoàn tất thông tin đặt hàng. Giá sản phẩm hiển thị trên website có thể thay đổi mà không cần báo trước, tuy nhiên giá tại thời điểm xác nhận đơn hàng sẽ được giữ nguyên cho đơn hàng đó.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>3. Giao nhận hàng hóa</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Pet Haus giao hàng trong phạm vi thời gian đã cam kết (1-2 ngày nội thành các thành phố lớn, 2-4 ngày các tỉnh thành khác). Miễn phí vận chuyển cho đơn hàng từ 400.000₫.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>4. Đổi trả & hoàn tiền</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Áp dụng đổi trả miễn phí trong 7 ngày đối với sản phẩm còn nguyên tem, chưa qua sử dụng. Riêng thức ăn đã mở gói không áp dụng đổi trả vì lý do vệ sinh.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>5. Sở hữu trí tuệ</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Toàn bộ nội dung, hình ảnh, logo, thương hiệu hiển thị trên website thuộc quyền sở hữu của Pet Haus hoặc đối tác cung cấp, được bảo hộ theo quy định pháp luật về sở hữu trí tuệ. Nghiêm cấm sao chép, sử dụng lại khi chưa được cho phép.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>6. Giới hạn trách nhiệm</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Pet Haus không chịu trách nhiệm đối với các thiệt hại phát sinh từ việc sử dụng sản phẩm sai mục đích hoặc không đúng hướng dẫn sau khi khách hàng đã nhận sản phẩm.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>7. Thay đổi điều khoản</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Pet Haus có quyền cập nhật, điều chỉnh điều khoản sử dụng vào bất kỳ thời điểm nào. Điều khoản mới sẽ có hiệu lực ngay khi được đăng tải trên website.</p>

      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '28px 0 12px' }}>8. Liên hệ</h2>
      <p style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>Mọi thắc mắc liên quan đến điều khoản sử dụng, vui lòng liên hệ qua trang <Link to="/lien-he" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Liên hệ</Link>.</p>
    </div>
  )
}
