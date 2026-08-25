import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUnitTypes } from '../hooks/useUnitTypes'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import UnitCard from '../components/UnitCard'
import { DIRECTION_LABELS, parseFloorRange } from '../utils/format'
import type { UnitType } from '../utils/format'

const PRICE_BANDS = [
  { id: 'b1', min: 0, max: 3e9, label: 'Dưới 3 tỷ' },
  { id: 'b2', min: 3e9, max: 5e9, label: '3 - 5 tỷ' },
  { id: 'b3', min: 5e9, max: 8e9, label: '5 - 8 tỷ' },
  { id: 'b4', min: 8e9, max: 12e9, label: '8 - 12 tỷ' },
  { id: 'b5', min: 12e9, max: Infinity, label: 'Trên 12 tỷ' },
]
const AREA_BANDS = [
  { id: 'a1', min: 0, max: 60, label: 'Dưới 60m²' },
  { id: 'a2', min: 60, max: 90, label: '60 - 90m²' },
  { id: 'a3', min: 90, max: 120, label: '90 - 120m²' },
  { id: 'a4', min: 120, max: Infinity, label: 'Trên 120m²' },
]
const FLOOR_BANDS = [
  { id: 'f1', min: 5, max: 15, label: 'Thấp tầng (5-15)' },
  { id: 'f2', min: 16, max: 25, label: 'Trung tầng (16-25)' },
  { id: 'f3', min: 26, max: 35, label: 'Cao tầng (26-35)' },
]
const TYPE_PILLS = [
  { value: 'all', label: 'Tất cả loại căn' },
  { value: '1pn', label: '1PN' },
  { value: '2pn', label: '2PN' },
  { value: '3pn', label: '3PN' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'penthouse', label: 'Penthouse' },
]
const STATUS_PILLS = [
  { value: 'all', label: 'Mọi tình trạng' },
  { value: 'con-hang', label: 'Còn hàng' },
  { value: 'sap-mo-ban', label: 'Sắp mở bán' },
]
const PER_PAGE = 4

interface FilterState {
  type: string
  price: string[]
  area: string[]
  floor: string[]
  directions: string[]
  status: string
  sort: string
  page: number
}

const initialState: FilterState = { type: 'all', price: [], area: [], floor: [], directions: [], status: 'all', sort: 'newest', page: 1 }

export default function PricingPage() {
  useDocumentMeta({
    title: 'Bảng giá & Mặt bằng căn hộ | Green Valley Residence',
    description: 'Bảng giá đầy đủ 10 loại căn hộ Green Valley Residence — từ Studio 1PN đến Penthouse. Lọc theo loại căn, giá, diện tích, tầng, hướng và tình trạng còn hàng.',
  })

  const { units, loading } = useUnitTypes()
  const [state, setState] = useState<FilterState>(initialState)
  const [mobileOpen, setMobileOpen] = useState(false)

  const uniqueDirections = useMemo(() => [...new Set(units.map(u => u.direction))], [units])

  function matchUnit(u: UnitType): boolean {
    if (state.type !== 'all' && u.type_tag !== state.type) return false
    if (state.status !== 'all' && u.status !== state.status) return false
    if (state.price.length && !state.price.some(id => { const b = PRICE_BANDS.find(x => x.id === id)!; return u.price_from >= b.min && u.price_from < b.max })) return false
    if (state.area.length && !state.area.some(id => { const b = AREA_BANDS.find(x => x.id === id)!; return u.area >= b.min && u.area < b.max })) return false
    if (state.floor.length) {
      const [uMin, uMax] = parseFloorRange(u.floor_range)
      const overlaps = state.floor.some(id => { const b = FLOOR_BANDS.find(x => x.id === id)!; return uMin <= b.max && uMax >= b.min })
      if (!overlaps) return false
    }
    if (state.directions.length && !state.directions.includes(u.direction)) return false
    return true
  }

  function sortUnits(list: UnitType[]): UnitType[] {
    const arr = [...list]
    if (state.sort === 'price-asc') arr.sort((a, b) => a.price_from - b.price_from)
    else if (state.sort === 'price-desc') arr.sort((a, b) => b.price_from - a.price_from)
    else if (state.sort === 'area-desc') arr.sort((a, b) => b.area - a.area)
    else arr.sort((a, b) => b.id - a.id)
    return arr
  }

  const filtered = useMemo(() => sortUnits(units.filter(matchUnit)), [units, state])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const page = Math.min(state.page, totalPages)
  const pageItems = filtered.slice((page - 1) * PER_PAGE, (page - 1) * PER_PAGE + PER_PAGE)

  function onFilterChange(patch: Partial<FilterState>) {
    setState(s => ({ ...s, ...patch, page: 1 }))
  }
  function toggleCheck(key: 'price' | 'area' | 'floor' | 'directions', value: string) {
    setState(s => {
      const list = s[key]
      const next = list.includes(value) ? list.filter(v => v !== value) : [...list, value]
      return { ...s, [key]: next, page: 1 }
    })
  }
  function resetAll() { setState(initialState) }

  const chips: { k: string; v?: string; label: string }[] = []
  if (state.type !== 'all') chips.push({ k: 'type', label: TYPE_PILLS.find(p => p.value === state.type)?.label ?? state.type })
  if (state.status !== 'all') chips.push({ k: 'status', label: STATUS_PILLS.find(p => p.value === state.status)?.label ?? state.status })
  state.price.forEach(id => chips.push({ k: 'price', v: id, label: PRICE_BANDS.find(b => b.id === id)!.label }))
  state.area.forEach(id => chips.push({ k: 'area', v: id, label: AREA_BANDS.find(b => b.id === id)!.label }))
  state.floor.forEach(id => chips.push({ k: 'floor', v: id, label: FLOOR_BANDS.find(b => b.id === id)!.label }))
  state.directions.forEach(d => chips.push({ k: 'direction', v: d, label: DIRECTION_LABELS[d] ?? d }))

  function removeChip(c: { k: string; v?: string }) {
    if (c.k === 'type') onFilterChange({ type: 'all' })
    else if (c.k === 'status') onFilterChange({ status: 'all' })
    else if (c.k === 'price') toggleCheck('price', c.v!)
    else if (c.k === 'area') toggleCheck('area', c.v!)
    else if (c.k === 'floor') toggleCheck('floor', c.v!)
    else if (c.k === 'direction') toggleCheck('directions', c.v!)
  }

  const badgeCounts = { price: state.price.length, area: state.area.length, floor: state.floor.length, direction: state.directions.length }
  const totalActiveMobile = chips.length

  return (
    <>
      <header className="gvr-page-hero">
        <span className="blob blob-a"></span><span className="blob blob-b"></span>
        <div className="wd-container">
          <div className="gvr-crumb"><Link to="/">Trang chủ</Link> / Bảng giá &amp; Mặt bằng</div>
          <div className="eyebrow eyebrow-light">{units.length || 10} loại căn đang mở bán</div>
          <h1 className="sec-title on-dark" style={{ marginBottom: 12 }}>Bảng giá &amp; Mặt bằng căn hộ</h1>
          <p className="sec-sub on-dark">Lọc theo loại căn, khoảng giá, diện tích, tầng, hướng và tình trạng để tìm căn hộ phù hợp nhất với nhu cầu của bạn.</p>
        </div>
      </header>

      <section className="sec-pad">
        <div className="wd-container">
          <div className="gvr-toolbar">
            <div className="gvr-toolbar-row1 d-none d-lg-flex">
              <div className="gvr-pill-group">
                {TYPE_PILLS.map(p => (
                  <button key={p.value} className={'gvr-pill' + (state.type === p.value ? ' active' : '')} onClick={() => onFilterChange({ type: p.value })}>{p.label}</button>
                ))}
              </div>

              <FilterDropdown label="Khoảng giá" count={badgeCounts.price}>
                {PRICE_BANDS.map(b => (
                  <label className="gvr-dd-check" key={b.id}><input type="checkbox" checked={state.price.includes(b.id)} onChange={() => toggleCheck('price', b.id)} /> {b.label}</label>
                ))}
              </FilterDropdown>

              <FilterDropdown label="Diện tích" count={badgeCounts.area}>
                {AREA_BANDS.map(b => (
                  <label className="gvr-dd-check" key={b.id}><input type="checkbox" checked={state.area.includes(b.id)} onChange={() => toggleCheck('area', b.id)} /> {b.label}</label>
                ))}
              </FilterDropdown>

              <FilterDropdown label="Tầng" count={badgeCounts.floor}>
                {FLOOR_BANDS.map(b => (
                  <label className="gvr-dd-check" key={b.id}><input type="checkbox" checked={state.floor.includes(b.id)} onChange={() => toggleCheck('floor', b.id)} /> {b.label}</label>
                ))}
              </FilterDropdown>

              <FilterDropdown label="Hướng" count={badgeCounts.direction}>
                {uniqueDirections.map(d => (
                  <label className="gvr-dd-check" key={d}><input type="checkbox" checked={state.directions.includes(d)} onChange={() => toggleCheck('directions', d)} /> {DIRECTION_LABELS[d] ?? d}</label>
                ))}
              </FilterDropdown>

              <div className="gvr-pill-group">
                {STATUS_PILLS.map(p => (
                  <button key={p.value} className={'gvr-pill' + (state.status === p.value ? ' active' : '')} onClick={() => onFilterChange({ status: p.value })}>{p.label}</button>
                ))}
              </div>

              <select className="gvr-sort-select ms-auto" value={state.sort} onChange={e => onFilterChange({ sort: e.target.value })}>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="area-desc">Diện tích lớn nhất</option>
              </select>
            </div>

            {/* Mobile trigger */}
            <div className="d-lg-none d-flex align-items-center justify-content-between gap-2">
              <button className="gvr-dd-btn gvr-toolbar-mobile-btn" type="button" onClick={() => setMobileOpen(true)}>
                ⚙ Bộ lọc {totalActiveMobile > 0 && <span className="gvr-toolbar-mobile-badge">{totalActiveMobile}</span>}
              </button>
              <select className="gvr-sort-select" value={state.sort} onChange={e => onFilterChange({ sort: e.target.value })}>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="area-desc">Diện tích lớn nhất</option>
              </select>
            </div>

            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ marginTop: 14 }}>
              <div className="gvr-count-text" aria-live="polite">Tìm thấy <b>{filtered.length}</b> loại căn phù hợp</div>
            </div>

            {chips.length > 0 && (
              <div className="gvr-chips-row">
                {chips.map((c, i) => (
                  <span className="gvr-chip" key={`${c.k}-${c.v ?? ''}-${i}`}>{c.label}<button type="button" onClick={() => removeChip(c)}>✕</button></span>
                ))}
                <button className="gvr-chip-clear" onClick={resetAll}>Xóa tất cả</button>
              </div>
            )}
          </div>

          {/* Mobile offcanvas */}
          {mobileOpen && (
            <div className="gvr-mobile-filter-overlay" onClick={() => setMobileOpen(false)}>
              <div className="gvr-mobile-filter-panel" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h5 style={{ margin: 0 }}>Bộ lọc</h5>
                  <button className="btn-close" onClick={() => setMobileOpen(false)} aria-label="Đóng"></button>
                </div>
                <div className="mb-4">
                  <div className="gvr-footer-head" style={{ color: 'var(--text)' }}>Loại căn</div>
                  <div className="gvr-pill-group">
                    {TYPE_PILLS.map(p => (
                      <button key={p.value} className={'gvr-pill' + (state.type === p.value ? ' active' : '')} onClick={() => onFilterChange({ type: p.value })}>{p.label === 'Tất cả loại căn' ? 'Tất cả' : p.label}</button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="gvr-footer-head" style={{ color: 'var(--text)' }}>Khoảng giá</div>
                  {PRICE_BANDS.map(b => (
                    <label className="gvr-dd-check" key={b.id}><input type="checkbox" checked={state.price.includes(b.id)} onChange={() => toggleCheck('price', b.id)} /> {b.label}</label>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="gvr-footer-head" style={{ color: 'var(--text)' }}>Diện tích</div>
                  {AREA_BANDS.map(b => (
                    <label className="gvr-dd-check" key={b.id}><input type="checkbox" checked={state.area.includes(b.id)} onChange={() => toggleCheck('area', b.id)} /> {b.label}</label>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="gvr-footer-head" style={{ color: 'var(--text)' }}>Tầng</div>
                  {FLOOR_BANDS.map(b => (
                    <label className="gvr-dd-check" key={b.id}><input type="checkbox" checked={state.floor.includes(b.id)} onChange={() => toggleCheck('floor', b.id)} /> {b.label}</label>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="gvr-footer-head" style={{ color: 'var(--text)' }}>Hướng</div>
                  {uniqueDirections.map(d => (
                    <label className="gvr-dd-check" key={d}><input type="checkbox" checked={state.directions.includes(d)} onChange={() => toggleCheck('directions', d)} /> {DIRECTION_LABELS[d] ?? d}</label>
                  ))}
                </div>
                <div className="mb-4">
                  <div className="gvr-footer-head" style={{ color: 'var(--text)' }}>Tình trạng</div>
                  <div className="gvr-pill-group">
                    {STATUS_PILLS.map(p => (
                      <button key={p.value} className={'gvr-pill' + (state.status === p.value ? ' active' : '')} onClick={() => onFilterChange({ status: p.value })}>{p.label === 'Mọi tình trạng' ? 'Tất cả' : p.label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)' }}>Đang tải...</div>
          ) : pageItems.length === 0 ? (
            <div className="gvr-empty">
              <div className="gvr-empty-icon">🏢</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Không tìm thấy loại căn phù hợp</h3>
              <p className="sec-sub" style={{ margin: '0 auto 20px' }}>Thử điều chỉnh lại bộ lọc để xem thêm lựa chọn khác.</p>
              <button className="gvr-btn gvr-btn-ghost" onClick={resetAll}>Xóa tất cả bộ lọc</button>
            </div>
          ) : (
            <div className="row g-4">
              {pageItems.map(u => (
                <div className="col-lg-3 col-md-6" key={u.id}>
                  <UnitCard unit={u} variant="catalog" />
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <ul className="gvr-pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <li key={n} className={'page-item' + (n === page ? ' active' : '')}>
                  <button className="page-link" onClick={() => setState(s => ({ ...s, page: n }))}>{n}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}

function FilterDropdown({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="gvr-dd" onMouseLeave={() => setOpen(false)}>
      <button className="gvr-dd-btn" type="button" onClick={() => setOpen(o => !o)}>
        {label} {count > 0 && <span className="gvr-dd-badge">{count}</span>} ▾
      </button>
      <div className={'gvr-dd-menu' + (open ? ' open' : '')}>{children}</div>
    </div>
  )
}
