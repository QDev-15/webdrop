import { useSite } from '../contexts/SiteContext'
import { Link } from 'react-router-dom'

function formatPrice(price: number | null): string {
  if (price == null) return ''
  return price.toLocaleString('vi-VN') + 'đ'
}

export default function FeaturedMenu() {
  const { featuredItems } = useSite()

  const bgColors = [
    'var(--accent-light)',
    '#f0fdf4',
    '#fffbeb',
    '#f5f3ff',
  ]

  const items = featuredItems.length > 0 ? featuredItems.slice(0, 4) : [
    { id: 1, name: 'Buddha Bowl Rực Rỡ', category_name: 'Món chính', description: 'Quinoa, rau mầm, bơ, cà rốt tím, đậu hũ nướng, sốt tahini chanh.', price: 89000, calories: '320 kcal', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80&auto=format&fit=crop', featured: 1, tags: 'Raw,Gluten-free', category_id: null, category_slug: '', sort_order: 1 },
    { id: 2, name: 'Salad Mùa Hè Organic', category_name: 'Salad', description: 'Rau củ organic Đà Lạt, hạt chia, sốt balsamic mật ong thảo mộc.', price: 69000, calories: '180 kcal', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80&auto=format&fit=crop', featured: 1, tags: 'Organic', category_id: null, category_slug: '', sort_order: 2 },
    { id: 3, name: 'Canh Nấm Hầm Thảo Dược', category_name: 'Món nóng', description: 'Nấm đông cô, linh chi, hầm 4 giờ cùng táo đỏ, kỷ tử, sen hạt.', price: 75000, calories: '210 kcal', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80&auto=format&fit=crop', featured: 1, tags: 'Seasonal', category_id: null, category_slug: '', sort_order: 3 },
    { id: 4, name: 'Bánh Mousse Xoài & Dừa', category_name: 'Tráng miệng', description: 'Mousse xoài Cát Chu, kem dừa tươi, đế hạt cashew, phủ gelée lá dứa.', price: 55000, calories: '240 kcal', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80&auto=format&fit=crop', featured: 1, tags: 'Vegan dessert', category_id: null, category_slug: '', sort_order: 4 },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Thực đơn</div>
          <h2 className="sec-title">Những món <em>được yêu thích</em> nhất</h2>
          <p className="sec-sub">Phong phú, đa dạng khẩu vị — từ món nhẹ khai vị đến món chính no bụng, từ tươi mát đến ấm áp nuôi dưỡng.</p>
        </div>
        <div className="row g-4">
          {items.map((item, i) => {
            const tags = (item.tags || '').split(',').filter(Boolean)
            return (
              <div key={item.id} className={`col-md-6 col-lg-3 reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
                <div className="seasonal-card" style={{ background: bgColors[i % bgColors.length], border: '1px solid var(--border)' }}>
                  <div className="sc-thumb">
                    <img
                      className="sc-img"
                      src={item.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80&auto=format&fit=crop'}
                      alt={item.name}
                      loading="lazy"
                    />
                    {tags.length > 0 && (
                      <div className="sc-tag-bar">
                        {tags.map(tag => (
                          <span key={tag} className="ingredient-tag">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="sc-body">
                    <div className="sc-cat">{item.category_name}</div>
                    <div className="sc-name">{item.name}</div>
                    <div className="sc-desc">{item.description}</div>
                    <div className="sc-foot">
                      <span className="sc-price">{item.price ? formatPrice(item.price) : ''}</span>
                      <span className="sc-cal">{item.calories}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center mt-5 reveal">
          <Link to="/thuc-don" className="btn-ghost">Xem toàn bộ thực đơn →</Link>
        </div>
      </div>
    </section>
  )
}
