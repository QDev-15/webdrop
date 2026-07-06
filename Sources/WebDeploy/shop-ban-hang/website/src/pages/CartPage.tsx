import { Link } from 'react-router-dom'

export default function CartPage() {
  return (
    <div className="sb-cart-wrap">
      <div className="sb-container-sm">
        <div className="sb-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>›</span>
          <span>Giỏ hàng</span>
        </div>

        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
          <h1 className="sb-cart-title">Giỏ hàng của bạn</h1>
          <p style={{ color: 'var(--text-2)', fontWeight: 300, marginBottom: 32, fontSize: 16 }}>
            Giỏ hàng đang trống. Hãy khám phá các sản phẩm hữu cơ tuyệt vời của chúng tôi!
          </p>
          <Link to="/san-pham" className="sb-btn sb-btn-primary">Khám phá sản phẩm</Link>
        </div>
      </div>
    </div>
  )
}
