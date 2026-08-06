import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'OFFICEHUB'

  useDocumentMeta({
    title: `Điều khoản sử dụng — ${siteName}`,
    description: `Điều khoản sử dụng dịch vụ của ${siteName} — quy định về tài khoản, đặt hàng, thanh toán, giao hàng và đổi trả.`,
  })

  return (
    <>
      <div className="vp-page-header">
        <div className="vp-container">
          <nav aria-label="Breadcrumb" className="vp-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>›</span>
            <span aria-current="page">Điều khoản sử dụng</span>
          </nav>
          <h1>Điều khoản sử dụng</h1>
          <p>Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </div>

      <div className="vp-legal-wrap">
        <div className="vp-container">
          <div className="vp-legal-content">
            <section className="vp-legal-section">
              <h2>1. Chấp nhận điều khoản</h2>
              <p>Bằng cách truy cập và sử dụng website {siteName}, bạn đồng ý tuân thủ và chịu ràng buộc bởi các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, vui lòng không sử dụng dịch vụ của chúng tôi.</p>
            </section>

            <section className="vp-legal-section">
              <h2>2. Mô tả dịch vụ</h2>
              <p>{siteName} là nền tảng thương mại điện tử chuyên cung cấp văn phòng phẩm chính hãng bao gồm: bút viết, sổ tay, giấy note, file & kẹp tài liệu, dụng cụ văn phòng, balo và túi laptop. Chúng tôi cung cấp dịch vụ mua sắm trực tuyến và dịch vụ cung ứng cho doanh nghiệp.</p>
            </section>

            <section className="vp-legal-section">
              <h2>3. Tài khoản người dùng</h2>
              <ul>
                <li>Bạn có trách nhiệm bảo mật thông tin đăng nhập tài khoản của mình</li>
                <li>Không được chia sẻ tài khoản với người khác hoặc tạo nhiều tài khoản cho cùng một người</li>
                <li>Thông báo ngay cho chúng tôi nếu phát hiện hành vi truy cập trái phép vào tài khoản</li>
                <li>Chúng tôi có quyền tạm khóa hoặc xóa tài khoản vi phạm điều khoản</li>
              </ul>
            </section>

            <section className="vp-legal-section">
              <h2>4. Đặt hàng và thanh toán</h2>
              <h3>4.1. Xác nhận đơn hàng</h3>
              <p>Đơn hàng được xem là hợp lệ sau khi chúng tôi gửi email xác nhận và kiểm tra còn hàng. Chúng tôi có quyền từ chối hoặc hủy đơn hàng nếu phát hiện gian lận, thông tin không chính xác, hoặc sản phẩm hết hàng.</p>
              <h3>4.2. Giá cả</h3>
              <p>Giá sản phẩm trên website đã bao gồm VAT (nếu áp dụng). Phí vận chuyển được tính riêng và hiển thị tại trang thanh toán. Giá có thể thay đổi mà không cần báo trước — giá áp dụng là giá tại thời điểm đặt hàng.</p>
              <h3>4.3. Phương thức thanh toán</h3>
              <p>Chúng tôi chấp nhận: chuyển khoản ngân hàng qua SePay (quét mã QR, xác nhận tự động) và thanh toán khi nhận hàng (COD).</p>
            </section>

            <section className="vp-legal-section">
              <h2>5. Giao hàng</h2>
              <ul>
                <li>Thời gian giao hàng: 2–4 giờ nội thành, 1–3 ngày tỉnh thành (ngày làm việc)</li>
                <li>Phí vận chuyển: miễn phí đơn từ 500.000₫, dưới 500.000₫ tính theo khoảng cách</li>
                <li>Chúng tôi không chịu trách nhiệm với chậm trễ do thiên tai, đình công, hoặc yếu tố bất khả kháng</li>
                <li>Vui lòng kiểm tra hàng trước khi ký nhận — từ chối nhận nếu hàng bị hư hỏng rõ ràng</li>
              </ul>
            </section>

            <section className="vp-legal-section">
              <h2>6. Chính sách đổi trả và hoàn tiền</h2>
              <h3>6.1. Điều kiện đổi trả</h3>
              <ul>
                <li>Sản phẩm lỗi sản xuất: đổi/trả trong 30 ngày kể từ ngày nhận hàng</li>
                <li>Sản phẩm không đúng mô tả: đổi/trả trong 7 ngày</li>
                <li>Sản phẩm phải còn nguyên vẹn, đầy đủ phụ kiện, không có dấu hiệu đã qua sử dụng</li>
                <li>Giữ nguyên bao bì gốc và hóa đơn mua hàng</li>
              </ul>
              <h3>6.2. Trường hợp không áp dụng đổi trả</h3>
              <ul>
                <li>Sản phẩm bị hư hỏng do người dùng (rơi vỡ, ướt, tự sửa chữa)</li>
                <li>Sản phẩm đã mở seal/tem bảo hành (với sản phẩm có seal)</li>
                <li>Sản phẩm khuyến mãi ghi rõ "không áp dụng đổi trả"</li>
              </ul>
              <h3>6.3. Hoàn tiền</h3>
              <p>Hoàn tiền trong 3–5 ngày làm việc qua cùng phương thức thanh toán ban đầu. Nếu COD, hoàn tiền qua chuyển khoản ngân hàng.</p>
            </section>

            <section className="vp-legal-section">
              <h2>7. Sở hữu trí tuệ</h2>
              <p>Toàn bộ nội dung website {siteName} bao gồm: logo, hình ảnh, mô tả sản phẩm, thiết kế giao diện là tài sản trí tuệ của {siteName} hoặc đối tác cấp phép. Nghiêm cấm sao chép, phân phối lại hoặc sử dụng thương mại khi chưa được phép bằng văn bản.</p>
            </section>

            <section className="vp-legal-section">
              <h2>8. Giới hạn trách nhiệm</h2>
              <p>Trong phạm vi tối đa được pháp luật cho phép, {siteName} không chịu trách nhiệm về thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả phát sinh từ việc sử dụng dịch vụ. Trách nhiệm tối đa của chúng tôi trong mọi trường hợp không vượt quá giá trị đơn hàng liên quan.</p>
            </section>

            <section className="vp-legal-section">
              <h2>9. Luật áp dụng</h2>
              <p>Các Điều khoản sử dụng này được điều chỉnh và giải thích theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án có thẩm quyền tại Thành phố Hồ Chí Minh.</p>
            </section>

            <section className="vp-legal-section">
              <h2>10. Liên hệ</h2>
              <p>Mọi câu hỏi về Điều khoản sử dụng, vui lòng liên hệ:</p>
              <ul>
                {settings.site_email && <li>Email: <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></li>}
                {settings.site_phone && <li>Điện thoại: <a href={`tel:${settings.site_phone.replace(/\s/g, '')}`}>{settings.site_phone}</a></li>}
                {settings.site_address && <li>Địa chỉ: {settings.site_address}</li>}
              </ul>
            </section>

            <div className="vp-legal-back">
              <Link to="/" className="vp-btn vp-btn-outline">← Quay lại trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
