import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({
    title: 'Điều khoản sử dụng — MERIDIAN',
    description: 'Điều khoản sử dụng dịch vụ và chính sách mua hàng tại MERIDIAN.',
  })

  return (
    <>
      <section className="dh-legal-header">
        <div className="dh-container">
          <h1>Điều khoản sử dụng</h1>
          <p>Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </section>

      <section className="dh-sec">
        <div className="dh-container dh-legal-content">
          <h2>1. Chấp thuận điều khoản</h2>
          <p>Khi truy cập và sử dụng website MERIDIAN, bạn đồng ý tuân thủ các điều khoản sử dụng được nêu dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng website.</p>

          <h2>2. Thông tin sản phẩm</h2>
          <p>MERIDIAN nỗ lực đảm bảo thông tin sản phẩm (giá, mô tả, hình ảnh, tình trạng kho) được cập nhật chính xác. Tuy nhiên có thể xảy ra sai lệch ngoài ý muốn — MERIDIAN có quyền điều chỉnh mà không cần báo trước, và sẽ liên hệ khách hàng nếu ảnh hưởng đến đơn hàng đã đặt.</p>

          <h2>3. Đặt hàng và thanh toán</h2>
          <p>Đơn hàng chỉ được xác nhận khi khách hàng hoàn tất thông tin đặt hàng và MERIDIAN xác nhận qua điện thoại hoặc email. Hình thức thanh toán bao gồm: thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, hoặc trả góp qua thẻ tín dụng.</p>

          <h2>4. Chính sách đổi trả</h2>
          <p>Khách hàng được đổi trả sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên tem, hộp, chưa qua sử dụng và có đầy đủ hóa đơn mua hàng. Chi phí vận chuyển đổi trả (nếu có) do MERIDIAN chi trả trong trường hợp lỗi từ nhà sản xuất.</p>

          <h2>5. Chính sách bảo hành</h2>
          <p>Thời gian bảo hành chính hãng tối thiểu 2 năm, riêng dòng sản phẩm phiên bản giới hạn được bảo hành mở rộng 5 năm. Bảo hành áp dụng cho lỗi kỹ thuật từ nhà sản xuất, không áp dụng cho hư hỏng do va đập, vào nước sai cách hoặc tự ý tháo sửa.</p>

          <h2>6. Quyền sở hữu trí tuệ</h2>
          <p>Toàn bộ nội dung, hình ảnh, logo trên website thuộc quyền sở hữu của MERIDIAN hoặc các bên cấp phép liên quan. Nghiêm cấm sao chép, sử dụng vì mục đích thương mại khi chưa được cho phép bằng văn bản.</p>

          <h2>7. Thay đổi điều khoản</h2>
          <p>MERIDIAN có quyền cập nhật, thay đổi điều khoản sử dụng bất kỳ lúc nào. Phiên bản mới nhất sẽ được đăng tải công khai trên website này.</p>
        </div>
      </section>
    </>
  )
}
