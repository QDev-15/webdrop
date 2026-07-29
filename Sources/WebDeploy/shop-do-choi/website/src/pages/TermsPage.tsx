import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({ title: 'Điều khoản sử dụng — KidZone' })

  return (
    <div className="dc-page-wrap">
      <div className="dc-page-hero">
        <div className="dc-container">
          <h1>Điều khoản sử dụng</h1>
          <p>Cập nhật lần cuối: Tháng 7 năm 2024</p>
        </div>
      </div>

      <div className="dc-container" style={{ padding: '48px 0', maxWidth: 800 }}>
        <section style={{ marginBottom: 32 }}>
          <h2>1. Chấp nhận Điều khoản</h2>
          <p>Bằng cách truy cập và sử dụng website này, bạn chấp nhận và đồng ý bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không sử dụng website.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>2. Giấy phép sử dụng</h2>
          <p>Chúng tôi cấp phép cho bạn một giấy phép sử dụng website này cho các mục đích cá nhân, phi thương mại. Bạn không được:</p>
          <ul style={{ marginLeft: 20 }}>
            <li>Sao chép hoặc sửa đổi nội dung</li>
            <li>Bán hoặc chuyển nhượng giấy phép</li>
            <li>Truy cập web scraping hoặc tự động</li>
            <li>Truyền malware hoặc phần mềm độc hại</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>3. Chính sách Sản phẩm</h2>
          <h3>Mô tả Sản phẩm</h3>
          <p>Chúng tôi nỗ lực cung cấp mô tả sản phẩm chính xác. Tuy nhiên, chúng tôi không đảm bảo rằng mô tả hoàn toàn chính xác, hoàn chỉnh hoặc không có lỗi.</p>

          <h3>Giá</h3>
          <p>Giá được liệt kê trên website có thể thay đổi mà không có thông báo trước. Chúng tôi bảo lưu quyền từ chối bất kỳ đơn hàng nào vì lý do bất kỳ.</p>

          <h3>Tính sẵn có</h3>
          <p>Tất cả các sản phẩm được cấp với điều kiện "còn hàng". Nếu sản phẩm không còn hàng, chúng tôi sẽ thông báo cho bạn và cung cấp các tùy chọn khác.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>4. Chính sách Đặt hàng</h2>
          <p>Bằng cách đặt hàng, bạn:</p>
          <ul style={{ marginLeft: 20 }}>
            <li>Đảm bảo rằng bạn ít nhất 18 tuổi</li>
            <li>Cung cấp thông tin chính xác</li>
            <li>Chấp nhận trách nhiệm pháp lý cho thông tin của bạn</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>5. Thanh toán</h2>
          <p>Chúng tôi chấp nhận thanh toán qua:</p>
          <ul style={{ marginLeft: 20 }}>
            <li>Chuyển khoản ngân hàng (SePay)</li>
            <li>Thanh toán khi nhận hàng (COD)</li>
          </ul>
          <p>Tất cả giao dịch được mã hóa và an toàn.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>6. Chính sách Vận chuyển</h2>
          <p>Chúng tôi hỗ trợ vận chuyển toàn quốc. Phí vận chuyển sẽ được tính tại checkout. Thời gian giao hàng ước tính từ 2-5 ngày làm việc.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>7. Chính sách Hoàn trả & Đổi trả</h2>
          <p>Chúng tôi cung cấp nước rửa 30 ngày. Sản phẩm phải:</p>
          <ul style={{ marginLeft: 20 }}>
            <li>Chưa sử dụng hoặc hư hỏng</li>
            <li>Có hóa đơn gốc</li>
            <li>Được gửi lại trong 30 ngày</li>
          </ul>
          <p>Chi phí vận chuyển hoàn trả do khách hàng chịu (trừ lỗi kỹ thuật).</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>8. Giới hạn Trách nhiệm</h2>
          <p>Trong giới hạn tối đa của luật, chúng tôi không chịu trách nhiệm cho:</p>
          <ul style={{ marginLeft: 20 }}>
            <li>Thất thoát lợi nhuận hoặc doanh thu</li>
            <li>Tổn thất dữ liệu</li>
            <li>Các thiệt hại gián tiếp</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2>9. Liên hệ chúng tôi</h2>
          <p>Nếu bạn có câu hỏi, vui lòng liên hệ:</p>
          <p>Email: support@kidzone.vn</p>
          <p>Điện thoại: [Số điện thoại]</p>
          <p>Địa chỉ: [Địa chỉ công ty]</p>
        </section>

        <section>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Các điều khoản này có thể thay đổi bất cứ lúc nào mà không có thông báo trước.</p>
        </section>
      </div>
    </div>
  )
}
