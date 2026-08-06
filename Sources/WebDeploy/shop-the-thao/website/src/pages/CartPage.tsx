import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function CartPage() {
  const { items, subtotal, removeItem, clear } = useCart()
  useDocumentMeta({ title: 'Giỏ hàng', description: 'Quản lý giỏ hàng của bạn' })

  const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ'

  if (items.length === 0) {
    return (
      <div className="tt-page-wrap">
        <div className="tt-container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
          <h1>Giỏ hàng đang trống</h1>
          <p style={{ marginBottom: 32, color: 'var(--text-2)' }}>Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
          <Link to="/" style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: 'white', textDecoration: 'none', borderRadius: 8, fontWeight: 600 }}>
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="tt-page-wrap">
      <div className="tt-container" style={{ padding: '40px 0' }}>
        <h1 style={{ marginBottom: 32 }}>Giỏ hàng ({items.length} sản phẩm)</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, marginBottom: 40 }}>
          {/* Items list */}
          <div>
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr auto',
                  gap: 20,
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
                    style={{ width: '100%', borderRadius: 6, aspectRatio: '1/1', objectFit: 'cover' }}
                  />
                </Link>

                <div>
                  <Link
                    to={`/san-pham/${item.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit', fontWeight: 600, display: 'block', marginBottom: 8 }}
                  >
                    {item.name}
                  </Link>
                  <div style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>{fmt(item.price)}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    {fmt(item.price * (item.qty || 1))}
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    style={{
                      padding: '6px 12px',
                      background: 'var(--warm)',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      color: 'var(--danger)',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button
                onClick={clear}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  color: 'var(--danger)',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--warm)', padding: 20, borderRadius: 8, height: 'fit-content' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Tóm tắt đơn hàng</h2>

            <div style={{ marginBottom: 20 }}>
              {items.map((item, idx) => (
                <div
                  key={idx}
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
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 600,
                fontSize: 16,
                paddingBottom: 16,
                borderBottom: '1px solid var(--border)',
                marginBottom: 16,
              }}
            >
              <span>Tạm tính</span>
              <span>{fmt(subtotal)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--accent)',
                marginBottom: 24,
              }}
            >
              <span>Miễn phí vận chuyển</span>
              <span>0đ</span>
            </div>

            <div
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
              <span>{fmt(subtotal)}</span>
            </div>

            <Link
              to="/thanh-toan"
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
              }}
            >
              Tiến hành thanh toán
            </Link>

            <Link
              to="/"
              style={{
                display: 'block',
                padding: '12px 20px',
                background: 'transparent',
                color: 'var(--text)',
                textDecoration: 'none',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
