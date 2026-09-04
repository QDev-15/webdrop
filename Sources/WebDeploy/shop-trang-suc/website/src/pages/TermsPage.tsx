import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({
    title: 'Điều khoản sử dụng — VIOLETTE Fine Jewelry',
    description: 'Điều khoản sử dụng dịch vụ và mua hàng tại VIOLETTE Fine Jewelry.',
  })

  return (
    <main className="tr-legal-wrap">
      <div className="tr-container">
        <div className="tr-breadcrumb" style={{ marginBottom: 26 }}><Link to="/">Trang chủ</Link> / <span>Điều khoản sử dụng</span></div>
        <h1 style={{ fontSize: 'clamp(28px,3.4vw,38px)', marginBottom: 34 }}>Điều khoản sử dụng</h1>
        <div className="tr-legal-grid">
          <div className="tr-legal-body">
            <p><em>Cập nhật lần cuối: 01/01/2026</em></p>
            <h2>1. Chấp nhận điều khoản</h2>
            <p>Khi truy cập và sử dụng website VIOLETTE, bạn đồng ý tuân thủ các điều khoản sử dụng được nêu dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng website.</p>
            <h2>2. Thông tin sản phẩm và giá cả</h2>
            <p>Giá sản phẩm được niêm yết bằng VNĐ, đã bao gồm thuế VAT. VIOLETTE có quyền điều chỉnh giá bán, chương trình khuyến mãi mà không cần báo trước, tuy nhiên đơn hàng đã xác nhận sẽ giữ nguyên mức giá tại thời điểm đặt hàng.</p>
            <h2>3. Đặt hàng và thanh toán</h2>
            <p>Đơn hàng được xác nhận qua điện thoại hoặc email trước khi giao. Khách hàng có thể thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng hoặc ví điện tử. Đơn hàng có giá trị từ 20.000.000₫ trở lên có thể yêu cầu đặt cọc trước.</p>
            <h2>4. Chính sách đổi trả</h2>
            <p>Sản phẩm được đổi trả trong vòng 30 ngày kể từ ngày mua nếu còn nguyên tem, hộp và hóa đơn, chưa qua sử dụng hoặc chỉnh sửa (khắc tên, cắt size). Sản phẩm lỗi do nhà sản xuất được đổi mới miễn phí trong 7 ngày đầu.</p>
            <h2>5. Bảo hành</h2>
            <p>VIOLETTE bảo hành trọn đời cho khung trang sức đối với lỗi kỹ thuật từ nhà sản xuất. Bảo hành không áp dụng cho hư hỏng do va đập, tác động ngoại lực, hoặc không tuân thủ hướng dẫn bảo quản.</p>
            <h2>6. Quyền sở hữu trí tuệ</h2>
            <p>Toàn bộ nội dung, hình ảnh, thiết kế trên website thuộc quyền sở hữu của VIOLETTE. Nghiêm cấm sao chép, sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.</p>
            <h2>7. Thay đổi điều khoản</h2>
            <p>VIOLETTE có quyền cập nhật, thay đổi điều khoản sử dụng bất kỳ lúc nào. Phiên bản mới nhất sẽ được đăng tải công khai trên website này.</p>
          </div>
          <aside className="tr-legal-sidebar">
            <div className="tr-legal-sidebar-box">
              <h4>Xem thêm</h4>
              <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link to="/lien-he">Liên hệ hỗ trợ</Link>
              <Link to="/ve-chung-toi">Giới thiệu VIOLETTE</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
