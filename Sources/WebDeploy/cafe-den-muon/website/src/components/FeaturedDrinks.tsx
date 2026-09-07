import { useSite } from '../contexts/SiteContext'
import { formatVND } from '../utils/text'

// "Thức uống nổi bật" — trang chủ, 4 món có featured=1 (khớp menu.html gốc)
export default function FeaturedDrinks() {
  const { menuItems } = useSite()
  const items = menuItems.filter(i => i.featured === 1 && i.status === 'published').slice(0, 4)
  if (items.length === 0) return null

  return (
    <div className="row g-4">
      {items.map((item, i) => (
        <div className="col-6 col-md-3" key={item.id}>
          <div className={`cdm-drink-card reveal reveal-d${Math.min(i + 1, 3)}`}>
            {item.image && <img className="cdm-dc-img" src={item.image} alt={item.name} loading="lazy" />}
            <div className="cdm-dc-body">
              {item.badge && <span className="cdm-dc-tag">{item.badge}</span>}
              <div className="cdm-dc-name">{item.name}</div>
              <div className="cdm-dc-desc">{item.description}</div>
              <div className="cdm-dc-price">{formatVND(item.price)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
