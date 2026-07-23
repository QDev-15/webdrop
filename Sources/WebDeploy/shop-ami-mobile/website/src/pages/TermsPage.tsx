import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'AMI Mobile'
  useDocumentMeta({
    title: `Điều khoản sử dụng — ${siteName}`,
    description: `Điều khoản sử dụng dịch vụ ${siteName} — quyền và nghĩa vụ của khách hàng khi mua sắm tại ${siteName}.`,
  })

  const returnDays = settings.return_days || '7'

  return (
    <>
      <div className="mb-page-hero">
        <div className="mb-container">
          <div className="mb-breadcrumb">
            <Link to="/">Trang chủ</Link><span>/</span><span>Điều khoản sử dụng</span>
          </div>
          <div className="mb-label mb-page-hero-label">Pháp lý</div>
          <h1>Điều khoản <em>sử dụng</em></h1>
        </div>
      </div>

      <section className="mb-sec mb-legal-sec">
        <div className="mb-container">
          <div className="mb-legal-content">
            <p className="mb-legal-updated">Cập nhật lần cuối: 2026</p>

            <h2>1. Chấp nhận điều khoản</h2>
            <p>Bằng cách truy cập và sử dụng website {siteName}, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. Nếu không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.</p>

            <h2>2. Điều kiện mua hàng</h2>
            <p>Khi đặt hàng tại {siteName}, bạn xác nhận:</p>
            <ul>
              <li>Bạn từ 18 tuổi trở lên hoặc có sự đồng ý của người giám hộ hợp pháp.</li>
              <li>Thông tin cung cấp là chính xác và đầy đủ.</li>
              <li>Bạn có quyền sử dụng phương thức thanh toán đã chọn.</li>
            </ul>

            <h2>3. Giá cả và thanh toán</h2>
            <p>Giá sản phẩm được hiển thị trên website là giá đã bao gồm VAT (nếu có). Chúng tôi có quyền thay đổi giá mà không cần báo trước. Giá tại thời điểm xác nhận đơn hàng là giá áp dụng.</p>
            <ul>
              <li>Thanh toán khi nhận hàng (COD) — áp dụng toàn quốc.</li>
              <li>Chuyển khoản qua SePay — xác nhận đơn tự động sau khi nhận tiền.</li>
            </ul>

            <h2>4. Vận chuyển và giao hàng</h2>
            <ul>
              <li>Giao hàng nội thành: 2–4 giờ (trong giờ hành chính).</li>
              <li>Giao hàng toàn quốc: 2–5 ngày làm việc qua đơn vị vận chuyển uy tín.</li>
              <li>Miễn phí vận chuyển cho đơn hàng đạt giá trị tối thiểu (xem chi tiết khi thanh toán).</li>
            </ul>

            <h2>5. Chính sách đổi trả</h2>
            <ul>
              <li>Đổi trả trong vòng {returnDays} ngày kể từ ngày nhận hàng (sản phẩm còn nguyên seal).</li>
              <li>Sản phẩm lỗi do nhà sản xuất: đổi mới 100% trong 30 ngày.</li>
              <li>Không áp dụng đổi trả với sản phẩm đã kích hoạt hoặc có dấu hiệu sử dụng.</li>
            </ul>

            <h2>6. Bảo hành</h2>
            <p>Tất cả sản phẩm được bảo hành theo chính sách của nhà sản xuất (thường {settings.warranty_months || '12'}–24 tháng). Thẻ bảo hành được cấp cùng sản phẩm. Bảo hành không áp dụng với: vỡ, bể màn hình, vào nước, tự ý sửa chữa.</p>

            <h2>7. Sở hữu trí tuệ</h2>
            <p>Toàn bộ nội dung trên website (hình ảnh, văn bản, logo) thuộc quyền sở hữu của {siteName}. Không được sao chép, phân phối hay sử dụng vì mục đích thương mại mà không có sự chấp thuận bằng văn bản.</p>

            <h2>8. Giới hạn trách nhiệm</h2>
            <p>{siteName} không chịu trách nhiệm về các thiệt hại gián tiếp phát sinh từ việc sử dụng sản phẩm. Trách nhiệm tối đa của chúng tôi không vượt quá giá trị đơn hàng bạn đã thanh toán.</p>

            <h2>9. Luật áp dụng</h2>
            <p>Các điều khoản này được điều chỉnh theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án có thẩm quyền.</p>

            <h2>10. Liên hệ</h2>
            <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ:</p>
            <ul>
              {settings.site_email && <li>Email: <a href={`mailto:${settings.site_email}`} style={{ color: 'var(--accent)' }}>{settings.site_email}</a></li>}
              {settings.site_phone && <li>Hotline: <a href={`tel:${settings.site_phone.replace(/\D/g, '')}`} style={{ color: 'var(--accent)' }}>{settings.site_phone}</a></li>}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
