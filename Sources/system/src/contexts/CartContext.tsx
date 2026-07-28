'use client'
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

export type PurchaseType = 'template' | 'website'

export interface CartItem {
  slug: string
  name: string
  image: string
  price: number          // giá file template
  websitePrice?: number   // giá website Gói B (nếu có)
  hasWebsite: boolean
  purchaseType: PurchaseType
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: Omit<CartItem, 'purchaseType'> & { purchaseType?: PurchaseType }) => void
  removeItem: (slug: string) => void
  setPurchaseType: (slug: string, type: PurchaseType) => void
  clearCart: () => void
  isInCart: (slug: string) => boolean
  hydrated: boolean
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'wd_cart_v1'

function readStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate từ localStorage sau mount (tránh SSR mismatch)
  useEffect(() => {
    setItems(readStorage())
    setHydrated(true)
  }, [])

  // Đồng bộ localStorage mỗi khi items đổi (bỏ qua lần đầu trước khi hydrate xong)
  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = useCallback((item: Omit<CartItem, 'purchaseType'> & { purchaseType?: PurchaseType }) => {
    setItems(prev => {
      const exists = prev.some(i => i.slug === item.slug)
      if (exists) return prev // đã có sẵn — không thêm trùng
      return [...prev, { ...item, purchaseType: item.purchaseType ?? 'template' }]
    })
  }, [])

  const removeItem = useCallback((slug: string) => {
    setItems(prev => prev.filter(i => i.slug !== slug))
  }, [])

  const setPurchaseType = useCallback((slug: string, type: PurchaseType) => {
    setItems(prev => prev.map(i => i.slug === slug ? { ...i, purchaseType: type } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const isInCart = useCallback((slug: string) => items.some(i => i.slug === slug), [items])

  const itemCount = items.length
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.purchaseType === 'website' && i.websitePrice ? i.websitePrice : i.price), 0),
    [items]
  )

  const value = useMemo(
    () => ({ items, itemCount, subtotal, addItem, removeItem, setPurchaseType, clearCart, isInCart, hydrated }),
    [items, itemCount, subtotal, addItem, removeItem, setPurchaseType, clearCart, isInCart, hydrated]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart phải dùng bên trong <CartProvider>')
  return ctx
}
