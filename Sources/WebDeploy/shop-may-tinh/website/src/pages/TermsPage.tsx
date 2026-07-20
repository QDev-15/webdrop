import { Link } from 'react-router-dom'
import { useSite } from '../contexts/SiteContext'

export default function TermsPage() {
  const { settings } = useSite()
  const siteName = settings.site_name || 'NovaTech'

  return (
    <>
      <div className="mt-page-header" style={{ paddingBottom: 52 }}>
        <div className="mt-container">
          <nav className="mt-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Trang chủ</Link><span><i className="bi bi-chevron-right" style={{ fontSize: 10 }} /></span><span>Điều khoản sử dụng</span>
          </nav>
          <h1 className="mt-page-title">Điều Khoản Sử Dụng</h1>
          <p className="mt-page-count" style={{ fontSize: 16 }}>Quy định áp dụng khi bạn đặt hàng và sử dụng dịch vụ tại website</p>
        </div>
      </div>

      <main>
        <section className="mt-sec" style={{ paddingTop: 0 }}>
          <div className="mt-container">
            <div className="mt-article-layout">
              <div className="mt-article-card" data-reveal>
                <div className="mt-article-updated">Cập nhật lần cuối: 17/07/2026</div>

                <p>Khi truy cập và đặt mua sản phẩm tại website của {siteName}, bạn đồng ý tuân thủ các điều khoản sử dụng dưới đây. Vui lòng đọc kỹ trước khi tiến hành đặt hàng hoặc sử dụng bất kỳ dịch vụ nào của chúng tôi.</p>

                <h2 id="dat-hang-thanh-toan">1. Điều khoản đặt hàng &amp; thanh toán</h2>
                <ul>
                  <li>Đơn hàng chỉ được xác nhận khi khách hàng cung cấp đầy đủ thông tin liên hệ và địa chỉ giao hàng chính xác.</li>
                  <li>Giá sản phẩm hiển thị trên website đã bao gồm VAT (nếu có), có thể thay đổi theo thời điểm mà không cần báo trước — giá áp dụng là giá tại thời điểm đặt hàng thành công.</li>
                  <li>Chấp nhận thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay), thẻ VISA/MasterCard hoặc trả góp 0% lãi suất qua đối tác tài chính liên kết.</li>
                  <li>Đơn hàng trả góp cần khách hàng cung cấp hồ sơ hợp lệ theo yêu cầu của đơn vị tài chính; chúng tôi không chịu trách nhiệm nếu hồ sơ không được đối tác phê duyệt.</li>
                  <li>Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong trường hợp phát hiện dấu hiệu gian lận hoặc thông tin đặt hàng không chính xác.</li>
                </ul>

                <h2 id="doi-tra-bao-hanh">2. Chính sách đổi trả / bảo hành thiết bị</h2>
                <p>
                  Chính sách đổi trả và bảo hành chi tiết cho từng nhóm sản phẩm (laptop, PC, linh kiện, gaming gear) được quy định cụ thể theo từng hãng và được nêu rõ tại trang{' '}
                  <Link to="/lien-he">Liên hệ</Link> hoặc trên phiếu bảo hành đi kèm sản phẩm. Một số nguyên tắc chung áp dụng:
                </p>
                <ul>
                  <li>Hỗ trợ đổi 1-1 trong 30 ngày đầu nếu sản phẩm lỗi do nhà sản xuất, còn nguyên tem/phụ kiện đi kèm.</li>
                  <li>Thời hạn bảo hành chính hãng theo từng sản phẩm (thường 12–36 tháng), tính từ ngày mua ghi trên hóa đơn/phiếu bảo hành.</li>
                  <li>Không áp dụng đổi trả/bảo hành đối với lỗi do rơi vỡ, vào nước, sử dụng sai hướng dẫn hoặc tự ý tháo mở linh kiện.</li>
                  <li>Sản phẩm gửi bảo hành cần đóng gói cẩn thận; chi phí vận chuyển bảo hành áp dụng theo chính sách hiện hành của cửa hàng.</li>
                </ul>

                <h2 id="trach-nhiem-cac-ben">3. Trách nhiệm các bên</h2>
                <p>{siteName} có trách nhiệm cung cấp sản phẩm đúng như mô tả, hỗ trợ tư vấn cấu hình trung thực và xử lý bảo hành theo đúng cam kết. Khách hàng có trách nhiệm cung cấp thông tin đặt hàng chính xác, kiểm tra sản phẩm khi nhận hàng và sử dụng sản phẩm đúng hướng dẫn của nhà sản xuất. Chúng tôi không chịu trách nhiệm với các thiệt hại phát sinh do khách hàng tự ý can thiệp phần cứng/phần mềm ngoài phạm vi bảo hành.</p>

                <h2 id="so-huu-tri-tue">4. Quyền sở hữu trí tuệ nội dung website</h2>
                <p>Toàn bộ nội dung trên website — bao gồm hình ảnh sản phẩm, văn bản mô tả, logo, giao diện thiết kế — thuộc quyền sở hữu của {siteName} hoặc được cấp phép sử dụng hợp pháp. Nghiêm cấm sao chép, phân phối lại hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản của chúng tôi.</p>

                <h2 id="thay-doi-dieu-khoan">5. Thay đổi điều khoản</h2>
                <p>Chúng tôi có thể cập nhật, sửa đổi điều khoản sử dụng này vào bất kỳ thời điểm nào nhằm phù hợp với chính sách kinh doanh hoặc quy định pháp luật hiện hành. Phiên bản điều khoản mới nhất sẽ được đăng tải tại trang này kèm ngày cập nhật — việc tiếp tục sử dụng website sau khi thay đổi được xem là bạn đã chấp nhận điều khoản mới.</p>

                <h2 id="luat-ap-dung">6. Luật áp dụng &amp; giải quyết tranh chấp</h2>
                <p>Điều khoản sử dụng này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh liên quan đến giao dịch, sản phẩm hoặc dịch vụ tại website sẽ được ưu tiên giải quyết thông qua thương lượng, hòa giải. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra cơ quan tài phán có thẩm quyền theo quy định pháp luật Việt Nam để giải quyết.</p>
              </div>

              <aside className="mt-article-toc" data-reveal data-delay="1" aria-label="Mục lục">
                <h4>Nội dung chính</h4>
                <ul>
                  <li><a href="#dat-hang-thanh-toan">1. Đặt hàng &amp; thanh toán</a></li>
                  <li><a href="#doi-tra-bao-hanh">2. Đổi trả / bảo hành</a></li>
                  <li><a href="#trach-nhiem-cac-ben">3. Trách nhiệm các bên</a></li>
                  <li><a href="#so-huu-tri-tue">4. Sở hữu trí tuệ</a></li>
                  <li><a href="#thay-doi-dieu-khoan">5. Thay đổi điều khoản</a></li>
                  <li><a href="#luat-ap-dung">6. Luật áp dụng</a></li>
                </ul>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
