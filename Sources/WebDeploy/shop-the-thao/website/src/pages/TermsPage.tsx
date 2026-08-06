import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function TermsPage() {
  useDocumentMeta({ title: 'Điều khoản sử dụng', description: 'Điều khoản và điều kiện sử dụng dịch vụ' })

  return (
    <div className="tt-page-wrap">
      <div className="tt-container" style={{ padding: '60px 0', maxWidth: 800 }}>
        <h1 style={{ marginBottom: 24 }}>Điều khoản sử dụng</h1>
        <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>1. Điều kiện sử dụng</h2>
          <p>Bằng cách truy cập và sử dụng trang web này, bạn đồng ý bị ràng buộc bởi các điều khoản và điều kiện sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không sử dụng trang web này.</p>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>2. Hợp lệ</h2>
          <p>Bạn phải ít nhất 18 tuổi để mua hàng trên trang web này. Bạn chịu trách nhiệm đảm bảo rằng tất cả thông tin bạn cung cấp là chính xác và đầy đủ.</p>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>3. Sản phẩm và giá</h2>
          <p>Chúng tôi cố gắng đảm bảo mô tả sản phẩm và giá chính xác trên trang web này. Tuy nhiên, chúng tôi không chịu trách nhiệm cho bất kỳ lỗi hoặc thiếu sót nào. Tất cả giá được liệt kê bằng VNĐ.</p>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>4. Đặt hàng và thanh toán</h2>
          <p>Khi bạn đặt hàng, bạn đồng ý cung cấp thông tin thanh toán chính xác. Chúng tôi giữ quyền từ chối hoặc hủy bất kỳ đơn hàng nào vì bất kỳ lý do gì.</p>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>5. Chính sách trả lại</h2>
          <p>Sản phẩm có thể được trả lại hoặc đổi trong 30 ngày từ ngày mua, miễn là chúng ở tình trạng tốt và có đủ chứng chỉ mua.</p>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>6. Giới hạn trách nhiệm</h2>
          <p>Trong các trường hợp được phép bởi luật pháp, chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, đặc biệt hoặc phức hợp nào phát sinh từ việc sử dụng trang web hoặc sản phẩm của chúng tôi.</p>

          <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32, marginBottom: 12 }}>7. Thay đổi điều khoản</h2>
          <p>Chúng tôi giữ quyền sửa đổi các điều khoản này bất kỳ lúc nào. Việc tiếp tục sử dụng trang web sau những thay đổi đó đồng ý là bạn chấp nhận các điều khoản đã sửa đổi.</p>
        </div>
      </div>
    </div>
  )
}
