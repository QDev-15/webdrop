import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function formatVND(n: number) { return n.toLocaleString('vi-VN') + '₫' }

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart()

  useDocumentMeta({
    title: 'Giỏ hàng — Mộc Vang',
    description: 'Xem lại giỏ hàng rượu vang của bạn tại Mộc Vang trước khi tiến hành thanh toán.',
  })

  return (
    <div className="wd-container" style={{ paddingTop: 130, paddingBottom: 90 }}>
      <div className="rv-eyebrow">Đơn hàng của bạn</div>
      <h1 className="rv-sec-title" style={{ marginBottom: 34 }}>Giỏ <span>hàng</span></h1>

      {items.length === 0 ? (
        <div className="rv-cart-empty">
          <div className="rv-empty-ico" style={{ margin: '0 auto 20px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
          </div>
          <h3>Giỏ hàng của bạn đang trống</h3>
          <p>Hãy khám phá các nhãn hiệu vang tuyển chọn tại Mộc Vang.</p>
          <Link to="/" className="rv-btn rv-btn-solid">Bắt đầu mua sắm</Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div>
              {items.map(item => (
                <div className="rv-cart-row" key={item.product_id}>
                  <div className="rv-cart-thumb"><img src={item.image} alt={item.name} /></div>
                  <div className="rv-cart-name">{item.name}</div>
                  <div className="rv-cart-qty">
                    <button aria-label="Giảm số lượng" onClick={() => updateQty(item.product_id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button aria-label="Tăng số lượng" onClick={() => updateQty(item.product_id, item.qty + 1)}>+</button>
                  </div>
                  <div className="rv-cart-price">{formatVND(item.price * item.qty)}</div>
                  <button className="rv-cart-remove" aria-label="Xóa khỏi giỏ" onClick={() => removeItem(item.product_id)}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="rv-summary">
              <div className="rv-summary-row"><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div>
              <div className="rv-summary-row"><span>Phí vận chuyển</span><span>Tính ở bước thanh toán</span></div>
              <div className="rv-summary-row total"><span>Tổng cộng</span><span>{formatVND(subtotal)}</span></div>
              <Link to="/thanh-toan" className="rv-btn rv-btn-solid rv-btn-block" style={{ marginTop: 18 }}>Tiến hành thanh toán</Link>
              <Link to="/" className="rv-btn rv-btn-outline rv-btn-block" style={{ marginTop: 12 }}>Tiếp tục mua hàng</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
