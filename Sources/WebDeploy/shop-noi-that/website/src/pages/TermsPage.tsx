import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({
    title: 'Điều khoản sử dụng — MỘC AN',
    description: 'Điều khoản sử dụng website MỘC AN — chính sách đặt hàng, thanh toán, giao hàng, đổi trả và bảo hành.',
  })

  return (
    <div className="nt-legal">
      <h1>Điều khoản sử dụng</h1>
      <p className="updated">Cập nhật lần cuối: 01/01/2026</p>

      <p>Khi truy cập và đặt hàng tại website MỘC AN, bạn đồng ý với các điều khoản sử dụng dưới đây.</p>

      <h2>1. Thông tin sản phẩm</h2>
      <p>MỘC AN nỗ lực mô tả chính xác thông tin, kích thước và màu sắc sản phẩm. Màu sắc thực tế có thể chênh lệch nhẹ so với hình ảnh do điều kiện ánh sáng khi chụp và cài đặt màn hình hiển thị của từng thiết bị.</p>

      <h2>2. Đặt hàng &amp; thanh toán</h2>
      <p>Đơn hàng được xác nhận sau khi khách hàng hoàn tất thông tin đặt hàng và MỘC AN xác nhận qua điện thoại/email. MỘC AN chấp nhận thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng hoặc trả góp qua thẻ tín dụng đối với đơn hàng đủ điều kiện.</p>

      <h2>3. Giao hàng &amp; lắp đặt</h2>
      <p>Thời gian giao hàng dự kiến 2–8 ngày làm việc tùy khu vực. MỘC AN không chịu trách nhiệm về việc chậm trễ giao hàng do các nguyên nhân bất khả kháng (thiên tai, gián đoạn vận chuyển...).</p>

      <h2>4. Chính sách đổi trả</h2>
      <p>Khách hàng có quyền đổi trả sản phẩm trong vòng 15 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên trạng, chưa qua sử dụng và còn đầy đủ bao bì gốc. Chi phí vận chuyển đổi trả do lỗi từ phía khách hàng (đổi ý, chọn sai kích thước) sẽ do khách hàng chi trả.</p>

      <h2>5. Bảo hành</h2>
      <p>Sản phẩm nội thất gỗ được bảo hành 24 tháng đối với lỗi khung, bản lề, cơ chế vận hành phát sinh từ lỗi sản xuất. Bảo hành không áp dụng với hư hỏng do va đập, sử dụng sai mục đích hoặc tác động của môi trường (ẩm mốc, côn trùng do bảo quản không đúng cách).</p>

      <h2>6. Quyền sở hữu trí tuệ</h2>
      <p>Toàn bộ nội dung, hình ảnh, thiết kế trên website thuộc quyền sở hữu của MỘC AN. Nghiêm cấm sao chép, sử dụng cho mục đích thương mại khi chưa được sự đồng ý bằng văn bản.</p>

      <h2>7. Thay đổi điều khoản</h2>
      <p>MỘC AN có quyền cập nhật điều khoản sử dụng theo thời gian mà không cần báo trước. Phiên bản mới nhất luôn được đăng tải công khai tại trang này.</p>
    </div>
  )
}
