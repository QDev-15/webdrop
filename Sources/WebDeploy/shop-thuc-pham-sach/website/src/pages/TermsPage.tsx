import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function TermsPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Tươi Mỗi Ngày'

  return (
    <>
      <div className="tp-container tp-contact-wrap" style={{ paddingBottom: 40, paddingTop: 128 }}>
        <div className="tp-breadcrumb" style={{ marginBottom: 24 }}>
          <Link to="/">Trang chủ</Link>
          <i className="bi bi-chevron-right" style={{ fontSize: 10 }} />
          <span>Điều khoản sử dụng</span>
        </div>
        <h1 style={{ fontSize: 'clamp(28px,3.6vw,42px)', fontWeight: 700, marginBottom: 12 }}>
          Điều Khoản <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>Sử Dụng</em>
        </h1>
        <p style={{ color: 'var(--text-2)', maxWidth: 560 }}>
          Quy định áp dụng khi bạn truy cập, đặt hàng và sử dụng dịch vụ của {siteName}.
        </p>
      </div>

      <main>
        <section className="tp-sec" style={{ paddingTop: 24 }}>
          <div className="tp-container-sm">
            <article className="tp-legal" data-reveal>
              <p className="tp-legal-updated">Cập nhật lần cuối: 17/07/2026</p>
              <p className="tp-legal-intro">
                Khi truy cập và sử dụng website của {siteName}, bạn đồng ý tuân thủ các điều khoản sử dụng được nêu
                dưới đây. Vui lòng đọc kỹ trước khi đặt hàng. Nếu không đồng ý với bất kỳ điều khoản nào, vui lòng
                ngừng sử dụng website và dịch vụ của chúng tôi.
              </p>

              <h2>1. Điều khoản đặt hàng &amp; thanh toán</h2>
              <ul>
                <li>Khách hàng có trách nhiệm cung cấp thông tin chính xác (họ tên, số điện thoại, địa chỉ giao hàng) khi đặt hàng để đảm bảo quá trình giao nhận thực phẩm diễn ra thuận lợi.</li>
                <li>Đơn hàng được xác nhận sau khi {siteName} kiểm tra tồn kho và liên hệ xác nhận với khách hàng (qua điện thoại/email/Zalo).</li>
                <li>{siteName} hỗ trợ các hình thức thanh toán: thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay), thẻ VISA/MasterCard qua cổng thanh toán bảo mật.</li>
                <li>Giá sản phẩm hiển thị trên website có thể thay đổi theo mùa vụ mà không cần báo trước; giá áp dụng là giá tại thời điểm đặt hàng được xác nhận.</li>
                <li>{siteName} có quyền từ chối hoặc hủy đơn hàng trong trường hợp phát hiện gian lận, thông tin không chính xác hoặc hết hàng do biến động nguồn cung nông sản.</li>
              </ul>

              <h2>2. Chính sách đổi trả</h2>
              <p>
                Do đặc thù sản phẩm thực phẩm tươi sống, việc đổi trả được thực hiện theo chính sách đổi trả hiện
                hành của {siteName} — áp dụng ngay tại thời điểm nhận hàng nếu sản phẩm không đạt yêu cầu về chất
                lượng, hư hỏng trong quá trình vận chuyển hoặc giao sai sản phẩm. Vui lòng liên hệ hotline hoặc
                trang <Link to="/lien-he">Liên hệ</Link> ngay khi nhận hàng để được hướng dẫn chi tiết quy trình đổi
                trả/hoàn tiền.
              </p>

              <h2>3. Trách nhiệm các bên</h2>
              <p><strong>Trách nhiệm của {siteName}:</strong></p>
              <ul>
                <li>Cung cấp thông tin sản phẩm chính xác, trung thực về nguồn gốc, quy trình bảo quản, giá cả và tình trạng còn hàng.</li>
                <li>Giao hàng đúng khung giờ cam kết, duy trì chuỗi lạnh khép kín để đảm bảo độ tươi ngon khi đến tay khách hàng.</li>
                <li>Bảo mật thông tin cá nhân của khách hàng theo <Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link>.</li>
              </ul>
              <p><strong>Trách nhiệm của khách hàng:</strong></p>
              <ul>
                <li>Cung cấp thông tin đặt hàng chính xác và kiểm tra sản phẩm ngay khi nhận hàng.</li>
                <li>Thanh toán đầy đủ giá trị đơn hàng theo hình thức đã lựa chọn.</li>
                <li>Không sử dụng website vào mục đích vi phạm pháp luật hoặc gây ảnh hưởng đến hoạt động của {siteName} và bên thứ ba.</li>
              </ul>

              <h2>4. Quyền sở hữu trí tuệ</h2>
              <p>
                Toàn bộ nội dung trên website — bao gồm hình ảnh, văn bản, logo, thiết kế giao diện, mã nguồn — thuộc
                quyền sở hữu của {siteName} hoặc được cấp phép sử dụng hợp pháp. Nghiêm cấm sao chép, phân phối lại
                hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản của {siteName}.
              </p>

              <h2>5. Thay đổi điều khoản</h2>
              <p>
                {siteName} có quyền cập nhật, chỉnh sửa các điều khoản sử dụng này bất kỳ lúc nào nhằm phù hợp với
                hoạt động kinh doanh và quy định pháp luật hiện hành. Phiên bản mới sẽ được đăng tải trên trang này
                kèm ngày cập nhật; việc tiếp tục sử dụng website sau khi thay đổi được xem là đồng ý với điều khoản
                mới.
              </p>

              <h2>6. Luật áp dụng &amp; giải quyết tranh chấp</h2>
              <p>
                Điều khoản sử dụng này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi tranh chấp phát
                sinh trong quá trình sử dụng website hoặc dịch vụ sẽ được ưu tiên giải quyết thông qua thương lượng,
                hòa giải; nếu không đạt được thỏa thuận, tranh chấp sẽ được đưa ra cơ quan tài phán có thẩm quyền
                theo quy định pháp luật Việt Nam.
              </p>

              <div className="tp-legal-contact-box">
                <p><strong>Mọi thắc mắc về Điều khoản sử dụng, vui lòng liên hệ:</strong></p>
                {settings.site_email && <p>Email: <a href={`mailto:${settings.site_email}`}>{settings.site_email}</a></p>}
                {settings.site_phone && <p>Điện thoại/Zalo: <a href={`tel:${settings.site_phone}`}>{settings.site_phone}</a></p>}
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
