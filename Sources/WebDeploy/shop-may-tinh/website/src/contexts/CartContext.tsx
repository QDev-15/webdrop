import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

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
  applyCoupon: (code: string) => Promise<{ ok: boolean; error?: string }>
  clearCoupon: () => void
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  updateQty: (product_id: number, qty: number, color?: string, size?: string) => void
  removeItem: (product_id: number, color?: string, size?: string) => void
  clear: () => void
}

const STORAGE_KEY = 'shop_cart'
const COUPON_STORAGE_KEY = 'mt_coupon'

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

interface CouponState {
  code: string
  discount: number
}

function readCouponStorage(): CouponState | null {
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.code === 'string' && typeof parsed.discount === 'number') return parsed
    return null
  } catch {
    return null
  }
}

const Ctx = createContext<CartCtx>({
  items: [], count: 0, subtotal: 0, couponCode: null, couponDiscount: 0,
  applyCoupon: async () => ({ ok: false }),
  clearCoupon: () => {},
  addItem: () => {}, updateQty: () => {}, removeItem: () => {}, clear: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStorage())
  const [couponState, setCouponState] = useState<CouponState | null>(() => readCouponStorage())

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* private mode / storage full — bỏ qua, không crash site */ }
  }, [items])

  const persistCoupon = (state: CouponState | null) => {
    setCouponState(state)
    try {
      if (state) localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(state))
      else localStorage.removeItem(COUPON_STORAGE_KEY)
    } catch { /* ignore */ }
  }

  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)

  const applyCoupon = async (code: string): Promise<{ ok: boolean; error?: string }> => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return { ok: false, error: 'Vui lòng nhập mã giảm giá' }
    try {
      const res = await api.post<{ code: string; type: string; discount: number }>(
        '/public/coupons/validate',
        { code: trimmed, subtotal }
      )
      persistCoupon({ code: res.code, discount: res.discount })
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Mã giảm giá không hợp lệ' }
    }
  }

  const clearCoupon = () => persistCoupon(null)

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
    persistCoupon(null)
  }

  return (
    <Ctx.Provider value={{
      items, count, subtotal,
      couponCode: couponState?.code ?? null,
      couponDiscount: couponState?.discount ?? 0,
      applyCoupon, clearCoupon,
      addItem, updateQty, removeItem, clear,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => useContext(Ctx)
