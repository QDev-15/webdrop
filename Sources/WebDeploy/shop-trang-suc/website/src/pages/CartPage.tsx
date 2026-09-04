import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart()

  useDocumentMeta({
    title: 'Giỏ hàng — VIOLETTE Fine Jewelry',
    description: 'Xem lại giỏ hàng trang sức VIOLETTE trước khi thanh toán.',
  })

  return (
    <main className="tr-cart-wrap">
      <div className="tr-container">
        <div className="tr-breadcrumb" style={{ marginBottom: 26 }}><Link to="/">Trang chủ</Link> / <span>Giỏ hàng</span></div>
        <h1 style={{ fontSize: 'clamp(28px,3.4vw,38px)', marginBottom: 40 }}>Giỏ hàng của bạn</h1>

        {items.length === 0 ? (
          <div className="tr-cart-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy khám phá bộ sưu tập trang sức tinh xảo của VIOLETTE.</p>
            <Link to="/san-pham" className="tr-btn tr-btn-fill">Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div className="tr-cart-grid">
            <div>
              {items.map(item => (
                <div className="tr-cart-item" key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}>
                  <img className="tr-cart-item-img" src={item.image} alt={item.name} />
                  <div>
                    <div className="tr-cart-item-name">{item.name}</div>
                    <div className="tr-cart-item-meta">{formatVND(item.price)} / sản phẩm</div>
                    <div className="tr-qty-selector">
                      <button type="button" onClick={() => updateQty(item.product_id, item.qty - 1)}>−</button>
                      <input type="text" value={item.qty} readOnly />
                      <button type="button" onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <div className="tr-cart-item-right">
                    <div className="tr-price-main">{formatVND(item.price * item.qty)}</div>
                    <span className="tr-cart-item-remove" role="button" onClick={() => removeItem(item.product_id)}>Xóa</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="tr-cart-summary">
              <div className="tr-cart-summary-title">Tóm tắt đơn hàng</div>
              <div className="tr-cart-summary-row"><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div>
              <div className="tr-cart-summary-row"><span>Phí đóng gói &amp; vận chuyển</span><span>Miễn phí</span></div>
              <div className="tr-cart-summary-row total"><span>Tổng cộng</span><span>{formatVND(subtotal)}</span></div>
              <Link to="/thanh-toan" className="tr-btn tr-btn-fill tr-btn-block" style={{ marginTop: 22 }}>Tiến hành đặt hàng</Link>
              <Link to="/san-pham" className="tr-btn tr-btn-block" style={{ marginTop: 12 }}>Tiếp tục mua sắm</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
