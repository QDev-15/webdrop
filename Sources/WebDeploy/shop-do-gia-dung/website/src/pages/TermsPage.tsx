import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  const { settings } = useSite()

  useDocumentMeta({
    title: `Điều khoản sử dụng – ${String(settings.site_name || 'Shop Đồ Gia Dụng')}`,
    description: 'Điều khoản và điều kiện sử dụng dịch vụ mua sắm tại cửa hàng đồ gia dụng của chúng tôi.',
  })

  const siteName = String(settings.site_name || 'Shop Đồ Gia Dụng')
  const sitePhone = String(settings.site_phone || '')

  return (
    <>
      <div className="dg-page-hero">
        <div className="dg-container">
          <p className="dg-page-hero__label">Pháp lý</p>
          <h1 className="dg-page-hero__title">Điều khoản sử dụng</h1>
          <p className="dg-page-hero__sub">Các điều khoản và điều kiện áp dụng khi mua sắm tại cửa hàng</p>
        </div>
      </div>

      <section className="dg-section">
        <div className="dg-container">
          <div className="dg-legal">
            <p className="dg-legal__date">Ngày cập nhật: 01/01/2025</p>

            <p>Khi sử dụng website và dịch vụ của {siteName}, bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây.</p>

            <h2>1. Chấp nhận điều khoản</h2>
            <p>Bằng cách truy cập và sử dụng website này, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý với tất cả các điều khoản và điều kiện được nêu trong tài liệu này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.</p>

            <h2>2. Sản phẩm và giá cả</h2>
            <ul>
              <li>Tất cả sản phẩm được mô tả chính xác theo thông tin từ nhà sản xuất và nhà phân phối</li>
              <li>Giá sản phẩm có thể thay đổi mà không cần thông báo trước</li>
              <li>Giá đã bao gồm thuế VAT theo quy định hiện hành</li>
              <li>Chúng tôi bảo lưu quyền hủy đơn hàng nếu phát hiện lỗi về giá</li>
              <li>Hình ảnh sản phẩm chỉ mang tính minh họa, màu sắc thực tế có thể khác nhau tùy màn hình</li>
            </ul>

            <h2>3. Đặt hàng và thanh toán</h2>
            <p>Khi đặt hàng, bạn cam kết:</p>
            <ul>
              <li>Cung cấp thông tin chính xác, đầy đủ về địa chỉ giao hàng và thông tin liên lạc</li>
              <li>Thanh toán đúng hạn theo phương thức đã chọn</li>
              <li>Không sử dụng thông tin thanh toán giả mạo hoặc của người khác</li>
            </ul>

            <h2>4. Giao hàng</h2>
            <ul>
              <li>Thời gian giao hàng: 1–5 ngày làm việc tùy khu vực</li>
              <li>Miễn phí giao hàng cho đơn từ 500.000đ trên toàn quốc</li>
              <li>Chúng tôi không chịu trách nhiệm về sự chậm trễ do nguyên nhân khách quan (thiên tai, đình công...)</li>
              <li>Khách hàng có trách nhiệm kiểm tra hàng hóa khi nhận và xác nhận tình trạng sản phẩm</li>
            </ul>

            <h2>5. Đổi trả và hoàn tiền</h2>
            <ul>
              <li>Được đổi trả trong vòng <strong>30 ngày</strong> kể từ ngày nhận hàng nếu sản phẩm lỗi do nhà sản xuất</li>
              <li>Sản phẩm phải còn nguyên vẹn, đầy đủ phụ kiện và hộp đựng</li>
              <li>Không áp dụng đổi trả với sản phẩm đã qua sử dụng hoặc bị hư hỏng do người dùng</li>
              <li>Hoàn tiền sẽ được thực hiện trong vòng 7–10 ngày làm việc</li>
            </ul>

            <h2>6. Sở hữu trí tuệ</h2>
            <p>Tất cả nội dung trên website bao gồm hình ảnh, văn bản, logo, thương hiệu đều thuộc quyền sở hữu của {siteName} hoặc đối tác. Không được sao chép, phân phối hay sử dụng thương mại mà không có sự cho phép.</p>

            <h2>7. Giới hạn trách nhiệm</h2>
            <p>Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp, ngẫu nhiên hoặc mang tính hậu quả phát sinh từ việc sử dụng sản phẩm hoặc dịch vụ của chúng tôi, vượt quá giá trị đơn hàng thực tế.</p>

            <h2>8. Luật áp dụng</h2>
            <p>Điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.</p>

            <h2>9. Liên hệ</h2>
            <p>
              Nếu có thắc mắc về điều khoản này, vui lòng liên hệ với chúng tôi:
              {sitePhone && <> qua số điện thoại <strong>{sitePhone}</strong></>}.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
