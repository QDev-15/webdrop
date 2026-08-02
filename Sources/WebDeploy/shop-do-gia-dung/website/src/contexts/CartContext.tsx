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

export interface CouponState {
  code: string
  type: 'percent' | 'fixed'
  value: number
  discount: number
}

interface CartCtx {
  items: CartItem[]
  count: number
  subtotal: number
  coupon: CouponState | null
  setCoupon: (c: CouponState | null) => void
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  updateQty: (product_id: number, qty: number, color?: string, size?: string) => void
  removeItem: (product_id: number, color?: string, size?: string) => void
  clear: () => void
}

const STORAGE_KEY = 'shop_cart'
const COUPON_KEY  = 'shop_coupon'

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

function readCoupon(): CouponState | null {
  try {
    const raw = localStorage.getItem(COUPON_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const Ctx = createContext<CartCtx>({
  items: [], count: 0, subtotal: 0, coupon: null,
  setCoupon: () => {}, addItem: () => {}, updateQty: () => {}, removeItem: () => {}, clear: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems]   = useState<CartItem[]>(() => readStorage())
  const [coupon, setCouponState] = useState<CouponState | null>(() => readCoupon())

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* private mode / storage full */ }
  }, [items])

  const setCoupon = (c: CouponState | null) => {
    setCouponState(c)
    try {
      if (c) localStorage.setItem(COUPON_KEY, JSON.stringify(c))
      else localStorage.removeItem(COUPON_KEY)
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

  const clear = () => { setItems([]); setCoupon(null) }

  const count    = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)

  return (
    <Ctx.Provider value={{ items, count, subtotal, coupon, setCoupon, addItem, updateQty, removeItem, clear }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => useContext(Ctx)
