import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { useProperties } from '../hooks/useProperties'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import PropertyCard from '../components/PropertyCard'
import { useSite } from '../contexts/SiteContext'
import {
  PROPERTY_TYPE_LABELS, DIRECTION_LABELS, LEGAL_LABELS, FURNISHING_LABELS, DISTRICTS,
  PRICE_RANGES_BAN, PRICE_RANGES_THUE, AREA_RANGES, districtLabel,
} from '../data/propertyMeta'
import type { Property } from '../types'
import { IconFilterBars, IconChevronDown } from '../components/icons'

const PER_PAGE = 12

interface FilterState {
  listingType: string
  propertyType: string[]
  district: string[]
  priceRange: string
  bedrooms: string
  direction: string[]
  legalStatus: string[]
  areaRange: string
  furnishing: string[]
  sort: string
  page: number
}

function readState(sp: URLSearchParams): FilterState {
  return {
    listingType: sp.get('listingType') || '',
    propertyType: sp.get('propertyType') ? sp.get('propertyType')!.split(',') : [],
    district: sp.get('district') ? sp.get('district')!.split(',') : [],
    priceRange: sp.get('price') || '',
    bedrooms: sp.get('bedrooms') || '',
    direction: sp.get('direction') ? sp.get('direction')!.split(',') : [],
    legalStatus: sp.get('legal') ? sp.get('legal')!.split(',') : [],
    areaRange: sp.get('area') || '',
    furnishing: sp.get('furnishing') ? sp.get('furnishing')!.split(',') : [],
    sort: sp.get('sort') || 'newest',
    page: Number(sp.get('page')) || 1,
  }
}

const emptyState: FilterState = {
  listingType: '', propertyType: [], district: [], priceRange: '', bedrooms: '',
  direction: [], legalStatus: [], areaRange: '', furnishing: [], sort: 'newest', page: 1,
}

function writeParams(state: FilterState): URLSearchParams {
  const params = new URLSearchParams()
  if (state.listingType) params.set('listingType', state.listingType)
  if (state.propertyType.length) params.set('propertyType', state.propertyType.join(','))
  if (state.district.length) params.set('district', state.district.join(','))
  if (state.priceRange) params.set('price', state.priceRange)
  if (state.bedrooms) params.set('bedrooms', state.bedrooms)
  if (state.direction.length) params.set('direction', state.direction.join(','))
  if (state.legalStatus.length) params.set('legal', state.legalStatus.join(','))
  if (state.furnishing.length) params.set('furnishing', state.furnishing.join(','))
  if (state.areaRange) params.set('area', state.areaRange)
  if (state.sort !== 'newest') params.set('sort', state.sort)
  if (state.page > 1) params.set('page', String(state.page))
  return params
}

function matchProperty(p: Property, s: FilterState, priceRanges: typeof PRICE_RANGES_BAN): boolean {
  if (s.listingType && p.listing_type !== s.listingType) return false
  if (s.propertyType.length && !s.propertyType.includes(p.property_type)) return false
  if (s.district.length && !s.district.includes(p.district)) return false
  if (s.priceRange) {
    const r = priceRanges.find(x => x.value === s.priceRange)
    if (r && (p.price < r.min || p.price >= r.max)) return false
  }
  if (s.bedrooms) {
    if (s.bedrooms === '5') { if (p.bedrooms < 5) return false }
    else if (p.bedrooms !== Number(s.bedrooms)) return false
  }
  if (s.direction.length && !s.direction.includes(p.direction)) return false
  if (s.legalStatus.length && !s.legalStatus.includes(p.legal_status)) return false
  if (s.furnishing.length && !s.furnishing.includes(p.furnishing)) return false
  if (s.areaRange) {
    const r = AREA_RANGES.find(x => x.value === s.areaRange)
    if (r && (p.area < r.min || p.area >= r.max)) return false
  }
  return true
}

function sortProperties(list: Property[], sort: string): Property[] {
  const arr = [...list]
  if (sort === 'price-asc') arr.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') arr.sort((a, b) => b.price - a.price)
  else if (sort === 'area-desc') arr.sort((a, b) => b.area - a.area)
  else arr.sort((a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime())
  return arr
}

function CheckboxGroup({ prefix, options, values, onToggle }: { prefix: string; options: { value: string; label: string }[]; values: string[]; onToggle: (v: string) => void }) {
  return (
    <>
      {options.map(o => (
        <label className="ndv-check" key={prefix + o.value}>
          <input type="checkbox" checked={values.includes(o.value)} onChange={() => onToggle(o.value)} /> {o.label}
        </label>
      ))}
    </>
  )
}

export default function PropertiesPage() {
  useDocumentMeta({
    title: 'Bất động sản — Tìm mua, thuê nhà đất TP.HCM | Nhà Đất Việt',
    description: 'Danh sách đầy đủ bất động sản đang bán và cho thuê tại TP.HCM: căn hộ, nhà phố, đất nền, biệt thự, shophouse. Lọc theo giá, khu vực, diện tích, hướng nhà, pháp lý.',
  })

  const { settings } = useSite()
  const { properties, loading } = useProperties()
  const [sp] = useSearchParams()
  const [state, setState] = useState<FilterState>(() => readState(sp))
  const [openPanel, setOpenPanel] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Đồng bộ lại filter khi có điều hướng THẬT sự (vd Footer/HeroSlider Link) trỏ tới
  // /bat-dong-san?... trong lúc trang này ĐÃ mount sẵn (React Router không remount lại
  // component chỉ vì query string đổi) — bỏ qua lần mount đầu vì state đã đọc từ đó rồi.
  // Không bị vòng lặp với các lần tự cập nhật URL nội bộ vì chúng dùng history.replaceState
  // thô (không qua react-router) nên location.search ở đây không đổi theo.
  const location = useLocation()
  const mountSearch = useRef(location.search)
  useEffect(() => {
    if (location.search === mountSearch.current) return
    mountSearch.current = location.search
    setState(readState(new URLSearchParams(location.search)))
  }, [location.search])

  // Đóng dropdown filter khi click ra ngoài — đúng hành vi template gốc (main.js)
  useEffect(() => {
    if (!openPanel) return
    function onClick(e: MouseEvent) {
      if (!(e.target instanceof Element) || !e.target.closest('.ndv-fbtn')) setOpenPanel(null)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [openPanel])

  const priceRanges = state.listingType === 'cho-thue' ? PRICE_RANGES_THUE : PRICE_RANGES_BAN

  const filtered = useMemo(() => sortProperties(properties.filter(p => matchProperty(p, state, priceRanges)), state.sort), [properties, state, priceRanges])
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const page = Math.min(state.page, totalPages)
  const startIdx = (page - 1) * PER_PAGE
  const pageItems = filtered.slice(startIdx, startIdx + PER_PAGE)

  useEffect(() => {
    const params = writeParams({ ...state, page })
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
  }, [state, page])

  function update(patch: Partial<FilterState>) { setState(s => ({ ...s, ...patch, page: 1 })) }
  function toggleArr(key: 'propertyType' | 'district' | 'direction' | 'legalStatus' | 'furnishing', val: string) {
    setState(s => {
      const arr = s[key]
      const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
      return { ...s, [key]: next, page: 1 }
    })
  }
  function setListingType(v: string) { setState(s => ({ ...s, listingType: v, priceRange: '', page: 1 })) }
  function clearAll() { setState(emptyState) }
  function goPage(n: number) {
    setState(s => ({ ...s, page: n }))
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const propertyTypeOptions = Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => ({ value, label }))
  const districtOptions = DISTRICTS.map(d => ({ value: d.code, label: d.name }))
  const directionOptions = Object.entries(DIRECTION_LABELS).map(([value, label]) => ({ value, label }))
  const legalOptions = Object.entries(LEGAL_LABELS).map(([value, label]) => ({ value, label }))
  const furnishingOptions = Object.entries(FURNISHING_LABELS).map(([value, label]) => ({ value, label }))

  const advCount = state.direction.length + state.legalStatus.length + state.furnishing.length + (state.areaRange ? 1 : 0)
  const totalActive = state.propertyType.length + state.district.length + state.direction.length + state.legalStatus.length
    + state.furnishing.length + (state.priceRange ? 1 : 0) + (state.bedrooms ? 1 : 0) + (state.areaRange ? 1 : 0) + (state.listingType ? 1 : 0)

  interface Chip { key: string; value: string; label: string }
  const chips: Chip[] = []
  state.propertyType.forEach(v => chips.push({ key: 'propertyType', value: v, label: PROPERTY_TYPE_LABELS[v] }))
  state.district.forEach(v => chips.push({ key: 'district', value: v, label: districtLabel(v) }))
  state.direction.forEach(v => chips.push({ key: 'direction', value: v, label: 'Hướng ' + DIRECTION_LABELS[v] }))
  state.legalStatus.forEach(v => chips.push({ key: 'legalStatus', value: v, label: LEGAL_LABELS[v] }))
  state.furnishing.forEach(v => chips.push({ key: 'furnishing', value: v, label: FURNISHING_LABELS[v] }))
  if (state.listingType) chips.push({ key: 'listingType', value: state.listingType, label: state.listingType === 'ban' ? 'Bán' : 'Cho thuê' })
  if (state.priceRange) chips.push({ key: 'priceRange', value: state.priceRange, label: priceRanges.find(r => r.value === state.priceRange)?.label ?? '' })
  if (state.bedrooms) chips.push({ key: 'bedrooms', value: state.bedrooms, label: (state.bedrooms === '5' ? '5+' : state.bedrooms) + ' phòng ngủ' })
  if (state.areaRange) chips.push({ key: 'areaRange', value: state.areaRange, label: AREA_RANGES.find(r => r.value === state.areaRange)?.label ?? '' })

  function removeChip(c: Chip) {
    if (c.key === 'propertyType' || c.key === 'district' || c.key === 'direction' || c.key === 'legalStatus' || c.key === 'furnishing') {
      toggleArr(c.key, c.value)
    } else if (c.key === 'listingType') setListingType('')
    else if (c.key === 'priceRange') update({ priceRange: '' })
    else if (c.key === 'bedrooms') update({ bedrooms: '' })
    else if (c.key === 'areaRange') update({ areaRange: '' })
  }

  const bannerImg = settings.banner_properties || 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1600&auto=format&fit=crop&q=80'

  return (
    <>
      <section className="ndv-page-header" style={{ backgroundImage: `url('${bannerImg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="ndv-container ndv-page-header-in">
          <div className="ndv-breadcrumb"><a href="/">Trang chủ</a> / <span>Bất động sản</span></div>
          <h1>Bất động sản đang giao dịch</h1>
          <p>Lọc theo giá, khu vực, diện tích, hướng nhà và tình trạng pháp lý để tìm đúng bất động sản phù hợp.</p>
        </div>
      </section>

      <section className="ndv-sec">
        <div className="ndv-container">
          <div className="ndv-toolbar">
            <div className="ndv-toolbar-row1">
              <div className="ndv-search-pill" style={{ flexShrink: 0 }}>
                <button type="button" className={state.listingType === '' ? 'active' : ''} onClick={() => setListingType('')}>Tất cả</button>
                <button type="button" className={state.listingType === 'ban' ? 'active' : ''} onClick={() => setListingType('ban')}>Bán</button>
                <button type="button" className={state.listingType === 'cho-thue' ? 'active' : ''} onClick={() => setListingType('cho-thue')}>Thuê</button>
              </div>

              <div className={'ndv-fbtn' + (openPanel === 'propertyType' ? ' open' : '')}>
                <button type="button" onClick={() => setOpenPanel(o => o === 'propertyType' ? null : 'propertyType')}>
                  Loại hình <span className="ndv-fbtn-count" hidden={!state.propertyType.length}>{state.propertyType.length}</span><IconChevronDown className="ndv-chev" />
                </button>
                <div className="ndv-fpanel"><CheckboxGroup prefix="pt-" options={propertyTypeOptions} values={state.propertyType} onToggle={v => toggleArr('propertyType', v)} /></div>
              </div>

              <div className={'ndv-fbtn' + (openPanel === 'district' ? ' open' : '')}>
                <button type="button" onClick={() => setOpenPanel(o => o === 'district' ? null : 'district')}>
                  Khu vực <span className="ndv-fbtn-count" hidden={!state.district.length}>{state.district.length}</span><IconChevronDown className="ndv-chev" />
                </button>
                <div className="ndv-fpanel"><CheckboxGroup prefix="d-" options={districtOptions} values={state.district} onToggle={v => toggleArr('district', v)} /></div>
              </div>

              <select className="ndv-sort-select" value={state.priceRange} onChange={e => update({ priceRange: e.target.value })}>
                <option value="">Tất cả mức giá</option>
                {priceRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <select className="ndv-sort-select" value={state.bedrooms} onChange={e => update({ bedrooms: e.target.value })}>
                <option value="">Số phòng ngủ</option>
                <option value="1">1 phòng ngủ</option>
                <option value="2">2 phòng ngủ</option>
                <option value="3">3 phòng ngủ</option>
                <option value="4">4 phòng ngủ</option>
                <option value="5">5+ phòng ngủ</option>
              </select>

              <div className={'ndv-fbtn' + (openPanel === 'advanced' ? ' open' : '')}>
                <button type="button" onClick={() => setOpenPanel(o => o === 'advanced' ? null : 'advanced')}>
                  Thêm bộ lọc <span className="ndv-fbtn-count" hidden={!advCount}>{advCount}</span><IconChevronDown className="ndv-chev" />
                </button>
                <div className="ndv-fpanel" style={{ minWidth: 280 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-3)', margin: '2px 0 6px' }}>Hướng nhà</p>
                  <CheckboxGroup prefix="dir-" options={directionOptions} values={state.direction} onToggle={v => toggleArr('direction', v)} />
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-3)', margin: '14px 0 6px' }}>Tình trạng pháp lý</p>
                  <CheckboxGroup prefix="leg-" options={legalOptions} values={state.legalStatus} onToggle={v => toggleArr('legalStatus', v)} />
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-3)', margin: '14px 0 6px' }}>Diện tích</p>
                  <select value={state.areaRange} onChange={e => update({ areaRange: e.target.value })}>
                    <option value="">Tất cả diện tích</option>
                    {AREA_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-3)', margin: '14px 0 6px' }}>Tình trạng nội thất</p>
                  <CheckboxGroup prefix="fur-" options={furnishingOptions} values={state.furnishing} onToggle={v => toggleArr('furnishing', v)} />
                </div>
              </div>

              <select className="ndv-sort-select" value={state.sort} onChange={e => update({ sort: e.target.value })}>
                <option value="newest">Mới đăng</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="area-desc">Diện tích lớn nhất</option>
              </select>

              <span className="ndv-toolbar-count" aria-live="polite">
                {filtered.length === 0 ? 'Không tìm thấy bất động sản phù hợp' : <>Hiển thị <b>{startIdx + 1}–{Math.min(startIdx + PER_PAGE, filtered.length)}</b> trong <b>{filtered.length}</b> bất động sản</>}
              </span>

              <button className="ndv-mobile-filter-btn" onClick={() => setMobileOpen(true)}>
                <IconFilterBars /> Bộ lọc <span className="ndv-fbtn-count" hidden={!totalActive}>{totalActive}</span>
              </button>
            </div>

            {chips.length > 0 && (
              <div className="ndv-toolbar-row2">
                {chips.map(c => (
                  <span className="ndv-active-chip" key={c.key + c.value}>{c.label}<button type="button" aria-label="Xóa" onClick={() => removeChip(c)}>✕</button></span>
                ))}
                <button type="button" className="ndv-clear-all" onClick={clearAll}>Xóa tất cả</button>
              </div>
            )}
          </div>

          <div ref={gridRef}>
            {loading ? (
              <div className="ndv-empty"><h3>Đang tải dữ liệu...</h3></div>
            ) : pageItems.length === 0 ? (
              <div className="ndv-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <h3>Không tìm thấy bất động sản phù hợp</h3>
                <p>Hãy thử điều chỉnh hoặc xóa bớt bộ lọc đang áp dụng.</p>
                <button className="ndv-btn ndv-btn-primary" onClick={clearAll}>Xóa tất cả bộ lọc</button>
              </div>
            ) : (
              <div className="ndv-prop-grid">
                {pageItems.map(p => <PropertyCard key={p.id} p={p} />)}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Phân trang" className="ndv-pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} className={'ndv-page-btn' + (n === page ? ' active' : '')} onClick={() => goPage(n)}>{n}</button>
              ))}
            </nav>
          )}
        </div>
      </section>

      {mobileOpen && (
        <div className="offcanvas offcanvas-start show" tabIndex={-1} style={{ visibility: 'visible', display: 'block' }}>
          <div className="offcanvas-header">
            <h5 className="ndv-offcanvas-title">Bộ lọc tìm kiếm</h5>
            <button type="button" className="btn-close" aria-label="Đóng" onClick={() => setMobileOpen(false)}></button>
          </div>
          <div className="offcanvas-body">
            <div className="ndv-fpanel-mobile">
              <h4>Nhu cầu</h4>
              <div className="ndv-search-pill">
                <button type="button" className={state.listingType === '' ? 'active' : ''} onClick={() => setListingType('')}>Tất cả</button>
                <button type="button" className={state.listingType === 'ban' ? 'active' : ''} onClick={() => setListingType('ban')}>Bán</button>
                <button type="button" className={state.listingType === 'cho-thue' ? 'active' : ''} onClick={() => setListingType('cho-thue')}>Thuê</button>
              </div>
            </div>
            <div className="ndv-fpanel-mobile">
              <h4>Loại hình</h4>
              <CheckboxGroup prefix="mpt-" options={propertyTypeOptions} values={state.propertyType} onToggle={v => toggleArr('propertyType', v)} />
            </div>
            <div className="ndv-fpanel-mobile">
              <h4>Khu vực</h4>
              <CheckboxGroup prefix="md-" options={districtOptions} values={state.district} onToggle={v => toggleArr('district', v)} />
            </div>
            <div className="ndv-fpanel-mobile">
              <h4>Khoảng giá</h4>
              <select value={state.priceRange} onChange={e => update({ priceRange: e.target.value })}>
                <option value="">Tất cả mức giá</option>
                {priceRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="ndv-fpanel-mobile">
              <h4>Số phòng ngủ</h4>
              <select value={state.bedrooms} onChange={e => update({ bedrooms: e.target.value })}>
                <option value="">Tất cả</option>
                <option value="1">1 phòng ngủ</option>
                <option value="2">2 phòng ngủ</option>
                <option value="3">3 phòng ngủ</option>
                <option value="4">4 phòng ngủ</option>
                <option value="5">5+ phòng ngủ</option>
              </select>
            </div>
            <div className="ndv-fpanel-mobile">
              <h4>Hướng nhà</h4>
              <CheckboxGroup prefix="mdir-" options={directionOptions} values={state.direction} onToggle={v => toggleArr('direction', v)} />
            </div>
            <div className="ndv-fpanel-mobile">
              <h4>Tình trạng pháp lý</h4>
              <CheckboxGroup prefix="mleg-" options={legalOptions} values={state.legalStatus} onToggle={v => toggleArr('legalStatus', v)} />
            </div>
            <div className="ndv-fpanel-mobile">
              <h4>Diện tích</h4>
              <select value={state.areaRange} onChange={e => update({ areaRange: e.target.value })}>
                <option value="">Tất cả diện tích</option>
                {AREA_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="ndv-fpanel-mobile">
              <h4>Tình trạng nội thất</h4>
              <CheckboxGroup prefix="mfur-" options={furnishingOptions} values={state.furnishing} onToggle={v => toggleArr('furnishing', v)} />
            </div>
            <div className="ndv-fpanel-mobile">
              <h4>Sắp xếp</h4>
              <select value={state.sort} onChange={e => update({ sort: e.target.value })}>
                <option value="newest">Mới đăng</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="area-desc">Diện tích lớn nhất</option>
              </select>
            </div>
            <button className="ndv-btn ndv-btn-ghost ndv-btn-block" onClick={() => { clearAll(); setMobileOpen(false) }}>Xóa tất cả bộ lọc</button>
          </div>
        </div>
      )}
      {mobileOpen && <div className="offcanvas-backdrop show" onClick={() => setMobileOpen(false)}></div>}
    </>
  )
}
