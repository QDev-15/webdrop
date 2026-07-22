import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({
    title: 'Điều Khoản Sử Dụng — PhotoPro Máy Ảnh & Thiết Bị Nhiếp Ảnh',
    description: 'Điều khoản sử dụng website và dịch vụ tại PhotoPro — đặt hàng, thanh toán, đổi trả, bảo hành, trách nhiệm các bên.',
  })

  const { settings } = useSite()
  const siteName = settings.site_name || 'PhotoPro'

  return (
    <>
      <section className="ma-page-hero">
        <div className="ma-container">
          <div className="ma-breadcrumb">
            <Link to="/">Trang chủ</Link><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /><span>Điều khoản sử dụng</span>
          </div>
          <h1 className="ma-page-title">Điều Khoản Sử Dụng</h1>
          <p className="ma-page-count">Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng website và dịch vụ của {siteName}.</p>
        </div>
      </section>

      <main>
        <section className="ma-sec">
          <div className="ma-container">
            <div className="ma-article" data-reveal>
              <p className="ma-article-meta">Cập nhật lần cuối: 22/07/2026</p>

              <p>
                Khi truy cập website, đặt mua thiết bị hoặc sử dụng dịch vụ kỹ thuật (sửa chữa, vệ sinh cảm biến,
                cho thuê thiết bị) tại <strong>{siteName}</strong>, khách hàng đồng ý tuân thủ toàn bộ điều khoản sử
                dụng dưới đây. Nếu không đồng ý với bất kỳ nội dung nào, vui lòng ngừng sử dụng dịch vụ.
              </p>

              <h2>1. Điều khoản đặt hàng &amp; thanh toán</h2>
              <ul>
                <li>Đơn hàng chỉ được xác nhận sau khi khách hàng hoàn tất thông tin đặt hàng và nhận email/tin nhắn xác nhận</li>
                <li>Giá thiết bị hiển thị trên website đã bao gồm thuế (nếu có) và có thể thay đổi mà không cần báo trước theo biến động tỷ giá, chính sách hãng</li>
                <li>Chấp nhận thanh toán qua chuyển khoản ngân hàng (SePay), ví điện tử, thẻ tín dụng hoặc thanh toán khi nhận hàng (COD)</li>
                <li>{siteName} có quyền hủy đơn hàng trong trường hợp phát hiện gian lận, sai sót giá niêm yết hoặc thông tin đặt hàng không chính xác</li>
              </ul>

              <h2>2. Chính sách đổi trả &amp; bảo hành thiết bị (tham chiếu)</h2>
              <p>
                Thân máy và ống kính được hỗ trợ đổi trả trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng nếu
                còn nguyên tem chống hàng giả, đầy đủ phụ kiện và lỗi thuộc về nhà sản xuất. Bảo hành chính hãng áp
                dụng <strong>24 tháng</strong> cho thân máy/ống kính và <strong>12 tháng</strong> cho phụ kiện (flash,
                tripod, balo). Chi tiết điều kiện, quy trình đổi trả — bảo hành và các trường hợp không áp dụng vui
                lòng xem tại trang <Link to="/lien-he">Liên hệ</Link> hoặc liên hệ trực tiếp bộ phận kỹ thuật để được
                hướng dẫn cụ thể.
              </p>

              <h2>3. Trách nhiệm các bên</h2>
              <p><strong>Đối với {siteName}:</strong></p>
              <ul>
                <li>Đảm bảo cung cấp thông tin thiết bị chính xác, trung thực — nguồn gốc nhập khẩu chính ngạch</li>
                <li>Kiểm định 100% máy trước khi giao, giao đúng số lượng và trong thời gian cam kết</li>
                <li>Bảo mật thông tin cá nhân của khách hàng theo <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
              </ul>
              <p><strong>Đối với khách hàng:</strong></p>
              <ul>
                <li>Cung cấp thông tin đặt hàng chính xác (họ tên, số điện thoại, địa chỉ giao hàng)</li>
                <li>Thanh toán đầy đủ giá trị đơn hàng theo phương thức đã chọn</li>
                <li>Kiểm tra tình trạng thiết bị, tem bảo hành khi nhận hàng và phản hồi kịp thời nếu có sai sót</li>
              </ul>

              <h2>4. Quyền sở hữu trí tuệ nội dung website</h2>
              <p>
                Toàn bộ nội dung trên website — bao gồm hình ảnh sản phẩm, thông số kỹ thuật, logo, bài viết, thiết
                kế giao diện — thuộc quyền sở hữu của <strong>{siteName}</strong> hoặc được cấp phép sử dụng hợp
                pháp từ các thương hiệu phân phối. Nghiêm cấm sao chép, phân phối lại hoặc sử dụng cho mục đích
                thương mại khi chưa có sự đồng ý bằng văn bản.
              </p>

              <h2>5. Thay đổi điều khoản</h2>
              <p>
                {siteName} có quyền cập nhật, chỉnh sửa các điều khoản sử dụng này bất kỳ lúc nào nhằm phù hợp với
                quy định pháp luật và chính sách kinh doanh. Phiên bản điều khoản mới nhất luôn được đăng tải trên
                trang này — khách hàng nên kiểm tra định kỳ để nắm thông tin cập nhật.
              </p>

              <h2>6. Luật áp dụng &amp; giải quyết tranh chấp</h2>
              <p>
                Điều khoản sử dụng này được điều chỉnh theo pháp luật Việt Nam. Mọi tranh chấp phát sinh liên quan
                đến việc sử dụng website, mua bán hoặc dịch vụ kỹ thuật sẽ được ưu tiên giải quyết thông qua thương
                lượng, hòa giải. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra cơ quan tài phán có
                thẩm quyền theo quy định pháp luật hiện hành.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
