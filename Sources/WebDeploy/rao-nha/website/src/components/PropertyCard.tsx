import { Link } from 'react-router-dom'
import { Listing, TYPE_LABELS, formatPrice } from '../lib/listings'

function TierBadge({ tier }: { tier: string }) {
  if (tier === 'vip-kim-cuong') return <span className="rn-tier rn-tier-kc">💎 VIP Kim Cương</span>
  if (tier === 'vip-vang') return <span className="rn-tier rn-tier-vang">★ VIP Vàng</span>
  if (tier === 'vip-bac') return <span className="rn-tier rn-tier-bac">VIP Bạc</span>
  return null
}
function StatusBadge({ badge }: { badge: string | null }) {
  if (badge === 'moi') return <span className="rn-badge rn-badge-moi">Mới đăng</span>
  if (badge === 'hot') return <span className="rn-badge rn-badge-hot">🔥 Hot</span>
  return null
}

export default function PropertyCard({ p }: { p: Listing }) {
  return (
    <Link to={`/chi-tiet-bds?slug=${p.slug}`} className="rn-card" data-reveal>
      <div className="rn-card-img">
        <img src={p.images[0]} alt={p.title} loading="lazy"
          onError={e => { (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23e5f5ec%22/%3E%3C/svg%3E' }} />
        <span className="rn-card-need">{p.listing_type === 'ban' ? 'Bán' : 'Cho thuê'}</span>
        <StatusBadge badge={p.badge} />
        <TierBadge tier={p.tier} />
      </div>
      <div className="rn-card-body">
        <div className="rn-card-price">{formatPrice(p.price, p.listing_type)}</div>
        <h3 className="rn-card-title">{p.title}</h3>
        <div className="rn-card-meta">
          <span>{p.area}m²</span>
          {p.bedrooms > 0 ? <span>{p.bedrooms} PN</span> : <span>Đất nền</span>}
          <span>📍 {p.district}</span>
        </div>
        <div className="rn-card-foot">
          <span className="rn-card-poster">{p.poster.name}</span>
          <span className="rn-card-type">{TYPE_LABELS[p.property_type]}</span>
        </div>
      </div>
    </Link>
  )
}
