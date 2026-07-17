import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function TermsPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'Nova Store'

  return (
    <>
      <section className="st-page-hero" aria-label="Tiêu đề trang">
        <div className="st-container">
          <nav className="st-breadcrumb mb-3" aria-label="Điều hướng">
            <Link to="/">Trang chủ</Link>
            <span className="st-breadcrumb-sep">/</span>
            <span>Điều khoản sử dụng</span>
          </nav>
          <h1 className="st-page-title">Điều Khoản<br />Sử Dụng</h1>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 14, fontWeight: 600, maxWidth: 460, marginTop: 8 }}>
            Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng dịch vụ và đặt hàng tại {siteName}.
          </p>
        </div>
      </section>

      <section className="st-sec" aria-labelledby="terms-heading">
        <div className="st-container">
          <div className="st-article" data-reveal>
            <p className="st-article-meta">Cập nhật lần cuối: 17/07/2026</p>

            <p>
              Khi truy cập và sử dụng website <strong>{siteName}</strong>, khách hàng đồng ý tuân thủ toàn bộ
              điều khoản sử dụng được nêu dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
            </p>

            <h2 id="terms-heading">1. Đặt hàng &amp; thanh toán</h2>
            <p>
              Đơn hàng chỉ được xác nhận sau khi khách hàng hoàn tất thông tin đặt hàng và {siteName} xác nhận
              tình trạng còn hàng. Giá sản phẩm hiển thị trên website là giá đã bao gồm các loại thuế áp dụng
              (nếu có) tại thời điểm đặt hàng. Thanh toán được thực hiện qua các hình thức: chuyển khoản ngân hàng,
              ví điện tử (MoMo, ZaloPay) hoặc thanh toán khi nhận hàng (COD).
            </p>

            <h2>2. Chính sách đổi trả</h2>
            <p>
              Sản phẩm được hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu còn nguyên tem, nhãn,
              chưa qua sử dụng và có hóa đơn mua hàng hợp lệ. Chi tiết điều kiện đổi trả tham khảo tại trang{' '}
              <Link to="/lien-he">Liên hệ</Link> hoặc chính sách{' '}
              <Link to="/chinh-sach-bao-mat">bảo mật thông tin</Link> liên quan.
            </p>

            <h2>3. Trách nhiệm các bên</h2>
            <p>
              {siteName} có trách nhiệm cung cấp thông tin sản phẩm chính xác, giao hàng đúng cam kết và bảo mật
              thông tin khách hàng. Khách hàng có trách nhiệm cung cấp thông tin đặt hàng chính xác, trung thực
              và thanh toán đầy đủ giá trị đơn hàng theo hình thức đã chọn.
            </p>

            <h2>4. Quyền sở hữu trí tuệ</h2>
            <p>
              Toàn bộ nội dung trên website — bao gồm hình ảnh, văn bản, logo, thiết kế giao diện — thuộc quyền
              sở hữu của {siteName}. Nghiêm cấm sao chép, phân phối lại dưới bất kỳ hình thức nào khi chưa được
              sự đồng ý bằng văn bản.
            </p>

            <h2>5. Thay đổi điều khoản</h2>
            <p>
              {siteName} có quyền cập nhật, điều chỉnh điều khoản sử dụng bất kỳ lúc nào mà không cần báo trước.
              Điều khoản mới nhất luôn được đăng tải công khai tại trang này và có hiệu lực ngay khi đăng tải.
            </p>

            <h2>6. Luật áp dụng &amp; giải quyết tranh chấp</h2>
            <p>
              Mọi tranh chấp phát sinh liên quan đến việc sử dụng dịch vụ sẽ được giải quyết trên cơ sở thương
              lượng, hòa giải. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra giải quyết theo
              quy định pháp luật hiện hành tại Việt Nam.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
