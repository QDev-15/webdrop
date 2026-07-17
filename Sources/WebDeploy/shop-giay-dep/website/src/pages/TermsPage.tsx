import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

const SECTIONS = [
  {
    title: '1. Đặt hàng & thanh toán',
    body: [
      'Khi đặt hàng trên website, khách hàng cần cung cấp thông tin chính xác về họ tên, số điện thoại và địa chỉ giao hàng để đảm bảo đơn hàng được xử lý và giao đúng.',
      'Đơn hàng được xác nhận sau khi hệ thống ghi nhận thông tin đặt hàng thành công. Chúng tôi hỗ trợ các hình thức thanh toán: thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, ví điện tử và thẻ quốc tế.',
      'Giá sản phẩm hiển thị trên website đã bao gồm các loại thuế/phí áp dụng (nếu có) và có thể thay đổi theo chương trình khuyến mãi tại từng thời điểm mà không cần báo trước.',
    ],
  },
  {
    title: '2. Đổi trả sản phẩm',
    body: [
      'Khách hàng được hỗ trợ đổi size miễn phí trong vòng 15 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên hộp, đầy đủ tem/nhãn và chưa qua sử dụng ngoài trời.',
      'Trường hợp sản phẩm lỗi do nhà sản xuất, khách hàng vui lòng liên hệ trong vòng 7 ngày kể từ ngày nhận hàng để được đổi mới hoặc hoàn tiền.',
      'Chi tiết điều kiện, quy trình đổi trả vui lòng tham khảo thêm tại trang Liên hệ hoặc liên hệ trực tiếp hotline để được hướng dẫn cụ thể.',
    ],
  },
  {
    title: '3. Trách nhiệm các bên',
    body: [
      'Chúng tôi cam kết cung cấp thông tin sản phẩm (kích thước, chất liệu, màu sắc) chính xác nhất có thể; tuy nhiên màu sắc thực tế có thể chênh lệch nhẹ so với hình ảnh do điều kiện màn hình hiển thị.',
      'Khách hàng có trách nhiệm kiểm tra kỹ thông tin đơn hàng (size, màu, số lượng, địa chỉ nhận hàng) trước khi xác nhận đặt hàng.',
      'Chúng tôi không chịu trách nhiệm với các thiệt hại phát sinh do khách hàng cung cấp thông tin sai lệch hoặc sử dụng sản phẩm không đúng hướng dẫn.',
    ],
  },
  {
    title: '4. Sở hữu trí tuệ',
    body: [
      'Toàn bộ nội dung trên website (hình ảnh sản phẩm, logo, bài viết, thiết kế giao diện) thuộc quyền sở hữu của chúng tôi hoặc được cấp phép sử dụng hợp pháp.',
      'Nghiêm cấm sao chép, phát tán hoặc sử dụng lại nội dung nêu trên cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.',
    ],
  },
  {
    title: '5. Thay đổi điều khoản',
    body: [
      'Chúng tôi có quyền cập nhật, chỉnh sửa điều khoản sử dụng bất kỳ lúc nào nhằm phù hợp với hoạt động kinh doanh và quy định pháp luật hiện hành.',
      'Điều khoản mới có hiệu lực ngay khi được đăng tải trên website. Khách hàng tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc chấp nhận các thay đổi đó.',
    ],
  },
  {
    title: '6. Luật áp dụng & giải quyết tranh chấp',
    body: [
      'Các điều khoản này được điều chỉnh theo pháp luật Việt Nam.',
      'Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết thông qua thương lượng, hòa giải. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra cơ quan tài phán có thẩm quyền theo quy định pháp luật.',
    ],
  },
]

export default function TermsPage() {
  const { settings } = useSite()

  return (
    <>
      <div className="gd-page-header" style={{ paddingBottom: 40 }}>
        <div className="gd-container-sm">
          <nav className="gd-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Điều khoản sử dụng</span>
          </nav>
          <h1 className="gd-page-title">Điều khoản sử dụng</h1>
          <p className="gd-page-count" style={{ fontSize: 15 }}>Quy định áp dụng khi khách hàng mua sắm và sử dụng dịch vụ tại {settings.site_name || 'cửa hàng'}.</p>
        </div>
      </div>

      <main>
        <section style={{ padding: 'clamp(24px,4vw,56px) 0 clamp(64px,8vw,100px)' }} aria-labelledby="terms-heading">
          <div className="gd-container-sm">
            <h2 id="terms-heading" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Nội dung điều khoản sử dụng</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }} data-reveal>
              {SECTIONS.map((sec, i) => (
                <div key={i} style={{ paddingBottom: 32, borderBottom: i < SECTIONS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <h3 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(18px,2vw,22px)', fontWeight: 700, color: 'var(--text)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{sec.title}</h3>
                  {sec.body.map((p, j) => (
                    <p key={j} style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: j < sec.body.length - 1 ? 14 : 0 }}>{p}</p>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, padding: '24px 28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4 }} data-reveal data-delay="1">
              <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 4 }}>Cần hỗ trợ thêm về điều khoản sử dụng?</p>
              <p style={{ fontSize: 15, color: 'var(--text)', fontWeight: 600 }}>
                <i className="bi bi-telephone" style={{ color: 'var(--accent)', marginRight: 8 }} />{settings.site_phone}
                <span style={{ margin: '0 12px', color: 'var(--text-3)' }}>&middot;</span>
                <i className="bi bi-envelope" style={{ color: 'var(--accent)', marginRight: 8 }} />{settings.site_email}
              </p>
              <Link to="/lien-he" className="gd-btn gd-btn-ghost" style={{ marginTop: 16, display: 'inline-flex' }}>Đến trang liên hệ</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
