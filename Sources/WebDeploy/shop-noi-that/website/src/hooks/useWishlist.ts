import { useCallback, useEffect, useState } from 'react'

// Yêu thích (nút trái tim trên card sản phẩm) — khớp hành vi template gốc: chỉ lưu localStorage,
// KHÔNG có trang danh sách yêu thích riêng (template không có wishlist.html).
const STORAGE_KEY = 'nt_wishlist'

function readStorage(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<number[]>(() => readStorage())

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)) } catch { /* ignore */ }
  }, [ids])

  const isWished = useCallback((id: number) => ids.includes(id), [ids])
  const toggle = useCallback((id: number) => {
    setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }, [])

  return { ids, isWished, toggle }
}
