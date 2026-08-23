import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({ title: 'Điều khoản sử dụng | RaoNhà', description: 'Điều khoản sử dụng nền tảng RaoNhà — trách nhiệm người đăng tin, người tìm kiếm, gói tin và giới hạn trách nhiệm.' })
  return (
    <>
      <section className="rn-page-hero">
        <div className="rn-container"><h1 className="sec-title">Điều khoản <em>sử dụng</em></h1><p className="sec-sub" style={{ margin: '0 auto' }}>Cập nhật lần cuối: 23/08/2026</p></div>
      </section>
      <section className="sec-pad">
        <div className="rn-container rn-legal-content" style={{ maxWidth: 820 }}>
          <h2>1. Bản chất nền tảng</h2>
          <p>RaoNhà là sàn giao dịch trung gian cho phép người dùng (chính chủ, môi giới tự do, công ty môi giới) tự đăng tải thông tin bất động sản. RaoNhà không phải chủ sở hữu, không phải đại diện pháp lý và không tham gia trực tiếp vào bất kỳ giao dịch mua bán/cho thuê nào giữa các bên.</p>

          <h2>2. Trách nhiệm người đăng tin</h2>
          <ul>
            <li>Cung cấp thông tin chính xác, trung thực về bất động sản (giá, diện tích, pháp lý, hình ảnh thật).</li>
            <li>Chịu trách nhiệm pháp lý về nội dung tin đăng của mình.</li>
            <li>Không đăng tin trùng lặp, sai sự thật hoặc có dấu hiệu lừa đảo.</li>
          </ul>

          <h2>3. Trách nhiệm người tìm kiếm</h2>
          <p>Người dùng tự chịu trách nhiệm kiểm tra, xác minh thông tin và giấy tờ pháp lý trước khi thực hiện giao dịch. RaoNhà khuyến nghị không đặt cọc hoặc chuyển tiền khi chưa gặp mặt trực tiếp và xác minh đầy đủ pháp lý.</p>

          <h2>4. Gói tin và thanh toán</h2>
          <p>Gói Tin thường được sử dụng miễn phí. Các gói VIP Bạc, VIP Vàng, VIP Kim Cương là dịch vụ trả phí giúp tăng vị trí hiển thị — mức phí và quyền lợi được công bố rõ tại trang Đăng tin. RaoNhà không hoàn phí đối với tin đã được duyệt hiển thị, trừ trường hợp lỗi kỹ thuật từ hệ thống.</p>

          <h2>5. Kiểm duyệt và gỡ tin</h2>
          <p>RaoNhà có quyền từ chối hiển thị hoặc gỡ bỏ bất kỳ tin đăng nào vi phạm điều khoản, chứa nội dung sai sự thật, hoặc bị báo cáo và xác minh là lừa đảo, mà không cần thông báo trước.</p>

          <h2>6. Giới hạn trách nhiệm</h2>
          <p>RaoNhà không chịu trách nhiệm đối với thiệt hại phát sinh từ giao dịch giữa người mua/thuê và người đăng tin, kể cả trong trường hợp thông tin tin đăng không chính xác hoặc có gian lận từ một trong hai bên.</p>

          <h2>7. Thay đổi điều khoản</h2>
          <p>RaoNhà có thể cập nhật điều khoản sử dụng theo thời gian. Việc tiếp tục sử dụng nền tảng sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.</p>
        </div>
      </section>
    </>
  )
}
