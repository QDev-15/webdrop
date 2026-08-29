import { Link } from 'react-router-dom'
import type { Property } from '../types'
import { PROPERTY_TYPE_LABELS, LEGAL_LABELS, DIRECTION_LABELS, BADGE_LABELS, formatPrice, districtLabel } from '../data/propertyMeta'
import { IconPin, IconArea, IconBed, IconBath } from './icons'

export default function PropertyCard({ p }: { p: Property }) {
  const listingLabel = p.listing_type === 'ban' ? 'Bán' : 'Cho thuê'
  return (
    <Link to={`/bat-dong-san/${p.slug}`} className="ndv-prop-card" data-reveal="">
      <div className="ndv-prop-thumb">
        <img src={p.images[0]} alt={p.title} loading="lazy" />
        <div className="ndv-prop-badges">
          {p.badge && <span className={`ndv-badge ndv-badge-${p.badge}`}>{BADGE_LABELS[p.badge]}</span>}
        </div>
        <span className="ndv-prop-listing-tag">{listingLabel}</span>
        <span className="ndv-prop-type-tag">{PROPERTY_TYPE_LABELS[p.property_type]}</span>
      </div>
      <div className="ndv-prop-body">
        <div className="ndv-prop-price">{formatPrice(p.price, p.price_unit)}</div>
        <div className="ndv-prop-title">{p.title}</div>
        <div className="ndv-prop-addr"><IconPin /><span>{p.street}, {districtLabel(p.district)}, TP.HCM</span></div>
        <div className="ndv-prop-meta">
          {p.area > 0 && <span><IconArea /> {p.area}m²</span>}
          {p.bedrooms > 0 && <span><IconBed /> {p.bedrooms} PN</span>}
          {p.bathrooms > 0 && <span><IconBath /> {p.bathrooms} WC</span>}
        </div>
        <div className="ndv-prop-legal">{LEGAL_LABELS[p.legal_status]} · Hướng {DIRECTION_LABELS[p.direction]}</div>
      </div>
    </Link>
  )
}
