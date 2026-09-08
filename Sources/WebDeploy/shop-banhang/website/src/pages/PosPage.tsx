import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Variant { sku: string; size: string; color: string; stock: number; price: number }
interface Product {
  id: number; name: string; category_id: number | null; price: number; unit: string;
  barcode: string | null; stock: number; min_stock: number; has_variants: boolean; image: string; variants: Variant[]
}
interface Category { id: number; name: string }
interface Customer { id: number; name: string; phone: string; points: number; tier: string }
interface OrderItem {
  productId: number; name: string; unit: string; variantSku: string | null; size: string; color: string; price: number; quantity: number
}
interface OrderState {
  holdId: string | null; label: string; table: string; customerId: number | null; customerName: string;
  customerTier: string; customerPoints: number;
  items: OrderItem[]; discount: { type: 'percent' | 'fixed'; value: number };
  payment: { method: 'cash' | 'transfer' | 'qr' | 'card'; cashReceived: string }
}

const TIER_LABELS: Record<string, string> = { dong: 'Đồng', bac: 'Bạc', vang: 'Vàng', 'kim-cuong': 'Kim Cương' }

function blankOrder(): OrderState {
  return { holdId: null, label: 'Đơn mới', table: '', customerId: null, customerName: '', customerTier: 'dong', customerPoints: 0, items: [], discount: { type: 'percent', value: 0 }, payment: { method: 'cash', cashReceived: '' } }
}

function fmtVND(n: number): string { return Math.round(n).toLocaleString('vi-VN') + 'đ' }
function safeImage(url: string): string {
  return url || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'
}
function totalStock(p: Product): number { return p.has_variants ? p.variants.reduce((s, v) => s + v.stock, 0) : p.stock }
function isLowStock(p: Product): boolean { return totalStock(p) <= p.min_stock }
function minPrice(p: Product): number { return p.has_variants && p.variants.length ? Math.min(...p.variants.map(v => v.price)) : p.price }

export default function PosPage() {
  useDocumentMeta({ title: 'Lập đơn — POS Bán hàng', description: 'Lập đơn bán hàng — quét mã vạch, giữ đơn, đa thanh toán.' })
  const navigate = useNavigate()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(0)
  const [search, setSearch] = useState('')
  const [barcode, setBarcode] = useState('')

  const [activeOrder, setActiveOrder] = useState<OrderState>(blankOrder())
  const [heldOrders, setHeldOrders] = useState<OrderState[]>([])

  const [customerQuery, setCustomerQuery] = useState('')
  const [customerResults, setCustomerResults] = useState<Customer[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  const [variantProduct, setVariantProduct] = useState<Product | null>(null)
  const [variantSelection, setVariantSelection] = useState<string | null>(null)

  const [quickAdd, setQuickAdd] = useState({ show: false, name: '', phone: '', error: '' })
  const [checkoutError, setCheckoutError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ── Bootstrap ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    async function boot() {
      try {
        await api.get('/shifts/current').then(shift => {
          if (!shift) { navigate('/ca-lam-viec', { replace: true }); throw new Error('no-shift') }
        })
        const [ps, cats] = await Promise.all([api.get<Product[]>('/pos/products'), api.get<Category[]>('/categories')])
        if (!cancelled) { setProducts(ps); setCategories(cats) }
      } catch { /* redirect đã xử lý ở trên, hoặc lỗi mạng — không cần báo thêm */ }
      finally { if (!cancelled) setLoading(false) }
    }
    boot()
    return () => { cancelled = true }
  }, [navigate])

  // ── Products / Categories ───────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim()
    return products.filter(p => {
      if (activeCategory !== 0 && p.category_id !== activeCategory) return false
      if (!q) return true
      return p.name.toLowerCase().includes(q) || (p.barcode ?? '').includes(q) ||
        (p.has_variants && p.variants.some(v => v.sku.toLowerCase().includes(q)))
    })
  }, [products, activeCategory, search])

  // ── Item helpers ─────────────────────────────────────────────────────────
  const findItem = useCallback((order: OrderState, productId: number, variantSku: string | null) =>
    order.items.find(it => it.productId === productId && it.variantSku === variantSku), [])

  function addItem(product: Product, variantSku: string | null): string | null {
    let price = product.price, size = '', color = '', availableStock = product.stock
    if (product.has_variants) {
      const variant = product.variants.find(v => v.sku === variantSku)
      if (!variant) return 'Vui lòng chọn biến thể sản phẩm'
      price = variant.price; size = variant.size; color = variant.color; availableStock = variant.stock
    }
    const existing = findItem(activeOrder, product.id, variantSku)
    const currentQty = existing ? existing.quantity : 0
    if (currentQty + 1 > availableStock) {
      return `${product.name}${size ? ` (${size}/${color})` : ''} không đủ tồn kho (còn ${availableStock})`
    }
    setActiveOrder(o => {
      const items = existing
        ? o.items.map(it => it === existing ? { ...it, quantity: it.quantity + 1 } : it)
        : [...o.items, { productId: product.id, name: product.name, unit: product.unit, variantSku, size, color, price, quantity: 1 }]
      return { ...o, items }
    })
    return null
  }

  function removeItem(productId: number, variantSku: string | null) {
    setActiveOrder(o => ({ ...o, items: o.items.filter(it => !(it.productId === productId && it.variantSku === variantSku)) }))
  }

  function updateItemQty(productId: number, variantSku: string | null, delta: number) {
    const item = findItem(activeOrder, productId, variantSku)
    if (!item) return
    const product = products.find(p => p.id === productId)
    let availableStock = product ? product.stock : Infinity
    if (product?.has_variants) {
      const v = product.variants.find(v => v.sku === variantSku)
      availableStock = v ? v.stock : 0
    }
    const newQty = item.quantity + delta
    if (newQty <= 0) { removeItem(productId, variantSku); return }
    if (newQty > availableStock) { alert(`${item.name} không đủ tồn kho (còn ${availableStock})`); return }
    setActiveOrder(o => ({ ...o, items: o.items.map(it => it === item ? { ...it, quantity: newQty } : it) }))
  }

  function handleProductClick(product: Product) {
    if (product.has_variants) { setVariantProduct(product); setVariantSelection(null); return }
    const err = addItem(product, null)
    if (err) alert(err)
  }

  function confirmVariantSelection() {
    if (!variantProduct) return
    if (!variantSelection) { alert('Vui lòng chọn 1 biến thể'); return }
    const err = addItem(variantProduct, variantSelection)
    if (err) { alert(err); return }
    setVariantProduct(null); setVariantSelection(null)
  }

  // ── Barcode ──────────────────────────────────────────────────────────────
  function handleBarcodeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    const code = barcode.trim()
    if (!code) return
    const product = products.find(p => p.barcode === code)
    if (!product) { alert('Không tìm thấy sản phẩm với mã vạch: ' + code); return }
    if (product.has_variants) { setVariantProduct(product); setVariantSelection(null); setBarcode(''); return }
    const err = addItem(product, null)
    if (err) { alert(err); return }
    setBarcode('')
  }

  // ── Discount / totals ────────────────────────────────────────────────────
  function calcTotals(order: OrderState) {
    const subtotal = order.items.reduce((s, it) => s + it.price * it.quantity, 0)
    let discountAmount = 0
    if (order.discount.value > 0) {
      discountAmount = order.discount.type === 'percent'
        ? subtotal * Math.min(order.discount.value, 100) / 100
        : order.discount.value
    }
    discountAmount = Math.min(discountAmount, subtotal)
    return { subtotal, discountAmount, total: Math.max(0, subtotal - discountAmount) }
  }
  const totals = calcTotals(activeOrder)

  // ── Khách hàng ───────────────────────────────────────────────────────────
  async function handleCustomerSearch(q: string) {
    setCustomerQuery(q)
    if (!q.trim()) { setShowAutocomplete(false); return }
    try {
      const res = await api.get<Customer[]>(`/pos/customers/search?q=${encodeURIComponent(q.trim())}`)
      setCustomerResults(res); setShowAutocomplete(true)
    } catch { setCustomerResults([]); setShowAutocomplete(true) }
  }

  function selectCustomer(c: Customer) {
    setActiveOrder(o => ({ ...o, customerId: c.id, customerName: c.name, customerTier: c.tier, customerPoints: c.points }))
    setCustomerQuery(''); setShowAutocomplete(false)
  }
  function clearCustomer() { setActiveOrder(o => ({ ...o, customerId: null, customerName: '', customerTier: 'dong', customerPoints: 0 })) }

  async function handleQuickAddCustomer() {
    setQuickAdd(q => ({ ...q, error: '' }))
    try {
      const c = await api.post<Customer>('/pos/customers/quick-add', { name: quickAdd.name, phone: quickAdd.phone })
      selectCustomer(c)
      setQuickAdd({ show: false, name: '', phone: '', error: '' })
    } catch (err: unknown) {
      setQuickAdd(q => ({ ...q, error: err instanceof Error ? err.message : 'Thêm khách hàng thất bại.' }))
    }
  }

  // ── Giữ đơn (hold orders) — chỉ state React, không lưu DB ───────────────
  function holdActiveOrder(): OrderState | null {
    if (activeOrder.items.length === 0) return null
    const held: OrderState = {
      ...activeOrder,
      holdId: activeOrder.holdId || ('hold' + Date.now() + Math.random().toString(36).slice(2, 7)),
      label: activeOrder.label === 'Đơn mới' ? `Đơn ${heldOrders.length + 1}` : activeOrder.label,
    }
    setHeldOrders(list => {
      const idx = list.findIndex(h => h.holdId === held.holdId)
      if (idx >= 0) { const copy = [...list]; copy[idx] = held; return copy }
      return [...list, held]
    })
    return held
  }

  function handleHold() {
    const held = holdActiveOrder()
    if (!held) { alert('Chưa có món nào trong đơn để giữ'); return }
    setActiveOrder(blankOrder())
  }

  function handleStartNewOrder() {
    holdActiveOrder()
    setActiveOrder(blankOrder())
  }

  function handleSwitchToHeld(holdId: string) {
    holdActiveOrder()
    setHeldOrders(list => {
      const idx = list.findIndex(h => h.holdId === holdId)
      if (idx === -1) return list
      const order = list[idx]
      setActiveOrder(order)
      return list.filter(h => h.holdId !== holdId)
    })
  }

  function discardHeldOrder(holdId: string) {
    setHeldOrders(list => list.filter(h => h.holdId !== holdId))
  }

  function handleCancel() {
    if (activeOrder.items.length > 0 && !confirm('Bạn chắc chắn muốn huỷ đơn này?')) return
    if (activeOrder.holdId) discardHeldOrder(activeOrder.holdId)
    setActiveOrder(blankOrder())
  }

  // ── Thanh toán ───────────────────────────────────────────────────────────
  function selectPaymentMethod(method: OrderState['payment']['method']) {
    setActiveOrder(o => ({ ...o, payment: { ...o.payment, method } }))
  }

  async function handlePayment() {
    setCheckoutError('')
    if (activeOrder.items.length === 0) { setCheckoutError('Vui lòng chọn ít nhất một sản phẩm'); return }
    if (activeOrder.payment.method === 'cash') {
      const received = Number(activeOrder.payment.cashReceived) || 0
      if (received < totals.total) { setCheckoutError('Tiền khách đưa không đủ để thanh toán'); return }
    }
    setSubmitting(true)
    try {
      const order = await api.post<{ code: string }>('/pos/checkout', {
        table_no: activeOrder.table,
        customer_id: activeOrder.customerId,
        items: activeOrder.items.map(it => ({ product_id: it.productId, variant_sku: it.variantSku, quantity: it.quantity })),
        discount: activeOrder.discount,
        payment_method: activeOrder.payment.method,
        cash_received: activeOrder.payment.method === 'cash' ? Number(activeOrder.payment.cashReceived) || 0 : undefined,
      })
      sessionStorage.setItem('bp_current_order', JSON.stringify(order))
      if (activeOrder.holdId) discardHeldOrder(activeOrder.holdId)
      setActiveOrder(blankOrder())
      navigate(`/pos/in-hoa-don/${order.code}`)
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : 'Thanh toán thất bại.')
    } finally { setSubmitting(false) }
  }

  const cashReceivedNum = Number(activeOrder.payment.cashReceived) || 0

  if (loading) return <div className="bp-page-content"><p>Đang tải...</p></div>

  return (
    <div className="bp-page-content">
      <h1 className="visually-hidden">Lập đơn bán hàng</h1>

      <div className="bp-barcode-bar">
        <span style={{ fontSize: '1.2rem' }}>📷</span>
        <input type="text" value={barcode} onChange={e => setBarcode(e.target.value)} onKeyDown={handleBarcodeKeyDown}
          placeholder="Quét hoặc nhập mã vạch sản phẩm rồi nhấn Enter..." autoFocus />
      </div>

      <div className="bp-order-tabs">
        <button className="bp-order-tab active">
          {activeOrder.holdId ? activeOrder.label : (activeOrder.items.length ? 'Đơn hiện tại' : 'Đơn mới')}
          <span className="bp-tab-badge">{activeOrder.items.length}</span>
        </button>
        {heldOrders.map(h => (
          <button key={h.holdId} className="bp-order-tab" onClick={() => handleSwitchToHeld(h.holdId!)}>
            {h.label} <span className="bp-tab-badge">{h.items.length}</span>
          </button>
        ))}
        <button className="bp-order-tab-new" onClick={handleStartNewOrder}>+ Đơn mới</button>
      </div>

      <div className="bp-cashier-layout">
        {/* Left: Categories */}
        <div className="bp-cashier-section">
          <div className="bp-cashier-header"><h3>Menu</h3></div>
          <div className="bp-cashier-body">
            <div className="bp-category-pills" style={{ flexDirection: 'column' }}>
              <button className={`bp-category-pill${activeCategory === 0 ? ' active' : ''}`} onClick={() => setActiveCategory(0)}>Tất cả</button>
              {categories.map(c => (
                <button key={c.id} className={`bp-category-pill${activeCategory === c.id ? ' active' : ''}`} onClick={() => setActiveCategory(c.id)}>{c.name}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Products */}
        <div className="bp-cashier-section">
          <div className="bp-cashier-header">
            <h3>Sản phẩm</h3>
            <input type="text" className="bp-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm sản phẩm theo tên/SKU..." />
          </div>
          <div className="bp-cashier-body">
            <div className="bp-product-grid">
              {filteredProducts.length === 0 ? (
                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-3)' }}>Không tìm thấy sản phẩm</p>
              ) : filteredProducts.map(p => {
                const low = isLowStock(p)
                const stock = totalStock(p)
                return (
                  <div key={p.id} className="bp-product-card">
                    {low && <span className="bp-badge-low-stock">⚠ Sắp hết</span>}
                    {p.has_variants && <span className="bp-variant-hint">Có biến thể</span>}
                    <img src={safeImage(p.image)} alt={p.name} className="bp-product-image" />
                    <div className="bp-product-content">
                      <div className="bp-product-name">{p.name}</div>
                      <div className="bp-product-price">{p.has_variants ? 'Từ ' + fmtVND(minPrice(p)) : fmtVND(p.price)}</div>
                      <div className="bp-product-unit">{p.unit} · Tồn: {stock}</div>
                      <div className="bp-product-actions">
                        <button className="bp-btn bp-btn-primary bp-btn-full bp-btn-sm" disabled={stock <= 0} onClick={() => handleProductClick(p)}>
                          {p.has_variants ? 'Chọn biến thể' : '+ Thêm'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Order */}
        <div className="bp-cashier-section">
          <div className="bp-cashier-header"><h3>Hóa đơn</h3></div>
          <div className="bp-cashier-body">
            <div className="bp-input-group">
              <label htmlFor="tableNumber">Số bàn (tuỳ chọn)</label>
              <input type="text" id="tableNumber" value={activeOrder.table} onChange={e => setActiveOrder(o => ({ ...o, table: e.target.value }))} placeholder="Nhập số bàn" />
            </div>

            <div className="bp-input-group bp-customer-search-wrap">
              <label htmlFor="customerSearchInput">Khách hàng (tìm theo SĐT)</label>
              <input type="text" id="customerSearchInput" value={customerQuery} onChange={e => handleCustomerSearch(e.target.value)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)} placeholder="Nhập số điện thoại khách hàng..." />
              {showAutocomplete && (
                <div className="bp-autocomplete-list">
                  {customerResults.length === 0 ? (
                    <div className="bp-autocomplete-item" style={{ color: 'var(--text-3)' }}>Không tìm thấy khách hàng</div>
                  ) : customerResults.map(c => (
                    <div key={c.id} className="bp-autocomplete-item" onMouseDown={() => selectCustomer(c)}>
                      <strong>{c.name}</strong> · {c.phone}
                      <span className={`bp-tier-badge tier-${c.tier}`} style={{ marginLeft: '0.4rem' }}>{TIER_LABELS[c.tier]}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{c.points} điểm</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {activeOrder.customerId && (
              <div className="bp-customer-chip">
                <span>👤 {activeOrder.customerName} <span className={`bp-tier-badge tier-${activeOrder.customerTier}`}>{TIER_LABELS[activeOrder.customerTier]}</span> · {activeOrder.customerPoints} điểm</span>
                <button type="button" onClick={clearCustomer}>✕</button>
              </div>
            )}

            <button type="button" className="bp-btn bp-btn-secondary bp-btn-sm bp-btn-full" style={{ marginBottom: '1rem' }} onClick={() => setQuickAdd({ show: true, name: '', phone: '', error: '' })}>+ Khách mới</button>

            <div style={{ margin: '1rem 0' }}><strong>Danh sách món:</strong></div>
            <ul className="bp-order-list">
              {activeOrder.items.map(item => {
                const variantLabel = item.size ? ` (${item.size}/${item.color})` : ''
                return (
                  <li key={`${item.productId}::${item.variantSku ?? ''}`} className="bp-order-item">
                    <div className="bp-order-item-info">
                      <div className="bp-order-item-name">{item.name}{variantLabel}</div>
                      <div className="bp-order-item-qty">x{item.quantity} {item.unit} = {fmtVND(item.price * item.quantity)}</div>
                      <div className="bp-order-item-qty-control">
                        <button className="bp-order-item-qty-btn" onClick={() => updateItemQty(item.productId, item.variantSku, -1)}>−</button>
                        <span style={{ width: 30, textAlign: 'center' }}>{item.quantity}</span>
                        <button className="bp-order-item-qty-btn" onClick={() => updateItemQty(item.productId, item.variantSku, 1)}>+</button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="bp-order-item-price">{fmtVND(item.price * item.quantity)}</div>
                      <button className="bp-order-item-remove" onClick={() => removeItem(item.productId, item.variantSku)}>✕</button>
                    </div>
                  </li>
                )
              })}
            </ul>
            {activeOrder.items.length === 0 && (
              <div style={{ marginTop: '1rem' }}><p style={{ color: 'var(--text-3)', textAlign: 'center', margin: 0 }}>Chưa có món nào</p></div>
            )}
          </div>

          <div className="bp-cashier-footer">
            <div className="bp-order-summary">
              <div className="bp-summary-row subtotal"><span>Tạm tính:</span><span>{fmtVND(totals.subtotal)}</span></div>
              <div className="bp-input-group">
                <label htmlFor="discountValue">Chiết khấu</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select value={activeOrder.discount.type} onChange={e => setActiveOrder(o => ({ ...o, discount: { ...o.discount, type: e.target.value as 'percent' | 'fixed' } }))} style={{ flex: 0.4 }}>
                    <option value="percent">%</option>
                    <option value="fixed">đ</option>
                  </select>
                  <input type="number" id="discountValue" min={0} value={activeOrder.discount.value || ''} placeholder="0"
                    onChange={e => setActiveOrder(o => ({ ...o, discount: { ...o.discount, value: Math.max(0, Number(e.target.value) || 0) } }))} />
                </div>
              </div>
              {activeOrder.customerId && (
                <div className="bp-summary-row subtotal"><span>Điểm tích lũy dự kiến:</span><span>{Math.floor(totals.total / 10000)} điểm</span></div>
              )}
              <div className="bp-summary-row total"><span>Thành tiền:</span><span>{fmtVND(totals.total)}</span></div>

              <div className="bp-payment-methods">
                <button type="button" className={`bp-payment-option${activeOrder.payment.method === 'cash' ? ' active' : ''}`} onClick={() => selectPaymentMethod('cash')}><span className="picon">💵</span>Tiền mặt</button>
                <button type="button" className={`bp-payment-option${activeOrder.payment.method === 'transfer' ? ' active' : ''}`} onClick={() => selectPaymentMethod('transfer')}><span className="picon">🏦</span>Chuyển khoản</button>
                <button type="button" className={`bp-payment-option${activeOrder.payment.method === 'qr' ? ' active' : ''}`} onClick={() => selectPaymentMethod('qr')}><span className="picon">📱</span>QR Code</button>
                <button type="button" className={`bp-payment-option${activeOrder.payment.method === 'card' ? ' active' : ''}`} onClick={() => selectPaymentMethod('card')}><span className="picon">💳</span>Thẻ</button>
              </div>

              {activeOrder.payment.method === 'cash' && (
                <div className="bp-payment-detail">
                  <div className="bp-input-group" style={{ marginBottom: '0.5rem' }}>
                    <label htmlFor="cashReceived">Tiền khách đưa</label>
                    <input type="number" id="cashReceived" min={0} value={activeOrder.payment.cashReceived}
                      onChange={e => setActiveOrder(o => ({ ...o, payment: { ...o.payment, cashReceived: e.target.value } }))} placeholder="Nhập số tiền khách đưa" />
                  </div>
                  {activeOrder.payment.cashReceived !== '' && (
                    <div className={`bp-change-display ${cashReceivedNum >= totals.total ? 'ok' : 'insufficient'}`}>
                      {cashReceivedNum >= totals.total ? 'Tiền thối lại: ' + fmtVND(cashReceivedNum - totals.total) : 'Còn thiếu: ' + fmtVND(totals.total - cashReceivedNum)}
                    </div>
                  )}
                </div>
              )}
              {activeOrder.payment.method === 'transfer' && (
                <div className="bp-payment-detail"><p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-2)' }}>Khách chuyển khoản tới số tài khoản cửa hàng. Xác nhận đã nhận được tiền trước khi bấm Thanh toán.</p></div>
              )}
              {activeOrder.payment.method === 'qr' && (
                <div className="bp-payment-detail" style={{ textAlign: 'center' }}>
                  <svg className="bp-qr-mock" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="Mã QR thanh toán demo">
                    <rect width="100" height="100" fill="#fff" /><rect x="6" y="6" width="24" height="24" fill="#0a2129" /><rect x="70" y="6" width="24" height="24" fill="#0a2129" />
                    <rect x="6" y="70" width="24" height="24" fill="#0a2129" /><rect x="14" y="14" width="8" height="8" fill="#fff" /><rect x="78" y="14" width="8" height="8" fill="#fff" />
                    <rect x="14" y="78" width="8" height="8" fill="#fff" /><rect x="40" y="10" width="6" height="6" fill="#0a2129" /><rect x="50" y="20" width="6" height="6" fill="#0a2129" />
                    <rect x="60" y="40" width="6" height="6" fill="#0a2129" /><rect x="40" y="50" width="6" height="6" fill="#0a2129" /><rect x="50" y="60" width="6" height="6" fill="#0a2129" />
                    <rect x="70" y="50" width="6" height="6" fill="#0a2129" /><rect x="40" y="70" width="6" height="6" fill="#0a2129" /><rect x="60" y="80" width="6" height="6" fill="#0a2129" />
                    <rect x="80" y="70" width="14" height="14" fill="#0a2129" />
                  </svg>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-2)' }}>Khách quét mã QR để thanh toán (demo)</p>
                </div>
              )}
              {activeOrder.payment.method === 'card' && (
                <div className="bp-payment-detail"><p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-2)' }}>Quẹt/chạm thẻ trên máy POS, sau đó bấm Thanh toán để xác nhận.</p></div>
              )}

              {checkoutError && <div className="bp-alert error show" style={{ marginTop: '0.75rem' }}>{checkoutError}</div>}

              <button className="bp-btn bp-btn-primary bp-btn-full" style={{ marginTop: '1rem' }} onClick={handlePayment} disabled={submitting}>{submitting ? 'Đang xử lý...' : 'Thanh toán'}</button>
              <button className="bp-btn bp-btn-secondary bp-btn-full" style={{ marginTop: '0.5rem' }} onClick={handleHold}>Giữ đơn</button>
              <button className="bp-btn bp-btn-secondary bp-btn-full" style={{ marginTop: '0.5rem' }} onClick={handleCancel}>Huỷ đơn</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chọn biến thể */}
      {variantProduct && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title" style={{ fontSize: '1.15rem', margin: 0 }}>Chọn biến thể — {variantProduct.name}</h2>
                <button type="button" className="btn-close" onClick={() => setVariantProduct(null)} aria-label="Đóng"></button>
              </div>
              <div className="modal-body">
                <div className="bp-variant-group">
                  <div className="bp-variant-group-label">Chọn tổ hợp size / loại</div>
                  <div className="bp-variant-options">
                    {variantProduct.variants.map(v => (
                      <button key={v.sku} type="button" disabled={v.stock <= 0}
                        className={`bp-variant-option${v.stock <= 0 ? ' disabled' : ''}${variantSelection === v.sku ? ' selected' : ''}`}
                        onClick={() => setVariantSelection(v.sku)}>
                        <span className="vname">{v.size} · {v.color}</span>
                        <span className="vmeta">{fmtVND(v.price)} — Tồn: {v.stock}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="bp-btn bp-btn-secondary" onClick={() => setVariantProduct(null)}>Huỷ</button>
                <button type="button" className="bp-btn bp-btn-primary" onClick={confirmVariantSelection}>Thêm vào đơn</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </div>
      )}

      {/* Modal thêm khách mới */}
      {quickAdd.show && (
        <div className="modal fade show" style={{ display: 'block' }} role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title" style={{ fontSize: '1.15rem', margin: 0 }}>Thêm khách hàng mới</h2>
                <button type="button" className="btn-close" onClick={() => setQuickAdd({ show: false, name: '', phone: '', error: '' })} aria-label="Đóng"></button>
              </div>
              <div className="modal-body">
                <div className="bp-input-group">
                  <label htmlFor="quickCustName">Tên khách hàng</label>
                  <input type="text" id="quickCustName" value={quickAdd.name} onChange={e => setQuickAdd(q => ({ ...q, name: e.target.value }))} placeholder="Nhập tên khách hàng" />
                </div>
                <div className="bp-input-group">
                  <label htmlFor="quickCustPhone">Số điện thoại</label>
                  <input type="tel" id="quickCustPhone" value={quickAdd.phone} onChange={e => setQuickAdd(q => ({ ...q, phone: e.target.value }))} placeholder="VD: 0901234567" />
                </div>
                {quickAdd.error && <div className="bp-alert error show">{quickAdd.error}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="bp-btn bp-btn-secondary" onClick={() => setQuickAdd({ show: false, name: '', phone: '', error: '' })}>Huỷ</button>
                <button type="button" className="bp-btn bp-btn-primary" onClick={handleQuickAddCustomer}>Lưu &amp; chọn</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </div>
      )}
    </div>
  )
}
