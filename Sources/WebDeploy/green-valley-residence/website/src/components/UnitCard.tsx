import { Link } from 'react-router-dom'
import type { UnitType } from '../utils/format'
import { DIRECTION_LABELS, STATUS_LABELS, TYPE_LABELS, formatVND } from '../utils/format'

interface Props {
  unit: UnitType
  variant?: 'featured' | 'catalog' | 'related'
}

export default function UnitCard({ unit: u, variant = 'catalog' }: Props) {
  const st = STATUS_LABELS[u.status] ?? { label: u.status, cls: '' }
  const showTag = variant !== 'featured'
  const showView = variant !== 'featured'
  const showFloor = variant === 'catalog'
  const showDirection = variant !== 'related'

  return (
    <Link to={`/loai-can-chi-tiet?loai=${u.slug}`} className="gvr-unit-card gvr-card">
      <div className="gvr-unit-thumb">
        <img src={u.gallery[0]} alt={u.name} loading="lazy" />
        <span className={`gvr-unit-ribbon ${st.cls}`}>{st.label}</span>
        {showTag && <span className="gvr-unit-tag">{TYPE_LABELS[u.type_tag] ?? u.type_tag}</span>}
      </div>
      <div className="gvr-unit-body">
        <div className="gvr-unit-cat">{u.block}{showView && u.view_desc ? ` · ${u.view_desc}` : ''}</div>
        <div className="gvr-unit-name">{u.name}</div>
        <div className="gvr-unit-meta">
          <span>🛏 {u.bedrooms} PN</span>
          <span>📐 {u.area}m²</span>
          {showDirection && <span>🧭 {DIRECTION_LABELS[u.direction] ?? u.direction}</span>}
          {showFloor && <span>🏢 Tầng {u.floor_range}</span>}
        </div>
        <div className="gvr-unit-price-row">
          <div className="gvr-unit-price">{formatVND(u.price_from)} <span>từ</span></div>
          <div className="gvr-unit-more">Chi tiết →</div>
        </div>
      </div>
    </Link>
  )
}
