import { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
  product_id: number
  name: string
  slug: string
  image: string
  price: number
  qty: number
  color?: string
}

interface CartCtx {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  updateQty: (product_id: number, qty: number, color?: string) => void
  removeItem: (product_id: number, color?: string) => void
  clear: () => void
}

const STORAGE_KEY = 'sb_cart'

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
  addItem: () => {}, updateQty: () => {}, removeItem: () => {}, clear: () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStorage())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem: CartCtx['addItem'] = (item, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.product_id === item.product_id && i.color === item.color)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + qty) }
        return next
      }
      return [...prev, { ...item, qty: Math.min(99, Math.max(1, qty)) }]
    })
  }

  const updateQty: CartCtx['updateQty'] = (product_id, qty, color) => {
    setItems(prev => prev.map(i => (i.product_id === product_id && i.color === color)
      ? { ...i, qty: Math.max(1, Math.min(99, qty)) }
      : i))
  }

  const removeItem: CartCtx['removeItem'] = (product_id, color) => {
    setItems(prev => prev.filter(i => !(i.product_id === product_id && i.color === color)))
  }

  const clear = () => setItems([])

  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)

  return (
    <Ctx.Provider value={{ items, count, subtotal, addItem, updateQty, removeItem, clear }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => useContext(Ctx)
