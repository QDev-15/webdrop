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

export interface DiscountResult {
  type: string
  value: number
  discountAmount: number
  finalPrice: number
  isFree: boolean
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
  appliedCode: string | null
  discountInfo: DiscountResult | null
  setDiscountInfo: (code: string | null, info: DiscountResult | null) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'wd_cart_v1'
const DISCOUNT_STORAGE_KEY = 'wd_discount_v1'

function readStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

function readDiscountStorage(): { code: string | null; info: DiscountResult | null } {
  if (typeof window === 'undefined') return { code: null, info: null }
  try {
    const raw = window.localStorage.getItem(DISCOUNT_STORAGE_KEY)
    if (!raw) return { code: null, info: null }
    const parsed = JSON.parse(raw)
    return { code: parsed.code ?? null, info: parsed.info ?? null }
  } catch { return { code: null, info: null } }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [discountInfo, setDiscountInfo] = useState<DiscountResult | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate từ localStorage sau mount (tránh SSR mismatch)
  useEffect(() => {
    setItems(readStorage())
    const { code, info } = readDiscountStorage()
    setAppliedCode(code)
    setDiscountInfo(info)
    setHydrated(true)
  }, [])

  // Đồng bộ localStorage mỗi khi items đổi (bỏ qua lần đầu trước khi hydrate xong)
  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  // Đồng bộ discount localStorage
  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify({ code: appliedCode, info: discountInfo }))
  }, [appliedCode, discountInfo, hydrated])

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

  const setDiscountInfoHandler = useCallback((code: string | null, info: DiscountResult | null) => {
    setAppliedCode(code)
    setDiscountInfo(info)
  }, [])

  const itemCount = items.length
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.purchaseType === 'website' && i.websitePrice ? i.websitePrice : i.price), 0),
    [items]
  )

  const value = useMemo(
    () => ({ items, itemCount, subtotal, addItem, removeItem, setPurchaseType, clearCart, isInCart, hydrated, appliedCode, discountInfo, setDiscountInfo: setDiscountInfoHandler }),
    [items, itemCount, subtotal, addItem, removeItem, setPurchaseType, clearCart, isInCart, hydrated, appliedCode, discountInfo, setDiscountInfoHandler]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart phải dùng bên trong <CartProvider>')
  return ctx
}
