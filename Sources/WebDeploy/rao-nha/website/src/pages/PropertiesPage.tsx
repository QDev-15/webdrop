import { useEffect, useMemo, useRef, useState } from 'react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { api } from '../api/client'
import PropertyCard from '../components/PropertyCard'
import {
  Listing, AREAS, TYPE_LABELS, DIRECTION_LABELS, LEGAL_LABELS, FURNISHING_LABELS,
  TIER_ORDER, PRICE_RANGES_BAN, PRICE_RANGES_THUE, AREA_RANGES,
} from '../lib/listings'

const PER_PAGE = 12

interface FilterState {
  need: string; types: string[]; areas: string[]; priceRange: string; bedrooms: string; areaRange: string
  directions: string[]; legal: string[]; furnishing: string[]; sort: string; page: number; q: string; nguoiDang: string
}

function readStateFromURL(): FilterState {
  const p = new URLSearchParams(location.search)
  return {
    need: p.get('nhu-cau') || '',
    types: p.get('loai')?.split(',').filter(Boolean) || [],
    areas: p.get('khu-vuc')?.split(',').filter(Boolean) || [],
    priceRange: p.get('gia') || '',
    bedrooms: p.get('pn') || '',
    areaRange: p.get('dt') || '',
    directions: p.get('huong')?.split(',').filter(Boolean) || [],
    legal: p.get('phap-ly')?.split(',').filter(Boolean) || [],
    furnishing: p.get('noi-that')?.split(',').filter(Boolean) || [],
    sort: p.get('sort') || 'moi-nhat',
    page: parseInt(p.get('page') || '1') || 1,
    q: p.get('q') || '',
    nguoiDang: p.get('nguoiDang') || '',
  }
}

function writeStateToURL(state: FilterState) {
  const p = new URLSearchParams()
  if (state.need) p.set('nhu-cau', state.need)
  if (state.types.length) p.set('loai', state.types.join(','))
  if (state.areas.length) p.set('khu-vuc', state.areas.join(','))
  if (state.priceRange) p.set('gia', state.priceRange)
  if (state.bedrooms) p.set('pn', state.bedrooms)
  if (state.areaRange) p.set('dt', state.areaRange)
  if (state.directions.length) p.set('huong', state.directions.join(','))
  if (state.legal.length) p.set('phap-ly', state.legal.join(','))
  if (state.furnishing.length) p.set('noi-that', state.furnishing.join(','))
  if (state.sort !== 'moi-nhat') p.set('sort', state.sort)
  if (state.q) p.set('q', state.q)
  if (state.nguoiDang) p.set('nguoiDang', state.nguoiDang)
  if (state.page > 1) p.set('page', String(state.page))
  const qs = p.toString()
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname)
}

export default function PropertiesPage() {
  useDocumentMeta({
    title: 'Nhà đất bán & cho thuê | RaoNhà',
    description: 'Tìm kiếm và lọc hàng nghìn tin đăng chung cư, nhà phố, đất nền, biệt thự, shophouse tại Hà Nội, TP.HCM, Đà Nẵng theo giá, khu vực, diện tích, hướng nhà, pháp lý.',
  })

  const [listings, setListings] = useState<Listing[]>([])
  const [state, setState] = useState<FilterState>(readStateFromURL)
  const [ddOpen, setDdOpen] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [searchInput, setSearchInput] = useState(state.q)

  useEffect(() => { api.get<Listing[]>('/public/listings').then(setListings).catch(() => {}) }, [])
  useEffect(() => { writeStateToURL(state) }, [state])
  useEffect(() => {
    if (!ddOpen) return
    const closeAll = () => setDdOpen(null)
    document.addEventListener('click', closeAll)
    return () => document.removeEventListener('click', closeAll)
  }, [ddOpen])

  const priceRanges = state.need === 'cho-thue' ? PRICE_RANGES_THUE : PRICE_RANGES_BAN

  function update(patch: Partial<FilterState>, resetPage = true) {
    setState(s => ({ ...s, ...patch, page: resetPage ? 1 : (patch.page ?? s.page) }))
  }

  function toggleArrFilter(group: keyof FilterState, value: string) {
    setState(s => {
      const arr = s[group] as string[]
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      return { ...s, [group]: next, page: 1 }
    })
  }

  function clearAll() {
    setSearchInput('')
    setState({ need: '', types: [], areas: [], priceRange: '', bedrooms: '', areaRange: '', directions: [], legal: [], furnishing: [], sort: 'moi-nhat', page: 1, q: '', nguoiDang: '' })
  }

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => update({ q: searchInput.trim() }), 300)
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const filtered = useMemo(() => {
    return listings.filter(pr => {
      if (state.need && pr.listing_type !== state.need) return false
      if (state.types.length && !state.types.includes(pr.property_type)) return false
      if (state.areas.length) {
        const areaObj = AREAS.find(a => a.label === pr.district)
        if (!areaObj || !state.areas.includes(areaObj.slug)) return false
      }
      if (state.priceRange) {
        const r = priceRanges.find(x => x.v === state.priceRange)
        if (r && (pr.price < r.min || pr.price >= r.max)) return false
      }
      if (state.bedrooms) {
        if (state.bedrooms === '5') { if (!(pr.bedrooms >= 5)) return false }
        else if (pr.bedrooms !== +state.bedrooms) return false
      }
      if (state.areaRange) {
        const r = AREA_RANGES.find(x => x.v === state.areaRange)
        if (r && (pr.area < r.min || pr.area >= r.max)) return false
      }
      if (state.directions.length && !state.directions.includes(pr.direction)) return false
      if (state.legal.length && !state.legal.includes(pr.legal_status)) return false
      if (state.furnishing.length && !state.furnishing.includes(pr.furnishing)) return false
      if (state.nguoiDang && String(pr.poster.slug) !== state.nguoiDang) return false
      if (state.q) {
        const q = state.q.toLowerCase()
        if (!pr.title.toLowerCase().includes(q) && !pr.district.toLowerCase().includes(q) && !pr.city.toLowerCase().includes(q)) return false
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings, state])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const tierDiff = TIER_ORDER[a.tier] - TIER_ORDER[b.tier]
      if (tierDiff !== 0) return tierDiff
      if (state.sort === 'gia-tang') return a.price - b.price
      if (state.sort === 'gia-giam') return b.price - a.price
      if (state.sort === 'dien-tich-lon') return b.area - a.area
      return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
    })
    return arr
  }, [filtered, state.sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const page = Math.min(Math.max(1, state.page), totalPages)
  const start = (page - 1) * PER_PAGE
  const pageItems = sorted.slice(start, start + PER_PAGE)

  const activeCount = (state.need ? 1 : 0) + state.types.length + state.areas.length + (state.priceRange ? 1 : 0)
    + (state.bedrooms ? 1 : 0) + (state.areaRange ? 1 : 0) + state.directions.length + state.legal.length + state.furnishing.length + (state.q ? 1 : 0)

  const chips: { label: string; onRemove: () => void }[] = []
  if (state.need) chips.push({ label: state.need === 'ban' ? 'Nhu cầu: Bán' : 'Nhu cầu: Cho thuê', onRemove: () => update({ need: '' }) })
  state.types.forEach(v => chips.push({ label: TYPE_LABELS[v], onRemove: () => toggleArrFilter('types', v) }))
  state.areas.forEach(v => chips.push({ label: AREAS.find(a => a.slug === v)?.label || v, onRemove: () => toggleArrFilter('areas', v) }))
  state.directions.forEach(v => chips.push({ label: DIRECTION_LABELS[v], onRemove: () => toggleArrFilter('directions', v) }))
  state.legal.forEach(v => chips.push({ label: LEGAL_LABELS[v], onRemove: () => toggleArrFilter('legal', v) }))
  state.furnishing.forEach(v => chips.push({ label: FURNISHING_LABELS[v], onRemove: () => toggleArrFilter('furnishing', v) }))
  if (state.priceRange) { const r = priceRanges.find(x => x.v === state.priceRange); chips.push({ label: r?.label || state.priceRange, onRemove: () => update({ priceRange: '' }) }) }
  if (state.bedrooms) chips.push({ label: state.bedrooms === '5' ? '5+ phòng ngủ' : state.bedrooms + ' phòng ngủ', onRemove: () => update({ bedrooms: '' }) })
  if (state.areaRange) { const r = AREA_RANGES.find(x => x.v === state.areaRange); chips.push({ label: r?.label || state.areaRange, onRemove: () => update({ areaRange: '' }) }) }
  if (state.q) chips.push({ label: `"${state.q}"`, onRemove: () => { setSearchInput(''); update({ q: '' }) } })

  const TypeChecks = () => (
    <>
      {Object.entries(TYPE_LABELS).map(([v, label]) => (
        <label className="rn-dd-check" key={v}><input type="checkbox" checked={state.types.includes(v)} onChange={() => toggleArrFilter('types', v)} /> {label}</label>
      ))}
    </>
  )
  const AreaChecks = () => (
    <>
      {['Hà Nội', 'TP.HCM', 'Đà Nẵng'].map(city => (
        <div key={city}>
          <div className="rn-dd-group-label">{city}</div>
          {AREAS.filter(a => a.city === city).map(a => (
            <label className="rn-dd-check" key={a.slug}><input type="checkbox" checked={state.areas.includes(a.slug)} onChange={() => toggleArrFilter('areas', a.slug)} /> {a.label}</label>
          ))}
        </div>
      ))}
    </>
  )
  const MoreChecks = () => (
    <>
      <div className="rn-dd-group-label">Hướng nhà</div>
      {Object.entries(DIRECTION_LABELS).map(([v, label]) => (
        <label className="rn-dd-check" key={v}><input type="checkbox" checked={state.directions.includes(v)} onChange={() => toggleArrFilter('directions', v)} /> {label}</label>
      ))}
      <div className="rn-dd-group-label">Pháp lý</div>
      {Object.entries(LEGAL_LABELS).map(([v, label]) => (
        <label className="rn-dd-check" key={v}><input type="checkbox" checked={state.legal.includes(v)} onChange={() => toggleArrFilter('legal', v)} /> {label}</label>
      ))}
      <div className="rn-dd-group-label">Tình trạng nội thất</div>
      {Object.entries(FURNISHING_LABELS).map(([v, label]) => (
        <label className="rn-dd-check" key={v}><input type="checkbox" checked={state.furnishing.includes(v)} onChange={() => toggleArrFilter('furnishing', v)} /> {label}</label>
      ))}
    </>
  )

  const SortSelect = ({ className = '' }: { className?: string }) => (
    <select className={'rn-select ' + className} value={state.sort} onChange={e => update({ sort: e.target.value }, false)}>
      <option value="moi-nhat">Mới đăng</option>
      <option value="gia-tang">Giá tăng dần</option>
      <option value="gia-giam">Giá giảm dần</option>
      <option value="dien-tich-lon">Diện tích lớn nhất</option>
    </select>
  )

  return (
    <>
      <section className="rn-page-banner">
        <div className="rn-container">
          <div className="rn-breadcrumb"><a href="/">Trang chủ</a> / Nhà đất bán &amp; cho thuê</div>
          <h1 className="sec-title">Nhà đất <em>bán &amp; cho thuê</em></h1>
          <p className="sec-sub">Lọc chính xác theo nhu cầu, khu vực, khoảng giá, diện tích, hướng nhà và tình trạng pháp lý.</p>
        </div>
      </section>

      <div className="rn-toolbar">
        <div className="rn-container">
          <div className="rn-toolbar-row">
            <div className="rn-need-pills">
              {[['', 'Tất cả'], ['ban', 'Bán'], ['cho-thue', 'Cho thuê']].map(([v, label]) => (
                <button key={v} type="button" className={'rn-need-pill' + (state.need === v ? ' active' : '')}
                  onClick={() => update({ need: state.need === v ? '' : v, priceRange: '' })}>{label}</button>
              ))}
            </div>

            <div className="rn-dd">
              <button type="button" className="rn-dd-btn" onClick={() => setDdOpen(o => o === 'type' ? null : 'type')}>Loại hình ▾</button>
              {ddOpen === 'type' && <div className="rn-dd-panel" onClick={e => e.stopPropagation()}><TypeChecks /></div>}
            </div>
            <div className="rn-dd">
              <button type="button" className="rn-dd-btn" onClick={() => setDdOpen(o => o === 'area' ? null : 'area')}>Khu vực ▾</button>
              {ddOpen === 'area' && <div className="rn-dd-panel" onClick={e => e.stopPropagation()}><AreaChecks /></div>}
            </div>

            <select className="rn-select" value={state.priceRange} onChange={e => update({ priceRange: e.target.value })}>
              <option value="">Khoảng giá</option>
              {priceRanges.map(r => <option key={r.v} value={r.v}>{r.label}</option>)}
            </select>
            <select className="rn-select" value={state.bedrooms} onChange={e => update({ bedrooms: e.target.value })}>
              <option value="">Phòng ngủ</option>
              <option value="1">1 phòng ngủ</option><option value="2">2 phòng ngủ</option><option value="3">3 phòng ngủ</option>
              <option value="4">4 phòng ngủ</option><option value="5">5+ phòng ngủ</option>
            </select>
            <select className="rn-select" value={state.areaRange} onChange={e => update({ areaRange: e.target.value })}>
              <option value="">Diện tích</option>
              {AREA_RANGES.map(r => <option key={r.v} value={r.v}>{r.label}</option>)}
            </select>

            <div className="rn-dd">
              <button type="button" className="rn-dd-btn" onClick={() => setDdOpen(o => o === 'more' ? null : 'more')}>Thêm bộ lọc ▾</button>
              {ddOpen === 'more' && <div className="rn-dd-panel" style={{ minWidth: 260 }} onClick={e => e.stopPropagation()}><MoreChecks /></div>}
            </div>

            <SortSelect />

            <div className="rn-toolbar-search">
              <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Tìm theo tên đường, khu vực..." />
            </div>

            <button type="button" className="rn-filter-mobile-btn" onClick={() => setMobileOpen(true)}>
              Bộ lọc {activeCount > 0 && <span className="rn-filter-badge">{activeCount}</span>}
            </button>
          </div>
          {chips.length > 0 && (
            <div className="rn-active-chips">
              {chips.map((c, i) => (
                <button key={i} type="button" className="rn-chip" onClick={c.onRemove}>{c.label} <span>✕</span></button>
              ))}
              <button type="button" className="rn-chip-clear" onClick={clearAll}>Xóa tất cả</button>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="rn-offcanvas show" style={{ position: 'fixed', inset: 0, zIndex: 1050, background: 'rgba(0,0,0,.4)' }} onClick={() => setMobileOpen(false)}>
          <div style={{ background: 'var(--surface)', width: 320, maxWidth: '86vw', height: '100%', overflowY: 'auto', padding: 20 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h5 style={{ margin: 0 }}>Bộ lọc tìm kiếm</h5>
              <button className="btn-close" onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div className="rn-dd-group-label">Sắp xếp</div>
            <SortSelect className="w-100 mb-3" />
            <div className="rn-dd-group-label">Nhu cầu</div>
            <div className="rn-need-pills" style={{ marginBottom: 16 }}>
              {[['', 'Tất cả'], ['ban', 'Bán'], ['cho-thue', 'Cho thuê']].map(([v, label]) => (
                <button key={v} type="button" className={'rn-need-pill' + (state.need === v ? ' active' : '')} onClick={() => update({ need: state.need === v ? '' : v, priceRange: '' })}>{label}</button>
              ))}
            </div>
            <div className="rn-dd-group-label">Loại hình</div><TypeChecks />
            <div className="rn-dd-group-label">Khu vực</div><AreaChecks />
            <div className="rn-dd-group-label">Khoảng giá</div>
            <select className="rn-select w-100 mb-3" value={state.priceRange} onChange={e => update({ priceRange: e.target.value })}>
              <option value="">Khoảng giá</option>
              {priceRanges.map(r => <option key={r.v} value={r.v}>{r.label}</option>)}
            </select>
            <div className="rn-dd-group-label">Phòng ngủ</div>
            <select className="rn-select w-100 mb-3" value={state.bedrooms} onChange={e => update({ bedrooms: e.target.value })}>
              <option value="">Phòng ngủ</option><option value="1">1 phòng ngủ</option><option value="2">2 phòng ngủ</option>
              <option value="3">3 phòng ngủ</option><option value="4">4 phòng ngủ</option><option value="5">5+ phòng ngủ</option>
            </select>
            <div className="rn-dd-group-label">Diện tích</div>
            <select className="rn-select w-100 mb-3" value={state.areaRange} onChange={e => update({ areaRange: e.target.value })}>
              <option value="">Diện tích</option>
              {AREA_RANGES.map(r => <option key={r.v} value={r.v}>{r.label}</option>)}
            </select>
            <MoreChecks />
            <button type="button" className="btn-rn btn-rn-ghost btn-rn-block mt-3" onClick={clearAll}>Xóa tất cả bộ lọc</button>
          </div>
        </div>
      )}

      <section className="sec-pad" style={{ paddingTop: 0 }} onClick={() => ddOpen && setDdOpen(null)}>
        <div className="rn-container">
          <div className="rn-result-count" aria-live="polite">
            {sorted.length
              ? `Tìm thấy ${sorted.length} bất động sản phù hợp — hiển thị ${start + 1}–${start + pageItems.length}`
              : 'Không tìm thấy bất động sản phù hợp với bộ lọc hiện tại'}
          </div>
          {pageItems.length > 0 ? (
            <div className="rn-grid">{pageItems.map(p => <PropertyCard key={p.id} p={p} />)}</div>
          ) : (
            <div className="rn-empty-state">
              <h3>Không tìm thấy bất động sản phù hợp</h3>
              <p>Hãy thử điều chỉnh hoặc xóa bớt bộ lọc để xem thêm kết quả.</p>
              <button type="button" className="btn-rn btn-rn-primary mt-3" onClick={clearAll}>Xóa tất cả bộ lọc</button>
            </div>
          )}
          {totalPages > 1 && (
            <ul className="rn-pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <li key={n} className={'page-item' + (n === page ? ' active' : '')}>
                  <button className="page-link" onClick={() => { update({ page: n }, false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{n}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
