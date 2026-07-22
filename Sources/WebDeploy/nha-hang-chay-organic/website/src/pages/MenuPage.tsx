import { useState, useEffect } from 'react'
import { useSite } from '../contexts/SiteContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number | null
  image: string
  calories: string
  tags: string
  category_name: string
  category_id: number | null
  featured: number
}

function formatPrice(price: number | null): string {
  if (price == null) return ''
  return price.toLocaleString('vi-VN') + 'đ'
}

const CATEGORY_ICONS: Record<string, string> = {
  'Khai Vị': '🥗',
  'Salad Organic': '🥬',
  'Món Chính': '🍱',
  'Nước Ép & Trà': '🍵',
  'Tráng Miệng': '🍮',
}

export default function MenuPage() {
  const { settings, menuItems, menuCategories } = useSite()
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  useDocumentMeta({
    title: `Thực Đơn Chay Organic — ${settings.site_name || 'Lá Xanh Chay Organic'}`,
    description: 'Hơn 50 món chay organic theo mùa — khai vị, salad, món chính, nước ép và tráng miệng, đầy đủ thông tin calorie và nguồn gốc nguyên liệu.',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('.reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            ro.unobserve(e.target)
          }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, [menuItems, menuCategories])

  // Group items by category
  const grouped = menuItems.reduce<Record<number, MenuItem[]>>((acc, item) => {
    const catId = item.category_id ?? 0
    if (!acc[catId]) acc[catId] = []
    acc[catId].push(item as MenuItem)
    return acc
  }, {})

  const filteredCategories = activeCategory
    ? menuCategories.filter(c => c.id === activeCategory)
    : menuCategories

  // Fallback static menu data
  const fallbackCategories = [
    { id: 1, name: 'Khai Vị', items: [
      { id: 1, name: 'Súp Bí Đỏ & Gừng Tươi', desc: 'Bí đỏ hữu cơ hầm mềm, xay nhuyễn cùng gừng tươi và sữa hạnh nhân. Vị ngọt bùi tự nhiên, không cần đường.', price: 59000, cal: '210 kcal · Gluten-free · Vegan', tags: ['Bí đỏ organic', 'Gừng tươi', 'Sữa hạnh nhân'] },
      { id: 2, name: 'Chả Giò Chay Kiểu Sài Gòn', desc: 'Vỏ bánh gạo giòn rụm, nhân đậu phụ, miến, mộc nhĩ, hành tây. Chấm tương chua ngọt thảo mộc.', price: 55000, cal: '280 kcal (4 cái) · Vegan', tags: ['Bún tàu', 'Nấm mộc nhĩ', 'Đậu phụ'] },
      { id: 3, name: 'Gỏi Xoài Xanh Mùa Hè', desc: 'Xoài xanh thái sợi, rau thơm, cà rốt, đậu phộng rang. Sốt tắc sả đặc biệt — chua ngọt mát lạnh.', price: 55000, cal: '185 kcal · Raw · Gluten-free', tags: ['Xoài Cát Chu', 'Rau thơm hữu cơ', 'Đậu phộng rang'] },
      { id: 4, name: 'Nấm Cuộn Rau Mầm', desc: 'Nấm hương phi mềm, cuộn cùng rau mầm, bơ thái hạt lựu, sốt miso trắng. Thanh mát nhẹ bụng.', price: 65000, cal: '160 kcal · Raw · Vegan', tags: ['Nấm hương', 'Rau mầm hữu cơ'] },
    ]},
    { id: 2, name: 'Salad Organic', items: [
      { id: 5, name: 'Salad Mùa Hè Organic', desc: 'Mix rau organic Đà Lạt, cà chua bi, dưa leo, ớt chuông đỏ, hạt chia. Sốt balsamic mật ong thảo mộc.', price: 69000, cal: '180 kcal · Raw · Vegan', tags: ['Rau củ Đà Lạt', 'Hạt chia', 'Balsamic mật ong'] },
      { id: 6, name: 'Caesar Chay với Đậu Hũ Giòn', desc: 'Rau cải romaine tươi giòn, đậu hũ chiên giòn thay crouton, sốt Caesar thuần chay từ hạt điều rang.', price: 79000, cal: '295 kcal · Vegan', tags: ['Romaine lettuce', 'Đậu hũ giòn', 'Sốt Caesar chay'] },
      { id: 7, name: 'Salad Rau Mầm & Quinoa', desc: 'Quinoa protein cao, rau mầm đủ loại, bơ thái hạt lựu, cà rốt tím, sốt tahini chanh tươi.', price: 85000, cal: '340 kcal · Protein-rich · Gluten-free', tags: ['Quinoa hữu cơ', 'Rau mầm tươi', 'Bơ chín'] },
    ]},
    { id: 3, name: 'Món Chính', items: [
      { id: 8, name: 'Buddha Bowl Rực Rỡ', desc: 'Quinoa protein cao, rau mầm, bơ, cà rốt tím, đậu hữu cơ nướng giòn, sốt tahini chanh. No bụng lâu, no đủ chất.', price: 89000, cal: '420 kcal · High-protein · Vegan', tags: ['Quinoa', 'Đậu hũ nướng', 'Sốt tahini'] },
      { id: 9, name: 'Cơm Gạo Lứt Chay Đủ Chất', desc: 'Cơm gạo lứt ST25 hữu cơ, 3 loại rau xào miso, nấm đùi gà rang bơ tỏi, canh rau củ dashi chay.', price: 85000, cal: '380 kcal · Balanced · Vegan', tags: ['Gạo lứt hữu cơ', 'Rau xào miso', 'Nấm rang'] },
      { id: 10, name: 'Canh Nấm Hầm Thảo Dược', desc: 'Nấm đông cô, linh chi đỏ, táo đỏ, kỷ tử, sen hạt hầm 4 giờ. Ngọt thanh, tốt cho sức khỏe nội tạng.', price: 75000, cal: '145 kcal · Medicinal · Vegan', tags: ['Nấm đông cô', 'Linh chi', 'Táo đỏ'] },
      { id: 11, name: 'Bún Bò Huế Chay', desc: 'Nước dùng nấu từ sả, mắm ruốc chay đặc chế, nấm bào ngư thay thịt, rau sống tươi. Chuẩn vị Huế.', price: 79000, cal: '390 kcal · Vegan', tags: ['Bún tươi', 'Nấm bào ngư', 'Sả mắm ruốc chay'] },
      { id: 12, name: 'Mì Hạt Điều Xào Rau', desc: 'Mì lúa mì hữu cơ, xào cùng rau củ Đà Lạt, sốt hạt điều rang béo ngậy, ít cay nhẹ nhàng.', price: 82000, cal: '410 kcal · Vegan', tags: ['Mì lúa mì hữu cơ', 'Rau củ hữu cơ', 'Sốt hạt điều'] },
    ]},
    { id: 4, name: 'Nước Ép & Trà', items: [
      { id: 13, name: 'Nước Ép Detox Xanh', desc: 'Cải xoăn, táo xanh, cần tây, gừng tươi, chanh vàng. Detox toàn thân, tinh thần sảng khoái.', price: 55000, cal: '95 kcal · Cold-pressed', tags: ['Cải xoăn', 'Táo xanh', 'Gừng'] },
      { id: 14, name: 'Trà Hoa Cúc Mật Ong', desc: 'Cúc khô hữu cơ, mật ong rừng nguyên chất, chanh tươi. Phục hồi mắt, giảm căng thẳng.', price: 42000, cal: '45 kcal · Caffeine-free', tags: ['Cúc hữu cơ', 'Mật ong rừng'] },
      { id: 15, name: 'Sữa Hạt Tươi (Hạnh Nhân / Yến Mạch)', desc: 'Sữa hạt ép lạnh tươi mỗi ngày, không chất ổn định, không hương nhân tạo. Chọn vị: hạnh nhân hoặc yến mạch.', price: 49000, cal: '120–150 kcal · Dairy-free', tags: ['Hạt hữu cơ', 'Không đường tinh luyện'] },
      { id: 16, name: 'Matcha Latte Organic', desc: 'Matcha ceremony grade từ Uji Nhật Bản, sữa yến mạch hữu cơ, một chút mật ong. Thanh đắng nhẹ, hậu ngọt dịu.', price: 62000, cal: '165 kcal · Vegan', tags: ['Matcha Nhật A-Grade', 'Sữa yến mạch'] },
    ]},
    { id: 5, name: 'Tráng Miệng', items: [
      { id: 17, name: 'Bánh Mousse Xoài & Dừa', desc: 'Mousse xoài thuần chay, đế hạt cashew nghiền, kem dừa tươi, phủ gelée lá dứa. Không cần lò nướng, 100% nguyên liệu tươi.', price: 55000, cal: '240 kcal · No-bake · Vegan', tags: ['Xoài Cát Chu', 'Kem dừa tươi', 'Đế cashew'] },
      { id: 18, name: 'Chè Dưỡng Sinh Bạch Mộc Nhĩ', desc: 'Bạch mộc nhĩ collagen chay, hạt sen Huế, thạch mã thầy, đường phèn thiên nhiên. Mát gan, đẹp da, ngủ ngon.', price: 45000, cal: '175 kcal · Medicinal · Vegan', tags: ['Bạch mộc nhĩ', 'Sen hạt', 'Thạch mã thầy'] },
      { id: 19, name: 'Chocolate Tart Thuần Chay', desc: 'Cacao 70% không sữa, đế từ chà là nghiền và hạt điều, kem dừa tươi. Ngọt tự nhiên, không đường tinh luyện.', price: 59000, cal: '290 kcal · Vegan · No refined sugar', tags: ['Cacao 70%', 'Đế date & hạt', 'Kem dừa'] },
    ]},
  ]

  const useFallback = menuItems.length === 0

  return (
    <main>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-eyebrow">Thực đơn</div>
          <h1 className="ph-title">Thực Đơn Chay <em>Organic</em></h1>
          <p className="ph-sub">Hơn 50 món chay được làm mới theo mùa — đầy đủ dinh dưỡng, rõ ràng calorie, và luôn tươi ngon.</p>
        </div>
      </div>

      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          {/* Category filter tabs */}
          {!useFallback && menuCategories.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <button
                onClick={() => setActiveCategory(null)}
                style={{
                  padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: '1px solid var(--border)', background: activeCategory === null ? 'var(--accent)' : 'var(--surface)', color: activeCategory === null ? '#fff' : 'var(--text-2)', transition: 'all .2s',
                }}>
                Tất cả
              </button>
              {menuCategories.map(cat => (
                <button key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', border: '1px solid var(--border)', background: activeCategory === cat.id ? 'var(--accent)' : 'var(--surface)', color: activeCategory === cat.id ? '#fff' : 'var(--text-2)', transition: 'all .2s',
                  }}>
                  {CATEGORY_ICONS[cat.name] || '🍽'} {cat.name}
                </button>
              ))}
            </div>
          )}

          <div className="row g-5">
            <div className="col-lg-8">
              {useFallback ? (
                fallbackCategories.map(cat => (
                  <div key={cat.id} className="menu-section reveal">
                    <div className="ms-header">
                      <span className="ms-icon">{CATEGORY_ICONS[cat.name] || '🍽'}</span>
                      <span className="ms-title">{cat.name}</span>
                    </div>
                    {cat.items.map(item => (
                      <div key={item.id} className="menu-row">
                        <div className="menu-row-info">
                          <div className="menu-row-name">{item.name}</div>
                          <div className="menu-row-tags">
                            {item.tags.map(tag => <span key={tag} className="ingredient-tag">{tag}</span>)}
                          </div>
                          <div className="menu-row-desc">{item.desc}</div>
                          <div className="menu-row-cal">{item.cal}</div>
                        </div>
                        <div className="menu-row-price">{formatPrice(item.price)}</div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                filteredCategories.map(cat => (
                  <div key={cat.id} className="menu-section reveal">
                    <div className="ms-header">
                      <span className="ms-icon">{CATEGORY_ICONS[cat.name] || '🍽'}</span>
                      <span className="ms-title">{cat.name}</span>
                    </div>
                    {(grouped[cat.id] || []).map(item => {
                      const tags = (item.tags || '').split(',').filter(Boolean)
                      return (
                        <div key={item.id} className="menu-row">
                          <div className="menu-row-info">
                            <div className="menu-row-name">{item.name}</div>
                            {tags.length > 0 && (
                              <div className="menu-row-tags">
                                {tags.map(tag => <span key={tag} className="ingredient-tag">{tag.trim()}</span>)}
                              </div>
                            )}
                            <div className="menu-row-desc">{item.description}</div>
                            {item.calories && <div className="menu-row-cal">{item.calories}</div>}
                          </div>
                          <div className="menu-row-price">{formatPrice(item.price)}</div>
                        </div>
                      )
                    })}
                    {(grouped[cat.id] || []).length === 0 && (
                      <div style={{ padding: '16px 0', fontSize: '14px', color: 'var(--text-3)' }}>Chưa có món ăn trong danh mục này.</div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div style={{ position: 'sticky', top: '84px' }}>
                <div className="info-card reveal mb-4">
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>🥦 Cam kết của chúng tôi</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      '100% thuần chay — không nguyên liệu động vật',
                      'Rau củ organic có chứng nhận VietGAP',
                      'Không chất bảo quản, không phụ gia nhân tạo',
                      'Thông tin calorie rõ ràng mỗi món',
                      'Phù hợp cho người ăn kiêng, tiểu đường, dị ứng gluten',
                    ].map(t => (
                      <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-2)' }}>
                        <span style={{ color: 'var(--accent)', fontSize: '16px', flexShrink: 0 }}>✓</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="info-card reveal mb-4">
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>🕐 Giờ phục vụ</div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-2)' }}>
                    {[
                      { day: 'Thứ 2 – Thứ 6', hours: '07:00 – 21:00' },
                      { day: 'Thứ 7', hours: '07:00 – 22:00' },
                      { day: 'Chủ nhật', hours: '08:00 – 21:00' },
                    ].map((r, i) => (
                      <div key={r.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none' }}>
                        <span>{r.day}</span><span style={{ fontWeight: 600, color: 'var(--text)' }}>{r.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="info-card reveal">
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>🌿 Ký hiệu thực đơn</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                    {[
                      { tag: 'Organic', desc: 'Nguyên liệu hữu cơ chứng nhận' },
                      { tag: 'Raw', desc: 'Không qua chế biến nhiệt' },
                      { tag: 'Gluten-free', desc: 'Không chứa gluten' },
                      { tag: 'Seasonal', desc: 'Thực đơn theo mùa' },
                    ].map(s => (
                      <div key={s.tag} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="ingredient-tag">{s.tag}</span>
                        <span style={{ color: 'var(--text-2)' }}>{s.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
