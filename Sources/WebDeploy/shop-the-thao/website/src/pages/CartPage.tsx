import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart()
  const { settings } = useSite()
  useDocumentMeta({ title: 'Giỏ hàng', description: 'Quản lý giỏ hàng của bạn' })

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'
  const FREE_SHIP_THRESHOLD = Number(settings['free_shipping_threshold'] || 500000)
  const SHIP_FEE = Number(settings['shipping_fee'] || 30000)
  const shipping = FREE_SHIP_THRESHOLD > 0 && subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIP_FEE
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="tt-page-wrap">
        {/* Breadcrumb */}
        <div className="tt-breadcrumb">
          <div className="tt-container">
            <Link to="/">Trang chủ</Link>
            <span className="tt-bc-sep">/</span>
            <span>Giỏ hàng</span>
          </div>
        </div>

        <div className="tt-container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64" style={{ color: 'var(--text-3)', margin: '0 auto 24px' }}>
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p style={{ color: 'var(--text-2)', fontSize: 18, marginBottom: 24 }}>Giỏ hàng của bạn đang trống</p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'var(--accent)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16">
              <path d="M19 12H5" />
              <path d="m12 5-7 7 7 7" />
            </svg>
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="tt-page-wrap">
      {/* Breadcrumb */}
      <div className="tt-breadcrumb">
        <div className="tt-container">
          <Link to="/">Trang chủ</Link>
          <span className="tt-bc-sep">/</span>
          <span>Giỏ hàng</span>
        </div>
      </div>

      <main className="tt-sec-sm">
        <div className="tt-container">
          <h1 className="tt-page-title" style={{ marginBottom: 32 }}>Giỏ hàng</h1>

          <div className="tt-cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, marginBottom: 40 }}>
            {/* Items column */}
            <div className="tt-cart-items-col">
              <div id="ttCartItems">
                {items.map((item) => (
                  <div
                    key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}
                    className="tt-cart-item"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '100px 1fr auto auto',
                      gap: 16,
                      alignItems: 'center',
                      paddingBottom: 20,
                      borderBottom: '1px solid var(--border)',
                      marginBottom: 20,
                    }}
                  >
                    <Link to={`/san-pham/${item.slug}`} style={{ textDecoration: 'none' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="tt-cart-item-img"
                        style={{
                          width: '100%',
                          borderRadius: 6,
                          aspectRatio: '1/1',
                          objectFit: 'cover',
                        }}
                        onError={(e) => (e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%231c1c22%22/%3E%3C/svg%3E')}
                      />
                    </Link>

                    <div className="tt-cart-item-info">
                      <Link
                        to={`/san-pham/${item.slug}`}
                        className="tt-cart-item-name"
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                          fontWeight: 600,
                          display: 'block',
                          marginBottom: 8,
                        }}
                      >
                        {item.name}
                      </Link>
                      {(item.color || item.size) && (
                        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>
                          {item.color}{item.color && item.size ? ' · ' : ''}{item.size ? `Size ${item.size}` : ''}
                        </div>
                      )}
                      <div className="tt-cart-item-price" style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>
                        {fmt(item.price)}
                      </div>
                    </div>

                    <div className="tt-cart-item-qty" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        className="tt-qty-sm"
                        onClick={() => updateQty(item.product_id, (item.qty || 1) - 1, item.color, item.size)}
                        disabled={(item.qty || 1) <= 1}
                        aria-label="Giảm"
                        style={{
                          padding: '4px 8px',
                          border: '1px solid var(--border)',
                          background: 'white',
                          borderRadius: 4,
                          cursor: 'pointer',
                        }}
                      >
                        −
                      </button>
                      <span className="tt-qty-num" style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
                        {item.qty || 1}
                      </span>
                      <button
                        className="tt-qty-sm"
                        onClick={() => updateQty(item.product_id, (item.qty || 1) + 1, item.color, item.size)}
                        aria-label="Tăng"
                        style={{
                          padding: '4px 8px',
                          border: '1px solid var(--border)',
                          background: 'white',
                          borderRadius: 4,
                          cursor: 'pointer',
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div className="tt-cart-item-total" style={{ textAlign: 'right', minWidth: 80 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                        {fmt(item.price * (item.qty || 1))}
                      </div>
                      <button
                        className="tt-cart-item-remove"
                        onClick={() => removeItem(item.product_id, item.color, item.size)}
                        aria-label="Xóa sản phẩm"
                        style={{
                          padding: '4px 8px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          color: 'var(--danger)',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <Link
                  to="/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16">
                    <path d="M19 12H5" />
                    <path d="m12 5-7 7 7 7" />
                  </svg>
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Summary column */}
            <div className="tt-cart-summary-col" style={{ height: 'fit-content' }}>
              <div className="tt-cart-summary" style={{ background: 'var(--warm)', padding: 20, borderRadius: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Tóm tắt đơn hàng</h3>

                <div style={{ marginBottom: 20 }}>
                  {items.map((item) => (
                    <div
                      key={`${item.product_id}-${item.color ?? ''}-${item.size ?? ''}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        marginBottom: 8,
                        color: 'var(--text-2)',
                      }}
                    >
                      <span>{item.name} × {item.qty || 1}</span>
                      <span>{fmt(item.price * (item.qty || 1))}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="tt-summary-row"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 600,
                    fontSize: 14,
                    paddingBottom: 12,
                    borderBottom: '1px solid var(--border)',
                    marginBottom: 12,
                  }}
                >
                  <span>Tạm tính</span>
                  <span id="ttSubtotal">{fmt(subtotal)}</span>
                </div>

                <div
                  className="tt-summary-row"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 16,
                  }}
                >
                  <span>Phí vận chuyển</span>
                  <span id="ttShipping" style={{ color: 'var(--accent)' }}>
                    {shipping === 0 ? 'Miễn phí' : fmt(shipping)}
                  </span>
                </div>

                <div
                  className="tt-shipping-note"
                  id="ttShippingNote"
                  style={{
                    marginBottom: 16,
                    padding: '12px',
                    background: 'rgba(255,77,41,.08)',
                    borderRadius: 6,
                    fontSize: 13,
                    color: 'var(--accent)',
                    textAlign: 'center',
                  }}
                >
                  {shipping === 0
                    ? '✓ Bạn được miễn phí vận chuyển!'
                    : `Mua thêm ${fmt(FREE_SHIP_THRESHOLD - subtotal)} để được miễn phí ship`}
                </div>

                <div
                  className="tt-summary-total"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    fontSize: 18,
                    marginBottom: 20,
                    paddingBottom: 16,
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span>Tổng cộng</span>
                  <span id="ttTotal">{fmt(total)}</span>
                </div>

                <Link
                  to="/thanh-toan"
                  className="tt-btn-primary tt-btn-checkout"
                  id="ttCheckoutBtn"
                  style={{
                    display: 'block',
                    padding: '14px 20px',
                    background: 'var(--accent)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    textAlign: 'center',
                    marginBottom: 12,
                    transition: 'all .2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  Tiến hành thanh toán →
                </Link>

                <div
                  className="tt-cart-trust"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    fontSize: 12,
                    color: 'var(--text-2)',
                  }}
                >
                  <div>🔒 Thanh toán bảo mật</div>
                  <div>✓ Bảo hành 12 tháng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
