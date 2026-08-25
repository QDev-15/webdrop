import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { UnitType } from '../utils/format'

let cache: UnitType[] | null = null
let inflight: Promise<UnitType[]> | null = null

function fetchUnitTypes(): Promise<UnitType[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = api.get<UnitType[]>('/public/unit-types').then(data => { cache = data; return data })
  }
  return inflight
}

// Dataset nhỏ (10 loại căn) — tải toàn bộ 1 lần, cache lại giữa các trang, lọc/sort hoàn toàn
// phía client giống hệt hành vi filter engine gốc của template (bang-gia.html).
export function useUnitTypes() {
  const [units, setUnits] = useState<UnitType[]>(cache ?? [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    let alive = true
    fetchUnitTypes().then(data => { if (alive) { setUnits(data); setLoading(false) } })
    return () => { alive = false }
  }, [])

  return { units, loading }
}
