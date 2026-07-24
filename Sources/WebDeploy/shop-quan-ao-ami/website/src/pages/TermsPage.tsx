import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'AMI Fashion'
  const email = settings.site_email || 'hello@amifashion.vn'
  const phone = settings.site_phone || '0909 345 678'
  const address = settings.site_address || '12 Lê Văn Sỹ, Quận 3, TP.HCM'

  useDocumentMeta({
    title: `Điều khoản sử dụng — ${siteName}`,
    description: `Điều khoản sử dụng dịch vụ của ${siteName} — điều kiện đặt hàng, thanh toán, giao hàng, đổi trả và bảo hành.`,
  })

  return (
    <main className="am-page-body">
      <div className="am-container">
        <div className="am-legal-wrap">
          <h1>Điều khoản sử dụng</h1>
          <span className="am-last-updated">Cập nhật lần cuối: Tháng 1, 2025</span>

          <p>Bằng việc truy cập và sử dụng website {siteName}, bạn đồng ý tuân theo các điều khoản và điều kiện được quy định dưới đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ của chúng tôi.</p>

          <h2>1. Điều kiện đặt hàng</h2>
          <p>Để đặt hàng tại {siteName}, bạn cần:</p>
          <ul>
            <li>Từ 16 tuổi trở lên (hoặc có sự đồng ý của phụ huynh/người giám hộ nếu dưới 16 tuổi).</li>
            <li>Cung cấp thông tin giao hàng chính xác và đầy đủ.</li>
            <li>Có phương thức thanh toán hợp lệ.</li>
          </ul>
          <p>Đơn hàng được coi là hợp lệ sau khi chúng tôi xác nhận qua email hoặc điện thoại.</p>

          <h2>2. Giá cả và thanh toán</h2>
          <ul>
            <li>Giá sản phẩm được hiển thị đã bao gồm VAT.</li>
            <li>{siteName} có quyền thay đổi giá sản phẩm mà không báo trước — giá áp dụng là giá tại thời điểm đặt hàng.</li>
            <li>Chúng tôi chấp nhận thanh toán qua chuyển khoản ngân hàng, tiền mặt khi nhận hàng (COD) và các phương thức được liệt kê tại thời điểm thanh toán.</li>
            <li>Đơn hàng sẽ được xử lý sau khi thanh toán được xác nhận (với thanh toán trước).</li>
          </ul>

          <h2>3. Giao hàng</h2>
          <ul>
            <li>Thời gian giao hàng dự kiến: 2–5 ngày làm việc tùy khu vực.</li>
            <li>Phí vận chuyển: Miễn phí cho đơn hàng từ 599.000₫. Đơn dưới 599.000₫ phí ship 30.000₫.</li>
            <li>{siteName} không chịu trách nhiệm về sự chậm trễ giao hàng do nguyên nhân ngoài tầm kiểm soát (thiên tai, lỗi đơn vị vận chuyển, địa chỉ không chính xác...).</li>
            <li>Vui lòng kiểm tra hàng trước khi ký nhận. Từ chối nhận hàng nếu kiện hàng bị hư hỏng nặng và thông báo cho chúng tôi.</li>
          </ul>

          <h2>4. Chính sách đổi trả</h2>
          <p>Chúng tôi chấp nhận đổi trả trong vòng <strong>30 ngày</strong> kể từ ngày nhận hàng, với điều kiện:</p>
          <ul>
            <li>Sản phẩm còn nguyên tem, nhãn, chưa qua sử dụng, giặt hoặc chỉnh sửa.</li>
            <li>Có hóa đơn/xác nhận đơn hàng.</li>
            <li>Lý do đổi trả hợp lệ: lỗi sản phẩm, sai size, sai màu, sai sản phẩm so với đơn hàng.</li>
          </ul>
          <p>Các trường hợp KHÔNG được đổi trả:</p>
          <ul>
            <li>Sản phẩm đã qua sử dụng, bị dính bẩn hoặc có dấu hiệu đã giặt.</li>
            <li>Sản phẩm trong chương trình khuyến mãi đặc biệt ghi rõ "Không đổi trả".</li>
            <li>Đổi trả do thay đổi ý kiến sau 30 ngày.</li>
          </ul>
          <p>Để yêu cầu đổi trả, vui lòng liên hệ chúng tôi qua trang Liên hệ hoặc Zalo trong thời hạn quy định.</p>

          <h2>5. Chất lượng và bảo hành</h2>
          <ul>
            <li>{siteName} cam kết tất cả sản phẩm là hàng chính hãng, đúng như mô tả.</li>
            <li>Chúng tôi bảo hành chất liệu vải trong <strong>6 tháng</strong> kể từ ngày mua — bao gồm lỗi đường may, lỗi vải do sản xuất.</li>
            <li>Bảo hành KHÔNG áp dụng cho hao mòn tự nhiên theo thời gian, hư hỏng do sử dụng sai cách.</li>
          </ul>

          <h2>6. Sở hữu trí tuệ</h2>
          <p>Toàn bộ nội dung trên website bao gồm hình ảnh sản phẩm, nội dung bài viết, thiết kế và logo {siteName} là tài sản của {siteName}. Nghiêm cấm sao chép, tái sử dụng cho mục đích thương mại mà không có sự đồng ý bằng văn bản.</p>

          <h2>7. Giới hạn trách nhiệm</h2>
          <p>{siteName} không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng website và dịch vụ của chúng tôi, bao gồm nhưng không giới hạn: mất dữ liệu, gián đoạn kinh doanh, hoặc thiệt hại gián tiếp khác.</p>

          <h2>8. Thay đổi điều khoản</h2>
          <p>{siteName} có quyền cập nhật điều khoản sử dụng bất kỳ lúc nào. Điều khoản cập nhật có hiệu lực ngay khi được đăng tải. Việc tiếp tục sử dụng website sau khi thay đổi nghĩa là bạn chấp nhận điều khoản mới.</p>

          <h2>9. Luật áp dụng</h2>
          <p>Các điều khoản này được điều chỉnh theo pháp luật Việt Nam. Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại TP.HCM.</p>

          <h2>10. Liên hệ</h2>
          <p>Nếu bạn có câu hỏi về điều khoản sử dụng, vui lòng liên hệ với chúng tôi qua:</p>
          <ul>
            <li>Email: {email}</li>
            <li>Điện thoại: {phone}</li>
            <li>Địa chỉ: {address}</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
