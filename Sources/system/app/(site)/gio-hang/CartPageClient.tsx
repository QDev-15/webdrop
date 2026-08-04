'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart, type PurchaseType } from '@/contexts/CartContext'

function fmtPrice(n: number) { return n.toLocaleString('vi-VN') + 'đ' }

export default function CartPageClient() {
  const { items, subtotal, removeItem, setPurchaseType, hydrated, appliedCode, discountInfo, setDiscountInfo } = useCart()
  const router = useRouter()

  const [discountInput, setDiscountInput] = useState('')
  const [discountError, setDiscountError] = useState('')
  const [discountChecking, setDiscountChecking] = useState(false)

  const basePrice = subtotal
  const price = discountInfo?.finalPrice ?? basePrice
  const isFree = discountInfo?.isFree ?? false

  async function applyDiscount() {
    if (!discountInput.trim()) return
    setDiscountChecking(true)
    setDiscountError('')
    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountInput.trim().toUpperCase(), price: basePrice }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDiscountError(data.error || 'Mã không hợp lệ')
        return
      }
      const code = discountInput.trim().toUpperCase()
      setDiscountInput('')
      setDiscountInfo(code, data)
    } catch {
      setDiscountError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setDiscountChecking(false)
    }
  }

  function clearDiscount() {
    setDiscountInput('')
    setDiscountError('')
    setDiscountInfo(null, null)
  }

  return (
    <div style={{ paddingTop: 62 }}>
      <div className="page-wrap">
        <h1 className="page-title">Giỏ hàng <em>của bạn</em></h1>
        <p className="page-sub">Xem lại các template đã chọn trước khi thanh toán.</p>

        {!hydrated ? null : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-3)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
            <div style={{ fontSize: 15, marginBottom: 20 }}>Giỏ hàng của bạn đang trống.</div>
            <Link href="/templates" className="btn-more" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Khám phá thư viện mẫu →
            </Link>
          </div>
        ) : (
          <div className="row g-4" style={{ marginTop: 8 }}>
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                {items.map(item => (
                  <div key={item.slug} style={{
                    display: 'flex', gap: 16, padding: 16,
                    border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface)',
                  }}>
                    <img src={item.image} alt={item.name} style={{ width: 88, height: 66, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <Link href={`/templates/${item.slug}`} style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)', textDecoration: 'none' }}>
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.slug)}
                          aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                          style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 13, flexShrink: 0 }}
                        >
                          ✕ Xóa
                        </button>
                      </div>

                      {item.hasWebsite && item.websitePrice ? (
                        <div className="d-flex gap-2 mt-2 flex-wrap">
                          {(['template', 'website'] as PurchaseType[]).map(pt => (
                            <button
                              key={pt}
                              onClick={() => setPurchaseType(item.slug, pt)}
                              style={{
                                fontSize: 12, padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
                                border: `1px solid ${item.purchaseType === pt ? 'var(--accent)' : 'var(--border)'}`,
                                background: item.purchaseType === pt ? 'var(--accent-light)' : 'transparent',
                                color: item.purchaseType === pt ? 'var(--accent)' : 'var(--text-2)',
                                fontWeight: item.purchaseType === pt ? 600 : 400,
                              }}
                            >
                              {pt === 'template' ? '📦 File template' : '🌐 Website + Admin'}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>📦 File template</div>
                      )}

                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginTop: 8 }}>
                        {fmtPrice(item.purchaseType === 'website' && item.websitePrice ? item.websitePrice : item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 20, background: 'var(--surface)', position: 'sticky', top: 90 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>Tóm tắt đơn hàng</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>
                  <span>{items.length} sản phẩm</span>
                  <span style={{ textDecoration: discountInfo ? 'line-through' : 'none', color: discountInfo ? 'var(--text-3)' : undefined }}>{fmtPrice(subtotal)}</span>
                </div>

                {/* Coupon section */}
                <div style={{ marginBottom: 14, marginTop: 14, paddingBottom: 14, borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 8 }}>🏷️ Mã khuyến mại</div>
                  {!appliedCode ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        value={discountInput}
                        onChange={e => setDiscountInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && applyDiscount()}
                        placeholder="Nhập mã"
                        style={{ flex: 1, padding: '8px 11px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit', outline: 'none', letterSpacing: 0.5 }}
                      />
                      <button
                        onClick={applyDiscount}
                        disabled={discountChecking || !discountInput.trim()}
                        style={{ padding: '8px 12px', background: 'var(--text)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: discountChecking ? .6 : 1, whiteSpace: 'nowrap' }}
                      >
                        {discountChecking ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 6, padding: '8px 10px', fontSize: 12 }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--accent)', letterSpacing: 0.5 }}>{appliedCode}</span>
                        <span style={{ fontSize: 11, color: 'var(--accent)', marginLeft: 8 }}>
                          −{fmtPrice(discountInfo!.discountAmount)}
                          {discountInfo!.isFree && <strong style={{ marginLeft: 4 }}>🎁</strong>}
                        </span>
                      </div>
                      <button onClick={clearDiscount} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>✕</button>
                    </div>
                  )}
                  {discountError && <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>{discountError}</div>}
                </div>

                {discountInfo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--accent)', marginBottom: 8 }}>
                    <span>Giảm giá</span>
                    <span>−{fmtPrice(discountInfo.discountAmount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>
                  <span>Tổng cộng</span>
                  <span style={{ color: isFree ? 'var(--accent)' : undefined }}>{isFree ? 'Miễn phí 🎁' : fmtPrice(price)}</span>
                </div>

                <button
                  className="btn-primary-wd"
                  style={{ width: '100%', padding: 13, fontSize: 14 }}
                  onClick={() => router.push('/checkout')}
                >
                  Tiến hành thanh toán →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
