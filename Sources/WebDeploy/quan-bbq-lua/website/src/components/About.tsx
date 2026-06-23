import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number | null
  price_sale: number | null
  price_unit: string
  image: string
  badge: string
}

const MEAT_ITEMS = [
  { icon: '🥩', name: 'Bò Ribeye', desc: 'Bò Mỹ nhập khẩu, mỡ xen đều, mềm tan khi nướng vừa lửa', price: 'từ 89.000đ/100g' },
  { icon: '🐷', name: 'Ba Chỉ Heo', desc: 'Ba chỉ nội địa tươi, mỡ-nạc xen kẽ hoàn hảo, ướp sả gừng đặc trưng', price: 'từ 49.000đ/100g' },
  { icon: '🐑', name: 'Thịt Cừu', desc: 'Cừu Úc nhập khẩu, thái lát mỏng, hương thơm đặc trưng không gây gắt', price: 'từ 79.000đ/100g' },
  { icon: '🍗', name: 'Cánh Gà', desc: 'Cánh gà ta chắc thịt, ướp sa tế hoặc mật ong chanh theo sở thích', price: 'từ 35.000đ/100g' },
  { icon: '🦐', name: 'Tôm Sú', desc: 'Tôm sú tươi sống, size lớn, nướng than hoa giữ trọn vị ngọt biển', price: 'từ 59.000đ/con' },
  { icon: '🐄', name: 'Bò Wagyu', desc: 'Wagyu A5 Nhật Bản, vân mỡ đẹp, tan chảy ngay khi chạm lửa', price: 'từ 199.000đ/100g' },
]

const STATIC_COMBOS = [
  { name: 'Combo Lửa Đỏ — Bò & Heo', cat: 'Combo 2 người', price: '249.000đ', old: '299.000đ', badge: 'BEST SELLER', badgeClass: 'bestseller', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80&auto=format&fit=crop', desc: 'Thịt bò ribeye thái mỏng, ba chỉ heo ướp sả, cổ heo muối xả, kèm rau sống tươi, nước chấm đặc biệt và cơm cuộn tự làm.', tags: ['Bò ribeye 200g','Ba chỉ heo 200g','Cổ heo 150g','Rau sống','Nước chấm'] },
  { name: 'Combo Biển Lửa — Hải Sản', cat: 'Combo 2 người', price: '319.000đ', old: '', badge: 'NEW', badgeClass: 'new', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop', desc: 'Tôm sú to, mực ống tươi, sò điệp bơ tỏi, cá hồi Na Uy. Nướng trên than hoa, giữ trọn vị ngọt tự nhiên của biển cả.', tags: ['Tôm sú 4 con','Mực ống 200g','Sò điệp 6 con','Cá hồi 150g','Bơ tỏi'] },
  { name: 'Combo Hoàng Gia — Premium Mixed', cat: 'Combo 4 người', price: '599.000đ', old: '699.000đ', badge: 'VIP', badgeClass: 'vip', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&auto=format&fit=crop', desc: 'Dành cho nhóm 4 người muốn thưởng thức đầy đủ nhất. Kết hợp bò Wagyu, tôm sú, sườn heo, cánh gà nướng sa tế.', tags: ['Bò Wagyu 200g','Tôm sú 6 con','Sườn heo 400g','Cánh gà 8 cái','Nấm & Rau','4 lon nước'] },
]

export default function About() {
  const [combos, setCombos] = useState<MenuItem[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<MenuItem[]>('/public/menu-items')
      .then(items => {
        const comboItems = items.filter(i => i.name.toLowerCase().includes('combo')).slice(0, 3)
        setCombos(comboItems)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const els = ref.current?.querySelectorAll<HTMLElement>('[data-reveal]:not(.visible)')
      if (!els?.length) return
      const ro = new IntersectionObserver(entries =>
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      , { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(t)
  }, [combos])

  const TAGS_MAP: Record<string, string[]> = {
    'Combo Lửa Đỏ': ['Bò ribeye 200g','Ba chỉ heo 200g','Cổ heo 150g','Rau sống','Nước chấm'],
    'Combo Biển Lửa': ['Tôm sú 4 con','Mực ống 200g','Sò điệp 6 con','Cá hồi 150g','Bơ tỏi'],
    'Combo Hoàng Gia': ['Bò Wagyu 200g','Tôm sú 6 con','Sườn heo 400g','Cánh gà 8 cái','Nấm & Rau','4 lon nước'],
    'Combo Tiệc': ['Thực đơn tùy chọn','2 bếp nướng','Đặt trước 1 ngày'],
  }
  const COMBO_IMG = [
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&auto=format&fit=crop',
  ]

  function badgeClass(badge: string) {
    const b = (badge || '').toUpperCase()
    if (b.includes('BEST') || b.includes('SELLER')) return 'bestseller'
    if (b === 'NEW') return 'new'
    if (b === 'VIP') return 'vip'
    return 'bestseller'
  }

  function getTags(name: string) {
    for (const key of Object.keys(TAGS_MAP)) {
      if (name.includes(key)) return TAGS_MAP[key]
    }
    return []
  }

  const displayCombos = combos.length > 0 ? combos.map((c, i) => ({
    name: c.name,
    cat: 'Combo',
    price: c.price ? c.price.toLocaleString('vi-VN') + 'đ' : '—',
    old: c.price_sale ? c.price_sale.toLocaleString('vi-VN') + 'đ' : '',
    badge: c.badge,
    badgeClass: badgeClass(c.badge),
    img: c.image || COMBO_IMG[i] || COMBO_IMG[0],
    desc: c.description,
    tags: getTags(c.name),
  })) : STATIC_COMBOS

  return (
    <div ref={ref}>
      {/* Combo & Set */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center" data-reveal style={{ marginBottom: 40 }}>
            <div className="eyebrow">Combo & Set</div>
            <h2 className="sec-title">Chọn <em>combo ngay</em> — ăn thả ga</h2>
            <p className="sec-sub">Combo tiết kiệm, đa dạng khẩu vị. Phù hợp nhóm 2–8 người, có thể kết hợp tự do theo sở thích.</p>
          </div>
          <div className="d-flex flex-column gap-4">
            {displayCombos.map((c, i) => (
              <div key={i} className="combo-card" data-reveal>
                <div className="cc-thumb">
                  <img className="cc-img" src={c.img} alt={c.name} loading="lazy" />
                  {c.badge && <span className={`cc-badge ${c.badgeClass}`}>{c.badge}</span>}
                </div>
                <div className="cc-body">
                  <div className="cc-cat">{c.cat}</div>
                  <div className="cc-name">{c.name}</div>
                  <div className="cc-desc">{c.desc}</div>
                  {c.tags.length > 0 && (
                    <div className="cc-includes">
                      {c.tags.map((t, j) => <span key={j} className="cc-tag">{t}</span>)}
                    </div>
                  )}
                  <div className="cc-foot">
                    <div>
                      <span className="cc-price">{c.price}</span>
                      {c.old && <span className="cc-old">{c.old}</span>}
                    </div>
                    <Link to="/dat-ban" className="btn-accent" style={{ fontSize: 13, padding: '9px 18px' }}>Đặt ngay</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5" data-reveal>
            <Link to="/thuc-don" className="btn-ghost">Xem toàn bộ thực đơn →</Link>
          </div>
        </div>
      </section>

      {/* Meat Grid */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center" data-reveal style={{ marginBottom: 40 }}>
            <div className="eyebrow">Nguyên liệu</div>
            <h2 className="sec-title">Thịt <em>tươi mỗi ngày</em> — chọn lọc từ nguồn</h2>
            <p className="sec-sub">Chúng tôi nhập thịt sáng sớm mỗi ngày, không cấp đông, không tồn kho. Bạn nướng gì là thịt đó vừa về sáng hôm đó.</p>
          </div>
          <div className="meat-grid" data-reveal>
            {MEAT_ITEMS.map((m, i) => (
              <div key={i} className="meat-card">
                <div className="meat-icon">{m.icon}</div>
                <div className="meat-name">{m.name}</div>
                <div className="meat-desc">{m.desc}</div>
                <div className="meat-price">{m.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="sec-pad sec-dark" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="text-center" data-reveal style={{ marginBottom: 40 }}>
            <div className="eyebrow">Trải nghiệm</div>
            <h2 className="sec-title">3 bước đến <em>bữa BBQ hoàn hảo</em></h2>
            <p className="sec-sub">Đơn giản, thoải mái, không phải lo nghĩ gì — chúng tôi lo hết, bạn chỉ cần tận hưởng.</p>
          </div>
          <div className="row g-4">
            {[
              { num: '01', icon: '🧾', title: 'Chọn thịt & combo', desc: 'Gọi theo thực đơn hoặc chọn combo set có sẵn. Nhân viên tư vấn nhiệt tình, giúp bạn chọn đúng khẩu vị và ngân sách.' },
              { num: '02', icon: '🔥', title: 'Tự tay nướng cùng bạn bè', desc: 'Bếp than hoa riêng cho từng bàn. Nhân viên hướng dẫn cách nướng chuẩn. Không khí sôi động, cười nói rôm rả.' },
              { num: '03', icon: '😋', title: 'Thưởng thức & no căng', desc: 'Chấm với sốt đặc biệt bí truyền, cuộn cùng rau sống và cơm lá sen. No bụng, vui lòng — đó là cam kết của chúng tôi.' },
            ].map((step, i) => (
              <div key={i} className="col-md-4" data-reveal>
                <div className="step-card">
                  <div className="step-num">{step.num}</div>
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-title">{step.title}</div>
                  <div className="step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
