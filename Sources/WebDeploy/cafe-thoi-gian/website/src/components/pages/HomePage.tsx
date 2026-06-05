import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../../contexts/SiteContext'
import { api } from '../../api/client'
import { usePageTitle } from '../../hooks/usePageTitle'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  featured: number
  category_name: string
}

interface MenuCategory {
  id: number
  name: string
  slug: string
  items: MenuItem[]
}

interface Testimonial {
  id: number
  author_name: string
  author_title: string
  author_avatar: string
  content: string
  rating: number
}

function useReveal(deps: unknown[]) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible), .reveal:not(.visible)')
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) }
        })
      }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps])
}

export default function HomePage() {
  usePageTitle()
  const { settings, slides } = useSite()
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [activeTab, setActiveTab] = useState('cf')
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [bookingForm, setBookingForm] = useState({
    name: '', phone: '', date: '', time: '', guests: '2 người', area: 'Tầng 1 (Main Hall)'
  })
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  useEffect(() => {
    api.get<MenuCategory[]>('/public/menu').then(cats => {
      setMenuCategories(cats)
      if (cats.length > 0) setActiveTab(cats[0].slug)
    }).catch(() => {})
    api.get<Testimonial[]>('/public/testimonials').then(setTestimonials).catch(console.error)
  }, [])

  useReveal([menuCategories, testimonials])

  const siteName   = settings.site_name   || 'Cà Phê Thời Gian'
  const aboutTitle = settings.about_title || 'Hành trình từ hạt đến ly'
  const aboutContent = settings.about_content || 'Mỗi hạt cà phê đều được chúng tôi chọn lọc trực tiếp từ các nông trại uy tín.'
  const statRegions = settings.stat_regions || '3'
  const statYears   = settings.stat_years   || '8+'
  const statCups    = settings.stat_cups_day || '200'

  const heroSlide = slides[0]
  const heroTitle    = heroSlide?.title    || 'Mỗi tách là một khoảnh khắc.'
  const heroSubtitle = heroSlide?.subtitle || 'Không gian cà phê ấm cúng, rang xay thủ công.'

  const activeCategory = menuCategories.find(c => c.slug === activeTab)

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingStatus('sending')
    try {
      await api.post('/public/reservation', bookingForm)
      setBookingStatus('ok')
      setBookingForm({ name: '', phone: '', date: '', time: '', guests: '2 người', area: 'Tầng 1 (Main Hall)' })
    } catch {
      setBookingStatus('err')
    }
  }

  return (
    <>
      {/* HERO MAGAZINE */}
      <section className="hero-magazine">
        <div className="wd-container w-100">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 hm-left">
              <div className="hm-badge">☕ Rang xay thủ công mỗi ngày</div>
              <h1 className="hm-title">
                {heroTitle.split('\n').map((line, i) => (
                  <span key={i}>{line}{i < heroTitle.split('\n').length - 1 && <br />}</span>
                ))}
              </h1>
              <p className="hm-sub">{heroSubtitle}</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/menu" className="btn-accent">Xem thực đơn</Link>
                <Link to="/khong-gian" className="btn-ghost">Khám phá không gian →</Link>
              </div>
              <div className="hm-meta">
                <div className="hm-meta-item"><span className="hm-dot"></span>Mở cửa 7:00 – 22:00</div>
                <div className="hm-meta-item"><span className="hm-dot"></span>Wi-Fi miễn phí</div>
                <div className="hm-meta-item"><span className="hm-dot"></span>4.8 ★ 520+ đánh giá</div>
                <div className="hm-meta-item"><span className="hm-dot"></span>Sân vườn & phòng riêng</div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hm-grid">
                <div className="hm-grid-img">
                  <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop" alt="Không gian quán cà phê ấm cúng" loading="lazy" />
                </div>
                <div className="hm-grid-img">
                  <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80&auto=format&fit=crop" alt="Barista pha chế cà phê" loading="lazy" />
                </div>
                <div className="hm-grid-img">
                  <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80&auto=format&fit=crop" alt="Hạt cà phê rang xay" loading="lazy" />
                </div>
                <div className="hm-grid-img">
                  <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80&auto=format&fit=crop" alt="Latte art cà phê" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DRINKS */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Thức uống nổi bật</div>
            <h2 className="sec-title">Những tách <em>khách yêu thích</em></h2>
            <p className="sec-sub">Từ espresso đậm đà đến cold brew mát lạnh — mỗi ly đều được pha chế với sự tỉ mỉ và tình yêu với cà phê.</p>
          </div>
          <div className="row g-4">
            {menuCategories.flatMap(c => c.items).filter(i => i.featured).slice(0, 4).map((item, idx) => (
              <div className="col-6 col-md-3" key={item.id}>
                <div className={`drink-card reveal reveal-d${idx + 1}`}>
                  <div className="dc-img-wrap">
                    <img src={item.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&auto=format&fit=crop'} alt={item.name} loading="lazy" />
                  </div>
                  <div className="dc-body">
                    <div className="dc-name">{item.name}</div>
                    <div className="dc-desc">{item.description}</div>
                    <div className="dc-price">{item.price.toLocaleString('vi-VN')}đ</div>
                  </div>
                </div>
              </div>
            ))}
            {menuCategories.flatMap(c => c.items).filter(i => i.featured).length === 0 && (
              <>
                {[
                  { name: 'Espresso Signature', desc: 'Blend Arabica & Robusta, crema dày, hậu vị ngọt nhẹ', price: 45000, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80&auto=format&fit=crop' },
                  { name: 'Latte Sữa Tươi', desc: 'Sữa tươi tiệt trùng, foam mịn, art latte xinh xắn', price: 55000, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&auto=format&fit=crop' },
                  { name: 'Cold Brew 24h', desc: 'Ngâm lạnh 24 giờ, vị mượt mà, ít đắng, uống đá là tuyệt', price: 60000, img: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80&auto=format&fit=crop' },
                  { name: 'Pour Over Đà Lạt', desc: 'Single origin Đà Lạt, pha chế thủ công, hương hoa và trái cây', price: 65000, img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80&auto=format&fit=crop' },
                ].map((item, idx) => (
                  <div className="col-6 col-md-3" key={item.name}>
                    <div className={`drink-card reveal reveal-d${idx + 1}`}>
                      <div className="dc-img-wrap">
                        <img src={item.img} alt={item.name} loading="lazy" />
                      </div>
                      <div className="dc-body">
                        <div className="dc-name">{item.name}</div>
                        <div className="dc-desc">{item.desc}</div>
                        <div className="dc-price">{item.price.toLocaleString('vi-VN')}đ</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="text-center mt-5 reveal">
            <Link to="/menu" className="btn-ghost">Xem toàn bộ thực đơn →</Link>
          </div>
        </div>
      </section>

      {/* STORY — Dark section */}
      <section className="sec-pad sec-dark" style={{ background: 'var(--dark2)' }}>
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 reveal">
              <div className="eyebrow">Câu chuyện của chúng tôi</div>
              <h2 className="sec-title">{aboutTitle}</h2>
              <p className="sec-sub mb-4">{aboutContent}</p>
              <div className="row g-4 mt-2">
                <div className="col-4 text-center">
                  <div className="stat-num">{statRegions}</div>
                  <div className="stat-label">Vùng nguyên liệu</div>
                </div>
                <div className="col-4 text-center">
                  <div className="stat-num">{statYears}</div>
                  <div className="stat-label">Năm rang xay</div>
                </div>
                <div className="col-4 text-center">
                  <div className="stat-num">{statCups}</div>
                  <div className="stat-label">Ly/ngày</div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 reveal reveal-d1">
              <div className="row g-3">
                <div className="col-6">
                  <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80&auto=format&fit=crop" alt="Rang cà phê" loading="lazy" style={{ borderRadius: '14px', width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
                </div>
                <div className="col-6 d-flex flex-column gap-3">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80&auto=format&fit=crop" alt="Barista" loading="lazy" style={{ borderRadius: '14px', width: '100%', flex: '1', objectFit: 'cover', minHeight: 0 }} />
                  <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80&auto=format&fit=crop" alt="Coffee beans" loading="lazy" style={{ borderRadius: '14px', width: '100%', flex: '1', objectFit: 'cover', minHeight: 0 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BREW METHODS */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Phương pháp pha chế</div>
            <h2 className="sec-title">Bốn cách để <em>cảm nhận cà phê</em></h2>
            <p className="sec-sub">Mỗi phương pháp mang đến một trải nghiệm hương vị khác nhau — từ mạnh mẽ đến thanh tao.</p>
          </div>
          <div className="brew-scroll reveal">
            {[
              { icon: '☕', name: 'Espresso', desc: 'Áp suất 9 bar, chiết xuất 25–30 giây. Cơ sở của mọi thức uống cà phê sữa. Crema dày, hương thơm đậm đà.', tag: 'Đậm đà · Nhanh' },
              { icon: '🫗', name: 'Pour Over', desc: 'Rót tay từng chút một qua giấy lọc. Hương vị sạch, trong, thể hiện rõ đặc trưng của từng loại cà phê đơn giống.', tag: 'Tinh tế · Hoa & trái cây' },
              { icon: '🧊', name: 'Cold Brew', desc: 'Ngâm lạnh 18–24 giờ ở nhiệt độ thấp. Vị mượt, ít acid, ngọt tự nhiên. Uống đá hay pha cocktail đều tuyệt.', tag: 'Mát lạnh · Mượt mà' },
              { icon: '🫖', name: 'French Press', desc: 'Ngâm 4 phút, ép pít tông. Giữ lại tinh dầu tự nhiên, vị đậm, body dày. Trải nghiệm cà phê theo cách cổ điển nhất.', tag: 'Cổ điển · Body dày' },
            ].map(b => (
              <div className="brew-card" key={b.name}>
                <div className="brew-icon">{b.icon}</div>
                <div className="brew-name">{b.name}</div>
                <div className="brew-desc">{b.desc}</div>
                <span className="brew-tag">{b.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPACE PREVIEW */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Không gian quán</div>
            <h2 className="sec-title">Ba khu vực, <em>một bầu không khí</em></h2>
            <p className="sec-sub">Dù bạn muốn làm việc yên tĩnh, gặp gỡ bạn bè hay tìm một góc riêng thư giãn — {siteName} đều có.</p>
          </div>
          <div className="row g-3">
            {[
              { name: 'Tầng 1 — Main Hall', sub: 'Quầy bar · Bàn nhóm · Wifi nhanh', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop', delay: 'd1' },
              { name: 'Sân Vườn', sub: 'Cây xanh · Thoáng mát · Chụp ảnh đẹp', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&q=80&auto=format&fit=crop', delay: 'd2' },
              { name: 'Phòng Riêng', sub: 'Tối đa 8 người · Đặt trước · Yên tĩnh', img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=700&q=80&auto=format&fit=crop', delay: 'd3' },
            ].map(s => (
              <div className="col-md-4" key={s.name}>
                <div className={`space-card reveal ${s.delay}`}>
                  <img src={s.img} alt={s.name} loading="lazy" />
                  <div className="sc-caption">
                    <div className="sc-name">{s.name}</div>
                    <div className="sc-sub">{s.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5 reveal">
            <Link to="/khong-gian" className="btn-accent">Khám phá không gian →</Link>
          </div>
        </div>
      </section>

      {/* MENU QUICK TAB */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-4 reveal">
              <div className="eyebrow">Thực đơn</div>
              <h2 className="sec-title">Menu <em>hôm nay</em></h2>
              <p className="sec-sub mb-4">Chúng tôi cập nhật menu theo mùa — luôn có món mới để bạn thử mỗi lần ghé thăm.</p>
              <Link to="/menu" className="btn-accent">Xem menu đầy đủ</Link>
            </div>
            <div className="col-lg-8 reveal reveal-d1">
              {menuCategories.length > 0 ? (
                <>
                  <div className="menu-tabs">
                    {menuCategories.slice(0, 3).map(cat => (
                      <button
                        key={cat.slug}
                        className={`mt-btn${activeTab === cat.slug ? ' active' : ''}`}
                        onClick={() => setActiveTab(cat.slug)}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                  <div className="menu-tab-panel active">
                    {(activeCategory?.items || []).slice(0, 6).map(item => (
                      <div className="menu-list-item" key={item.id}>
                        <div>
                          <div className="mli-name">{item.name}</div>
                          <div className="mli-desc">{item.description}</div>
                        </div>
                        <div className="mli-price">{item.price.toLocaleString('vi-VN')}đ</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="menu-tabs">
                    {[
                      { key: 'cf',  label: 'Cà phê' },
                      { key: 'tra', label: 'Trà & Trái cây' },
                      { key: 'banh',label: 'Bánh ngọt' },
                    ].map(t => (
                      <button
                        key={t.key}
                        className={`mt-btn${activeTab === t.key ? ' active' : ''}`}
                        onClick={() => setActiveTab(t.key)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="menu-tab-panel active">
                    {activeTab !== 'tra' && activeTab !== 'banh' && ([
                      { id: 1, name: 'Espresso Signature',  desc: 'Arabica & Robusta blend, crema dày',      price: 45000 },
                      { id: 2, name: 'Cappuccino',          desc: 'Espresso, sữa hấp, foam mịn',             price: 55000 },
                      { id: 3, name: 'Latte Sữa Tươi',      desc: 'Double shot, sữa tươi tiệt trùng',        price: 55000 },
                      { id: 4, name: 'Americano',           desc: 'Espresso pha loãng, uống nóng hoặc đá',   price: 45000 },
                      { id: 5, name: 'Cold Brew 24h',       desc: 'Ngâm lạnh 24 giờ, vị mượt mà',           price: 60000 },
                      { id: 6, name: 'Pour Over Đà Lạt',    desc: 'Single origin, hương hoa và trái cây',    price: 65000 },
                    ] as { id: number; name: string; desc: string; price: number }[]).map(item => (
                      <div className="menu-list-item" key={item.id}>
                        <div><div className="mli-name">{item.name}</div><div className="mli-desc">{item.desc}</div></div>
                        <div className="mli-price">{item.price.toLocaleString('vi-VN')}đ</div>
                      </div>
                    ))}
                    {activeTab === 'tra' && ([
                      { id: 1, name: 'Trà Ô Long Sữa',    desc: 'Ô long Đài Loan, sữa béo, trân châu',    price: 55000 },
                      { id: 2, name: 'Hồng Trà Đào',      desc: 'Hồng trà Sri Lanka, đào ngâm, đá viên',  price: 60000 },
                      { id: 3, name: 'Nước Chanh Tươi',   desc: 'Chanh tươi vắt, đường phèn, muối biển',  price: 40000 },
                      { id: 4, name: 'Sinh Tố Xoài',      desc: 'Xoài Cát Chu, sữa chua, không đường',    price: 55000 },
                      { id: 5, name: 'Nước Ép Táo Gừng',  desc: 'Táo Fuji, gừng tươi, mật ong',          price: 55000 },
                    ] as { id: number; name: string; desc: string; price: number }[]).map(item => (
                      <div className="menu-list-item" key={item.id}>
                        <div><div className="mli-name">{item.name}</div><div className="mli-desc">{item.desc}</div></div>
                        <div className="mli-price">{item.price.toLocaleString('vi-VN')}đ</div>
                      </div>
                    ))}
                    {activeTab === 'banh' && ([
                      { id: 1, name: 'Croissant Bơ Pháp',   desc: 'Bơ AOP, lớp vỏ giòn, ruột mềm thơm',         price: 45000 },
                      { id: 2, name: 'Cheesecake New York',  desc: 'Cream cheese, không nướng, mịn và béo',       price: 65000 },
                      { id: 3, name: 'Tiramisu Espresso',    desc: 'Mascarpone, espresso, biscuit Savoiardi',      price: 70000 },
                      { id: 4, name: 'Bánh Mì Sandwich',     desc: 'Baguette, trứng, dăm bông, rau sống',         price: 55000 },
                      { id: 5, name: 'Waffle Bơ Chuối',      desc: 'Waffle nóng, bơ tan chảy, chuối, mật ong',   price: 75000 },
                    ] as { id: number; name: string; desc: string; price: number }[]).map(item => (
                      <div className="menu-list-item" key={item.id}>
                        <div><div className="mli-name">{item.name}</div><div className="mli-desc">{item.desc}</div></div>
                        <div className="mli-price">{item.price.toLocaleString('vi-VN')}đ</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sec-pad" style={{ background: 'var(--warm)' }}>
        <div className="wd-container">
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Đánh giá từ khách</div>
            <h2 className="sec-title">Họ nói gì về <em>Thời Gian</em></h2>
          </div>
          <div className="row g-4">
            {(testimonials.length > 0 ? testimonials : [
              { id: 1, author_name: 'Nguyễn Minh Thư', author_title: 'Freelancer · Đà Nẵng', author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80&auto=format&fit=crop', content: 'Quán không gian cực kỳ dễ chịu, nhạc nhẹ nhàng, cà phê ngon. Tôi hay đến một mình để làm việc, mấy tiếng trôi qua lúc nào không hay. Cold Brew ở đây là best tôi từng uống!', rating: 5 },
              { id: 2, author_name: 'Trần Phúc Bảo', author_title: 'Nhiếp ảnh gia · TP.HCM', author_avatar: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=80&q=80&auto=format&fit=crop', content: 'Cappuccino pha đúng chuẩn — foam mịn, nhiệt độ vừa, không quá nhạt không quá đắng. Sân vườn đẹp lắm, chụp ảnh ra rất xịn. Nhân viên friendly và am hiểu về cà phê.', rating: 5 },
              { id: 3, author_name: 'Lê Hương Giang', author_title: 'Giáo viên · Hà Nội', author_avatar: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=80&q=80&auto=format&fit=crop', content: 'Phòng riêng đặt trước rất tiện, họp nhóm nhỏ cực ổn. Tiramisu ngon và không quá ngọt. Không gian đúng chất "thời gian ngừng trôi" — cứ muốn ngồi mãi không về!', rating: 5 },
            ]).slice(0, 3).map((t, idx) => (
              <div className="col-md-4" key={t.id}>
                <div className={`rv reveal reveal-d${idx + 1}`}>
                  <div className="rv-stars">{'★'.repeat(t.rating)}</div>
                  <div className="rv-text">"{t.content}"</div>
                  <div className="rv-foot">
                    <img className="rv-av" src={t.author_avatar} alt={t.author_name} loading="lazy" />
                    <div>
                      <div className="rv-name">{t.author_name}</div>
                      <div className="rv-role">{t.author_title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 reveal">
              <div className="eyebrow">Đặt chỗ trước</div>
              <h2 className="sec-title">Giữ bàn cho <em>khoảnh khắc</em> của bạn</h2>
              <p className="sec-sub">Đặt trước để đảm bảo có chỗ — đặc biệt vào cuối tuần và phòng riêng. Chúng tôi xác nhận trong vòng 15 phút.</p>
              <ul className="mt-4" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ fontSize: '13.5px', color: 'var(--text-2)', display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: 'var(--accent)', fontSize: '16px' }}>✓</span>Phản hồi xác nhận nhanh</li>
                <li style={{ fontSize: '13.5px', color: 'var(--text-2)', display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: 'var(--accent)', fontSize: '16px' }}>✓</span>Hủy miễn phí trước 2 tiếng</li>
                <li style={{ fontSize: '13.5px', color: 'var(--text-2)', display: 'flex', gap: '10px', alignItems: 'center' }}><span style={{ color: 'var(--accent)', fontSize: '16px' }}>✓</span>Giữ bàn 20 phút sau giờ đặt</li>
              </ul>
            </div>
            <div className="col-lg-7 reveal reveal-d1">
              <div className="inline-booking">
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', marginBottom: '22px', letterSpacing: '-.3px' }}>Điền thông tin đặt chỗ</h3>
                {bookingStatus === 'ok' ? (
                  <div style={{ padding: '20px', background: 'var(--accent-light)', borderRadius: '10px', color: 'var(--accent)', fontWeight: 500, textAlign: 'center' }}>
                    Cảm ơn bạn! Chúng tôi sẽ liên hệ xác nhận trong vòng 15 phút.
                  </div>
                ) : (
                  <form onSubmit={handleBooking}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Họ và tên *</label>
                        <input type="text" className="form-control" placeholder="Nguyễn Văn A" required value={bookingForm.name} onChange={e => setBookingForm(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Số điện thoại *</label>
                        <input type="tel" className="form-control" placeholder="0901 234 567" required value={bookingForm.phone} onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Ngày đến</label>
                        <input type="date" className="form-control" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Giờ đến</label>
                        <select className="form-select" value={bookingForm.time} onChange={e => setBookingForm(p => ({ ...p, time: e.target.value }))}>
                          <option value="">-- Chọn giờ --</option>
                          {['7:00 – 9:00','9:00 – 11:00','11:00 – 13:00','13:00 – 15:00','15:00 – 17:00','17:00 – 19:00','19:00 – 22:00'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Số người</label>
                        <select className="form-select" value={bookingForm.guests} onChange={e => setBookingForm(p => ({ ...p, guests: e.target.value }))}>
                          {['1 người','2 người','3 – 4 người','5 – 6 người','7 – 8 người (phòng riêng)'].map(g => <option key={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Khu vực</label>
                        <select className="form-select" value={bookingForm.area} onChange={e => setBookingForm(p => ({ ...p, area: e.target.value }))}>
                          {['Tầng 1 (Main Hall)','Sân Vườn','Phòng Riêng'].map(a => <option key={a}>{a}</option>)}
                        </select>
                      </div>
                      <div className="col-12">
                        {bookingStatus === 'err' && <p style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '8px' }}>Có lỗi xảy ra, vui lòng thử lại.</p>}
                        <button type="submit" className="btn-accent w-100" style={{ padding: '13px', fontSize: '14px' }} disabled={bookingStatus === 'sending'}>
                          {bookingStatus === 'sending' ? 'Đang gửi...' : 'Gửi yêu cầu đặt chỗ'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
