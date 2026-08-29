import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { Property } from '../types'

let cache: Property[] | null = null
let inflight: Promise<Property[]> | null = null

function fetchProperties(): Promise<Property[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = api.get<Property[]>('/public/properties').then(data => { cache = data; return data })
  }
  return inflight
}

// Dataset nhỏ (~42 tin đăng) — tải toàn bộ 1 lần, cache giữa các trang, lọc/sort/phân trang
// hoàn toàn phía client — giống đúng hành vi filter engine gốc của template (bat-dong-san.html).
export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(cache ?? [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    let alive = true
    fetchProperties().then(data => { if (alive) { setProperties(data); setLoading(false) } })
    return () => { alive = false }
  }, [])

  return { properties, loading }
}
