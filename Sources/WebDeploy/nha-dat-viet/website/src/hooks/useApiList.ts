import { useEffect, useState } from 'react'
import { api } from '../api/client'

// Hook chung tải danh sách (agents/projects/testimonials/faqs) — dataset nhỏ, không cần cache
// phức tạp như useProperties (mỗi page chỉ gọi 1 lần khi mount).
export function useApiList<T>(path: string) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    setLoading(true)
    api.get<T[]>(path)
      .then(data => { if (alive) setItems(data) })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [path])

  return { items, loading }
}
