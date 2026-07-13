import { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
  product_id: number
  name: string
  slug: string
  image: string
  price: number
  price_original?: number
  qty: number
  color?: string
  size?: string
}

export interface AppliedCoupon {
  code: string
  discount: number
}

interface CartCtx {
  items: CartItem[]
  count: number
  subtotal: number
  coupon: AppliedCoupon | null
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  updateQty: (product_id: number, qty: number, color?: string, size?: string) => void
  removeItem: (product_id: number, color?: string, size?: string) => void
  clear: () => void
  setCoupon: (coupon: AppliedCoupon | null) => void
}

const STORAGE_KEY = 'st_cart'

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStorage(items: CartItem[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* private mode / sandbox — bỏ qua, không crash trang */ }
}

const Ctx = createContext<CartCtx>({
  items: [], count: 0, subtotal: 0, coupon: null,
  addItem: () => {}, updateQty: () => {}, removeItem: () => {}, clear: () => {}, setCoupon: () => {},
})

const sameVariant = (a: CartItem, id: number, color?: string, size?: string) =>
  a.product_id === id && a.color === color && a.size === size

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStorage())
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null)

  useEffect(() => { writeStorage(items) }, [items])
  // Giỏ hàng thay đổi (thêm/bớt/xóa sản phẩm) → mã giảm giá cũ có thể không còn hợp lệ (đơn tối thiểu) → yêu cầu áp lại
  useEffect(() => { setCoupon(null) }, [items.length])

  const addItem: CartCtx['addItem'] = (item, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => sameVariant(i, item.product_id, item.color, item.size))
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + qty) }
        return next
      }
      return [...prev, { ...item, qty: Math.min(99, Math.max(1, qty)) }]
    })
  }

  const updateQty: CartCtx['updateQty'] = (product_id, qty, color, size) => {
    setItems(prev => prev.map(i => sameVariant(i, product_id, color, size)
      ? { ...i, qty: Math.max(1, Math.min(99, qty)) }
      : i))
  }

  const removeItem: CartCtx['removeItem'] = (product_id, color, size) => {
    setItems(prev => prev.filter(i => !sameVariant(i, product_id, color, size)))
  }

  const clear = () => setItems([])

  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)

  return (
    <Ctx.Provider value={{ items, count, subtotal, coupon, addItem, updateQty, removeItem, clear, setCoupon }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => useContext(Ctx)
