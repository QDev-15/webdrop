import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({
    title: 'Điều khoản sử dụng — Lys Chic',
    description: 'Điều khoản sử dụng dịch vụ mua sắm tại Lys Chic — quy định về đặt hàng, thanh toán, đổi trả và quyền lợi khách hàng.',
  })
  const { settings } = useSite()
  const siteName = settings.site_name || 'Lys Chic'

  return (
    <>
      <div className="qa-page-header" style={{ paddingBottom: 32 }}>
        <div className="qa-container">
          <nav className="qa-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Điều khoản sử dụng</span>
          </nav>
          <h1 className="qa-page-title">Điều khoản sử dụng</h1>
          <p className="qa-page-count" style={{ fontSize: 16 }}>Quy định áp dụng khi mua sắm và sử dụng website {siteName}</p>
        </div>
      </div>

      <main>
        <section style={{ background: 'var(--surface)', padding: 'clamp(48px,7vw,88px) 0' }}>
          <div className="qa-container-sm">
            <div data-reveal style={{ fontSize: 15.5, color: 'var(--text-2)', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 28 }}>
                Khi truy cập và sử dụng website {siteName}, bạn đồng ý tuân thủ các điều khoản sử dụng dưới đây.
                Vui lòng đọc kỹ trước khi đặt hàng.
              </p>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>1. Đặt hàng & thanh toán</h2>
              <ul style={{ marginBottom: 20, paddingLeft: 22 }}>
                <li>Đơn hàng được xác nhận sau khi khách hàng hoàn tất thông tin đặt hàng và chọn phương thức thanh toán</li>
                <li>Phương thức thanh toán: thanh toán khi nhận hàng (COD) hoặc chuyển khoản ngân hàng qua SePay (quét mã QR, xác nhận tự động)</li>
                <li>Giá sản phẩm hiển thị trên website đã bao gồm các loại thuế áp dụng (nếu có), chưa bao gồm phí vận chuyển</li>
                <li>{siteName} có quyền từ chối hoặc hủy đơn hàng trong trường hợp thông tin đặt hàng không chính xác hoặc sản phẩm hết hàng</li>
              </ul>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>2. Đổi trả</h2>
              <p style={{ marginBottom: 20 }}>
                Áp dụng đổi size/mẫu miễn phí trong vòng 15 ngày kể từ ngày nhận hàng, sản phẩm phải còn nguyên tem mác, chưa qua sử dụng hoặc giặt ủi.
                Chi tiết điều kiện và quy trình đổi trả vui lòng tham khảo mục Câu hỏi thường gặp tại trang <Link to="/lien-he" style={{ color: 'var(--accent)' }}>Liên hệ</Link> hoặc liên hệ trực tiếp hotline/Zalo để được hỗ trợ.
              </p>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>3. Trách nhiệm các bên</h2>
              <p style={{ marginBottom: 12 }}><strong style={{ color: 'var(--text)' }}>Đối với {siteName}:</strong> đảm bảo cung cấp thông tin sản phẩm chính xác, giao hàng đúng thời gian cam kết, xử lý khiếu nại và đổi trả theo đúng chính sách công bố.</p>
              <p style={{ marginBottom: 20 }}><strong style={{ color: 'var(--text)' }}>Đối với khách hàng:</strong> cung cấp thông tin đặt hàng chính xác (họ tên, số điện thoại, địa chỉ giao hàng), kiểm tra sản phẩm khi nhận hàng và phối hợp trong quá trình đổi trả (nếu có).</p>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>4. Sở hữu trí tuệ</h2>
              <p style={{ marginBottom: 20 }}>
                Toàn bộ nội dung trên website bao gồm hình ảnh sản phẩm, logo, văn bản, thiết kế giao diện thuộc quyền sở hữu của {siteName}.
                Nghiêm cấm sao chép, sử dụng lại dưới bất kỳ hình thức nào cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.
              </p>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>5. Thay đổi điều khoản</h2>
              <p style={{ marginBottom: 20 }}>
                {siteName} có quyền cập nhật, điều chỉnh nội dung điều khoản sử dụng bất kỳ lúc nào mà không cần báo trước.
                Phiên bản điều khoản mới nhất sẽ được đăng tải trên trang này và có hiệu lực ngay khi công bố.
              </p>

              <h2 style={{ fontFamily: 'var(--heading)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)', marginBottom: 12, marginTop: 32 }}>6. Luật áp dụng & giải quyết tranh chấp</h2>
              <p style={{ marginBottom: 8 }}>
                Điều khoản sử dụng này được điều chỉnh theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết
                thông qua thương lượng, hòa giải; trường hợp không đạt được thỏa thuận sẽ được đưa ra cơ quan tài phán có thẩm quyền giải quyết.
              </p>
              <ul style={{ marginBottom: 8, paddingLeft: 22 }}>
                <li>Hotline: {settings.site_phone}</li>
                <li>Email: {settings.site_email}</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
