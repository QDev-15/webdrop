import { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
  product_id: number
  name: string
  slug: string
  image: string
  price: number
  qty: number
  color?: string
  size?: string
}

interface CartCtx {
  items: CartItem[]
  count: number
  subtotal: number
  couponCode: string | null
  couponDiscount: number
  applyCoupon: (code: string, discount: number) => void
  clearCoupon: () => void
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  updateQty: (product_id: number, qty: number, color?: string, size?: string) => void
  removeItem: (product_id: number, color?: string, size?: string) => void
  clear: () => void
}

const STORAGE_KEY        = 'shop_cart'
const COUPON_CODE_KEY    = 'am_coupon'
const COUPON_DISCOUNT_KEY = 'am_coupon_discount'

// Định danh 1 dòng hàng theo product_id + color + size — mọi thao tác add/update/remove
// PHẢI dùng cùng khoá này, nếu không 2 biến thể khác nhau của cùng sản phẩm sẽ bị gộp nhầm.
function sameLine(a: { product_id: number; color?: string; size?: string }, b: { product_id: number; color?: string; size?: string }): boolean {
  return a.product_id === b.product_id && (a.color ?? '') === (b.color ?? '') && (a.size ?? '') === (b.size ?? '')
}

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const Ctx = createContext<CartCtx>({
  items: [], count: 0, subtotal: 0,
  couponCode: null, couponDiscount: 0,
  applyCoupon: () => {}, clearCoupon: () => {},
  addItem: () => {}, updateQty: () => {}, removeItem: () => {}, clear: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStorage())
  const [couponCode, setCouponCode] = useState<string | null>(() => {
    try { return localStorage.getItem(COUPON_CODE_KEY) || null } catch { return null }
  })
  const [couponDiscount, setCouponDiscount] = useState<number>(() => {
    try { return Number(localStorage.getItem(COUPON_DISCOUNT_KEY) || 0) } catch { return 0 }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* private mode / storage full — bỏ qua, không crash site */ }
  }, [items])

  const applyCoupon = (code: string, discount: number) => {
    setCouponCode(code)
    setCouponDiscount(discount)
    try {
      localStorage.setItem(COUPON_CODE_KEY, code)
      localStorage.setItem(COUPON_DISCOUNT_KEY, String(discount))
    } catch { /* ignore */ }
  }

  const clearCoupon = () => {
    setCouponCode(null)
    setCouponDiscount(0)
    try {
      localStorage.removeItem(COUPON_CODE_KEY)
      localStorage.removeItem(COUPON_DISCOUNT_KEY)
    } catch { /* ignore */ }
  }

  const addItem: CartCtx['addItem'] = (item, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => sameLine(i, item))
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + qty) }
        return next
      }
      return [...prev, { ...item, qty: Math.min(99, Math.max(1, qty)) }]
    })
  }

  const updateQty: CartCtx['updateQty'] = (product_id, qty, color, size) => {
    setItems(prev => prev.map(i => sameLine(i, { product_id, color, size })
      ? { ...i, qty: Math.max(1, Math.min(99, qty)) }
      : i))
  }

  const removeItem: CartCtx['removeItem'] = (product_id, color, size) => {
    setItems(prev => prev.filter(i => !sameLine(i, { product_id, color, size })))
  }

  const clear = () => {
    setItems([])
    clearCoupon()
  }

  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)

  return (
    <Ctx.Provider value={{ items, count, subtotal, couponCode, couponDiscount, applyCoupon, clearCoupon, addItem, updateQty, removeItem, clear }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => useContext(Ctx)
