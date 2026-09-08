import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { api } from './api/client'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import { useScrollToTop } from './hooks/useScrollToTop'
import { SiteProvider, useSite, type HeroSlide } from './contexts/SiteContext'

import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import About from './components/About'
import Menu from './components/Menu'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'

// ── AppShell — reveal observer toàn cục + scroll-to-top khi đổi route ──────────
function AppShell() {
  const { settings } = useSite()
  const location = useLocation()

  useScrollToTop()

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    const observeNew = (root: ParentNode = document) => {
      root.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
    }

    const t = setTimeout(() => observeNew(), 0)

    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return
          if (node.hasAttribute('data-reveal') && !node.classList.contains('visible')) {
            io.observe(node)
          }
          node.querySelectorAll<Element>('[data-reveal]:not(.visible)').forEach(el => io.observe(el))
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { clearTimeout(t); io.disconnect(); mo.disconnect() }
  }, [location.pathname, settings])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thuc-don" element={<MenuPage />} />
        <Route path="/khong-gian" element={<KhongGianPage />} />
        <Route path="/gioi-thieu" element={<GioiThieuPage />} />
        <Route path="/lien-he" element={<LienHePage />} />
        <Route path="/chinh-sach-bao-mat" element={<PrivacyPage />} />
        <Route path="/dieu-khoan" element={<TermsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </>
  )
}

// ── FAQ — mục H, ≥6 câu qua <details>/<summary> (không phụ thuộc JS ngoài) ─────
const FAQS = [
  { q: 'Giá cà phê hạt tại xưởng tính như thế nào?', a: 'Giá theo trọng lượng (200g hoặc 500g) và vùng nguyên liệu — dao động từ 150.000đ đến 320.000đ cho gói 500g. Hạt càng hiếm (như Ethiopia nhập khẩu) giá càng cao. Xem đầy đủ tại trang Thực đơn, mục "Hạt Rang Mang Về".' },
  { q: 'Cà phê tại xưởng có nguồn gốc từ đâu?', a: 'Chủ yếu từ ba vùng: Cầu Đất (Đà Lạt), Khe Sanh (Quảng Trị) và Sơn La — thu mua trực tiếp từ nông trại. Ngoài ra có thêm một số lô hạt nhập khẩu theo mùa như Ethiopia Yirgacheffe.' },
  { q: 'Cách bảo quản cà phê hạt/bột sau khi mua?', a: 'Giữ trong túi zip kín có van khí, để nơi khô ráo, tránh ánh nắng trực tiếp và nhiệt độ cao. Nên dùng hết trong 2–4 tuần kể từ ngày rang (ghi trên bao bì) để giữ trọn hương vị. Không nên để trong tủ lạnh vì hơi ẩm sẽ ảnh hưởng đến hạt.' },
  { q: 'Có nhận đặt sỉ / bán buôn cho quán khác không?', a: 'Có. Chúng tôi hiện đang cung cấp hạt rang định kỳ cho hơn 15 quán cà phê đối tác. Số lượng từ 5kg/tháng trở lên sẽ có mức giá sỉ riêng — liên hệ trực tiếp qua trang Liên hệ để được tư vấn profile rang phù hợp với concept quán.' },
  { q: 'Có giao hàng tận nơi không? Phí giao ra sao?', a: 'Nội thành giao trong ngày, miễn phí cho đơn từ 300.000đ trở lên (dưới mức này phụ thu 20.000đ). Khu vực ngoại thành và tỉnh khác giao qua đối tác vận chuyển GHN/GHTK, phí tính theo khoảng cách thực tế.' },
  { q: 'Chính sách đổi trả nếu cà phê không đúng khẩu vị?', a: 'Đổi trong vòng 3 ngày kể từ ngày nhận hàng nếu túi chưa mở hoặc phát hiện lỗi từ phía xưởng (rang không đều, đóng gói hở van...). Trường hợp không hợp khẩu vị cá nhân, chúng tôi tư vấn đổi sang loại hạt/mức rang khác phù hợp hơn.' },
  { q: 'Có thể đặt lịch tham quan xưởng rang không?', a: 'Có. Khách lẻ có thể ghé tham quan khu rang bất cứ giờ mở cửa nào. Với nhóm từ 10 người trở lên hoặc muốn trải nghiệm cupping cùng barista, vui lòng đặt lịch trước ít nhất 1 ngày qua trang Liên hệ.' },
]

function Faq() {
  return (
    <section className="crx-sec-pad" style={{ background: 'var(--roast-light)' }}>
      <div className="crx-container">
        <div className="crx-sec-head" data-reveal>
          <div className="crx-eyebrow">Câu hỏi thường gặp</div>
          <h2 className="crx-sec-title">Những điều <em>khách hay hỏi</em></h2>
          <p className="crx-sec-sub crx-mx-auto">Nếu câu hỏi của bạn chưa có ở đây, đừng ngại nhắn tin qua trang Liên hệ.</p>
        </div>
        <div className="crx-faq-list" data-reveal data-reveal-d1>
          {FAQS.map((f, i) => (
            <details className="crx-faq-item" key={f.q} open={i === 0}>
              <summary>{f.q} <span className="crx-faq-icon">+</span></summary>
              <div className="crx-faq-a">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ rút gọn riêng cho trang chủ (3 câu, khác nội dung FAQ đầy đủ ở trang Giới thiệu —
// đúng bản tĩnh: index.html chỉ teaser 3 câu kèm link "Xem thêm... tại trang Giới thiệu").
const HOME_FAQS = [
  { q: 'Giá cà phê hạt tại xưởng tính như thế nào?', a: 'Giá theo trọng lượng và vùng nguyên liệu, dao động từ 150.000đ đến 320.000đ/500g tùy loại hạt và mức độ rang. Xem bảng giá chi tiết tại trang Thực đơn.' },
  { q: 'Cà phê có bị hết hạn sau khi rang không?', a: 'Hạt rang ngon nhất trong 2–4 tuần sau khi rang. Chúng tôi luôn ghi ngày rang trên bao bì để khách nắm được độ tươi.' },
  { q: 'Có nhận đặt sỉ cho quán khác không?', a: 'Có. Xem thêm chi tiết chính sách đặt sỉ và bảo quản tại trang Giới thiệu — mục Câu hỏi thường gặp.' },
]

function HomeFaq() {
  return (
    <section className="crx-sec-pad" style={{ background: 'var(--bg)' }}>
      <div className="crx-container">
        <div className="crx-sec-head" data-reveal>
          <div className="crx-eyebrow">Câu hỏi thường gặp</div>
          <h2 className="crx-sec-title">Giải đáp <em>nhanh</em></h2>
          <p className="crx-sec-sub crx-mx-auto">Xem thêm chi tiết đầy đủ tại trang <Link to="/gioi-thieu" style={{ color: 'var(--accent)', fontWeight: 500 }}>Giới thiệu</Link>.</p>
        </div>
        <div className="crx-faq-list" data-reveal>
          {HOME_FAQS.map((f, i) => (
            <details className="crx-faq-item" key={f.q} open={i === 0}>
              <summary>{f.q} <span className="crx-faq-icon">+</span></summary>
              <div className="crx-faq-a">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// Teaser "Thức uống nổi bật" trên trang chủ — nội dung tĩnh đúng bản gốc (index.html),
// khác hẳn danh sách đầy đủ có tab của <Menu/> (chỉ dùng ở trang /thuc-don).
const FEATURED_DRINKS = [
  { origin: 'Signature Blend', name: 'Espresso Nguyên Chất', desc: 'Robusta Đắk Lắk 100%, rang đậm, hậu vị socola đắng', price: '35.000đ', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80&auto=format&fit=crop' },
  { origin: 'Cầu Đất, Đà Lạt', name: 'Pour Over Bourbon', desc: 'Arabica Bourbon, hương hoa nhài, hậu cam quýt', price: '68.000đ', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&q=80&auto=format&fit=crop' },
  { origin: 'Signature Blend', name: 'Latte Caramel Xưởng', desc: 'Caramel tự nấu, sữa tươi local, foam mịn', price: '52.000đ', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80&auto=format&fit=crop' },
  { origin: 'Khe Sanh, Quảng Trị', name: 'Cold Brew Nguyên Bản', desc: 'Ngâm lạnh 18 giờ, vị mượt, ít acid, hậu ngọt', price: '55.000đ', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80&auto=format&fit=crop' },
]

// Teaser "Không gian xưởng" trên trang chủ — 3 khu cố định đúng bản gốc, khác hẳn
// thư viện ảnh masonry đầy đủ của <Gallery/> (chỉ dùng ở trang /khong-gian).
const SPACE_PREVIEW = [
  { name: 'Khu Rang', sub: 'Máy rang trống · Quan sát trực tiếp', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=700&q=80&auto=format&fit=crop' },
  { name: 'Khu Pha Chế', sub: 'Quầy bar mở · Barista trình diễn', image: 'https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=700&q=80&auto=format&fit=crop' },
  { name: 'Khu Ngồi', sub: 'Gỗ mộc · Ánh sáng tự nhiên', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop' },
]

// ── Pages ─────────────────────────────────────────────────────────────────────
function HomePage() {
  const { settings } = useSite()
  const [slides, setSlides] = useState<HeroSlide[]>([])

  useEffect(() => {
    api.get<HeroSlide[]>('/public/hero-slides').then(setSlides).catch(() => {})
  }, [])

  useDocumentMeta({
    title: settings.meta_title || `${settings.site_name || 'Mộc Rang'} Roastery — Xưởng Rang Cà Phê Đặc Sản`,
    description: settings.meta_description || 'Xưởng rang cà phê đặc sản — chọn hạt, rang và pha chế ngay tại chỗ từ nguyên liệu Cầu Đất, Khe Sanh, Sơn La.',
  })

  const pillars = [
    { icon: '🌾', title: 'Thu mua trực tiếp nông trại', desc: 'Bỏ qua thương lái trung gian, kết nối trực tiếp với vùng nguyên liệu Cầu Đất, Khe Sanh, Sơn La.' },
    { icon: '🔥', title: 'Rang mẻ nhỏ, kiểm soát chất lượng', desc: 'Mỗi mẻ rang đều được cupping trước khi đóng gói — chỉ mẻ đạt chuẩn mới lên kệ.' },
    { icon: '📦', title: 'Đóng gói giữ trọn hương vị', desc: 'Túi zip có van khí một chiều, ghi rõ ngày rang và vùng trồng trên từng bao bì.' },
  ]

  return (
    <>
      <HeroSlider slides={slides} />

      {/* TRIẾT LÝ NGẮN */}
      <section className="crx-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="crx-container">
          <div className="crx-sec-head" data-reveal>
            <div className="crx-eyebrow">Vì sao chọn chúng tôi</div>
            <h2 className="crx-sec-title">Ba điều <em>chúng tôi giữ đúng</em></h2>
          </div>
          <div className="row g-4">
            {pillars.map((p, i) => (
              <div className="col-md-4" key={p.title} data-reveal data-reveal-d1={i === 1 ? '' : undefined} data-reveal-d2={i === 2 ? '' : undefined}>
                <div className="crx-roast-icon" style={{ marginBottom: 10 }}>{p.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 400, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, margin: 0, fontWeight: 300 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAT BAR */}
      <section className="crx-stat-bar">
        <div className="crx-container">
          <div className="crx-stats-grid">
            <div data-reveal data-reveal-d1><div className="crx-stat-num">3</div><div className="crx-stat-label">Vùng nguyên liệu chính</div></div>
            <div data-reveal data-reveal-d2><div className="crx-stat-num">6+</div><div className="crx-stat-label">Năm vận hành xưởng rang</div></div>
            <div data-reveal data-reveal-d3><div className="crx-stat-num">5kg</div><div className="crx-stat-label">Mỗi mẻ rang micro-batch</div></div>
            <div data-reveal data-reveal-d3 style={{ transitionDelay: '.32s' }}><div className="crx-stat-num">120+</div><div className="crx-stat-label">Kg hạt rang mỗi tuần</div></div>
          </div>
        </div>
      </section>

      {/* THỨC UỐNG NỔI BẬT — teaser 4 món, khác hẳn menu đầy đủ có tab ở /thuc-don */}
      <section className="crx-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="crx-container">
          <div className="crx-sec-head" data-reveal>
            <div className="crx-eyebrow">Thức uống nổi bật</div>
            <h2 className="crx-sec-title">Những gì <em>khách hay gọi nhất</em></h2>
            <p className="crx-sec-sub crx-mx-auto">Từ espresso rang đậm đến pour over single-origin — mỗi ly đều bắt đầu từ hạt do chính xưởng chúng tôi rang.</p>
          </div>
          <div className="crx-drink-grid">
            {FEATURED_DRINKS.map((d, i) => (
              <div className="crx-drink-card" key={d.name} data-reveal data-reveal-d1={i === 0 ? '' : undefined} data-reveal-d2={i === 1 ? '' : undefined} data-reveal-d3={i >= 2 ? '' : undefined}>
                <div className="crx-dc-img"><img src={d.image} alt={d.name} loading="lazy" /></div>
                <div className="crx-dc-body">
                  <div className="crx-dc-origin">{d.origin}</div>
                  <div className="crx-dc-name">{d.name}</div>
                  <div className="crx-dc-desc">{d.desc}</div>
                  <div className="crx-dc-price">{d.price}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5" data-reveal>
            <Link to="/thuc-don" className="crx-btn crx-btn-ghost">Xem toàn bộ thực đơn →</Link>
          </div>
        </div>
      </section>

      {/* KHÔNG GIAN XƯỞNG — teaser 3 khu, khác hẳn thư viện ảnh đầy đủ ở /khong-gian */}
      <section className="crx-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="crx-container">
          <div className="crx-sec-head" data-reveal>
            <div className="crx-eyebrow">Không gian xưởng</div>
            <h2 className="crx-sec-title">Ba khu vực, <em>một quy trình</em></h2>
            <p className="crx-sec-sub crx-mx-auto">Từ khu rang hạt đến bàn pha chế và khu ngồi — mọi công đoạn đều có thể nhìn thấy tận mắt.</p>
          </div>
          <div className="crx-space-grid">
            {SPACE_PREVIEW.map((s, i) => (
              <div className="crx-space-card" key={s.name} data-reveal data-reveal-d1={i === 0 ? '' : undefined} data-reveal-d2={i === 1 ? '' : undefined} data-reveal-d3={i === 2 ? '' : undefined}>
                <img src={s.image} alt={s.name} loading="lazy" />
                <div className="crx-space-caption">
                  <div className="crx-space-name">{s.name}</div>
                  <div className="crx-space-sub">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5" data-reveal>
            <Link to="/khong-gian" className="crx-btn crx-btn-accent">Khám phá toàn bộ không gian →</Link>
          </div>
        </div>
      </section>

      {/* ĐÁNH GIÁ */}
      <section className="crx-sec-pad" style={{ background: 'var(--roast-light)' }}>
        <div className="crx-container">
          <div className="crx-sec-head" data-reveal>
            <div className="crx-eyebrow">Đánh giá từ khách</div>
            <h2 className="crx-sec-title">Họ nói gì về <em>xưởng rang</em></h2>
          </div>
          <Testimonials />
        </div>
      </section>

      <HomeFaq />

      {/* CTA */}
      <section className="crx-full-bleed">
        <div className="crx-container">
          <h2 className="crx-fb-title">Ghé xưởng, uống thử<br /><em>một mẻ rang mới</em></h2>
          <p className="crx-fb-sub">Mỗi tuần chúng tôi đều có mẻ rang mới — ghé xưởng để cupping cùng barista hoặc đặt hàng giao tận nơi.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/lien-he" className="crx-btn crx-btn-accent">Liên hệ đặt lịch</Link>
            <Link to="/thuc-don" className="crx-btn crx-btn-outline-light">Xem thực đơn</Link>
          </div>
        </div>
      </section>
    </>
  )
}

// "Hạt Rang Mang Về" — mục riêng cuối trang Thực đơn (bán hạt theo trọng lượng,
// khác hẳn danh sách đồ uống pha sẵn của <Menu/> ở trên).
const RETAIL_BEANS = [
  { origin: 'Đắk Lắk', name: 'Robusta Rang Đậm Cổ Điển', desc: '200g: 70.000đ · 500g: 150.000đ', price: 'Từ 70.000đ', image: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=500&q=80&auto=format&fit=crop' },
  { origin: 'Blend Xưởng', name: 'Signature Blend', desc: '200g: 85.000đ · 500g: 180.000đ', price: 'Từ 85.000đ', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80&auto=format&fit=crop' },
  { origin: 'Cầu Đất, Đà Lạt', name: 'Single Origin Bourbon', desc: '200g: 115.000đ · 500g: 260.000đ', price: 'Từ 115.000đ', image: 'https://images.unsplash.com/photo-1587734195342-579ed260ba8c?w=500&q=80&auto=format&fit=crop' },
  { origin: 'Nhập khẩu', name: 'Ethiopia Yirgacheffe', desc: '200g: 140.000đ · 500g: 320.000đ', price: 'Từ 140.000đ', image: 'https://images.unsplash.com/photo-1516557070061-c3d1653fa646?w=500&q=80&auto=format&fit=crop' },
]

function MenuPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Thực đơn — ${settings.site_name || 'Mộc Rang'} Roastery`,
    description: 'Thực đơn cà phê rang xay tại xưởng — hạt rang mang về, cà phê pha tại chỗ theo nhiều phương pháp.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Thực đơn</div>
          <h1 className="crx-ph-title">Từ hạt xanh<br /><em>đến ly cà phê trong tay bạn</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Mọi món trong thực đơn đều pha từ hạt rang tại xưởng — bạn có thể mua nguyên hạt mang về hoặc thưởng thức tại chỗ.</p>
        </div>
      </section>

      <section className="crx-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="crx-container">
          <Menu />
        </div>
      </section>

      <section className="crx-sec-pad" style={{ background: 'var(--roast-light)' }}>
        <div className="crx-container">
          <div className="crx-sec-head" data-reveal>
            <div className="crx-eyebrow">Mua mang về</div>
            <h2 className="crx-sec-title">Cà phê <em>hạt rang</em> nguyên chất</h2>
            <p className="crx-sec-sub crx-mx-auto">Đóng túi có van thoát khí, ghi rõ ngày rang. Giá niêm yết theo trọng lượng.</p>
          </div>
          <div className="crx-drink-grid" data-reveal data-reveal-d1>
            {RETAIL_BEANS.map(b => (
              <div className="crx-drink-card" key={b.name}>
                <div className="crx-dc-img"><img src={b.image} alt={b.name} loading="lazy" /></div>
                <div className="crx-dc-body">
                  <div className="crx-dc-origin">{b.origin}</div>
                  <div className="crx-dc-name">{b.name}</div>
                  <div className="crx-dc-desc">{b.desc}</div>
                  <div className="crx-dc-price">{b.price}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5" data-reveal>
            <Link to="/lien-he" className="crx-btn crx-btn-accent">Đặt hạt rang / Đặt sỉ →</Link>
          </div>
        </div>
      </section>
    </>
  )
}

const WORK_AREAS = [
  { tag: 'Khu rang', name: 'Rang Trống Micro-Batch', desc: 'Máy rang trống công suất nhỏ, mỗi mẻ tối đa 5kg. Khách có thể đứng ngay cạnh quan sát và ngửi mùi hạt chuyển màu qua từng phút rang.', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=700&q=80&auto=format&fit=crop' },
  { tag: 'Khu pha chế', name: 'Quầy Bar Mở', desc: 'Quầy bar thiết kế mở hoàn toàn — khách ngồi ngay trước mặt barista, có thể trò chuyện về profile rang và cách pha từng loại hạt.', image: 'https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=700&q=80&auto=format&fit=crop' },
  { tag: 'Khu ngồi', name: 'Bàn Gỗ Mộc & Ánh Sáng Tự Nhiên', desc: 'Nội thất gỗ thô mộc, cửa kính lớn đón ánh sáng tự nhiên. Có khu bàn dài cho nhóm và góc bàn đơn cho khách làm việc một mình.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop' },
]

function KhongGianPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Không gian — ${settings.site_name || 'Mộc Rang'} Roastery`,
    description: 'Xưởng rang mở — khách có thể quan sát toàn bộ quá trình rang, pha chế ngay tại quầy.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Không gian</div>
          <h1 className="crx-ph-title">Xưởng rang mở —<br /><em>nhìn thấy từng công đoạn</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Không có gì giấu sau cánh cửa — khách có thể quan sát toàn bộ quá trình rang, pha chế ngay tại quầy.</p>
        </div>
      </section>

      {/* 3 KHU VỰC CHI TIẾT */}
      <section className="crx-sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="crx-container">
          <div className="row g-4">
            {WORK_AREAS.map((a, i) => (
              <div className="col-md-4" key={a.name}>
                <div className="crx-area-card" data-reveal data-reveal-d1={i === 0 ? '' : undefined} data-reveal-d2={i === 1 ? '' : undefined} data-reveal-d3={i === 2 ? '' : undefined}>
                  <img className="crx-area-img" src={a.image} alt={a.name} loading="lazy" />
                  <div className="crx-area-body">
                    <div className="crx-area-cap">{a.tag}</div>
                    <div className="crx-area-name">{a.name}</div>
                    <div className="crx-area-desc">{a.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAT BAR */}
      <section className="crx-stat-bar">
        <div className="crx-container">
          <div className="crx-stats-grid">
            <div data-reveal data-reveal-d1><div className="crx-stat-num">45</div><div className="crx-stat-label">m² khu rang mở</div></div>
            <div data-reveal data-reveal-d2><div className="crx-stat-num">12</div><div className="crx-stat-label">Chỗ ngồi tại quầy bar</div></div>
            <div data-reveal data-reveal-d3><div className="crx-stat-num">40</div><div className="crx-stat-label">Chỗ ngồi khu vực chính</div></div>
            <div data-reveal data-reveal-d3 style={{ transitionDelay: '.32s' }}><div className="crx-stat-num">7:00</div><div className="crx-stat-label">Mở cửa mỗi ngày</div></div>
          </div>
        </div>
      </section>

      {/* GALLERY MASONRY */}
      <section className="crx-sec-pad" style={{ background: 'var(--roast-light)' }}>
        <div className="crx-container">
          <div className="crx-sec-head" data-reveal>
            <div className="crx-eyebrow">Thư viện ảnh</div>
            <h2 className="crx-sec-title">Vài khoảnh khắc <em>tại xưởng</em></h2>
          </div>
          <Gallery />
        </div>
      </section>

      {/* CTA */}
      <section className="crx-full-bleed">
        <div className="crx-container">
          <h2 className="crx-fb-title">Ghé thăm xưởng rang<br /><em>bất cứ lúc nào</em></h2>
          <p className="crx-fb-sub">Không cần đặt trước để tham quan khu rang và pha chế — chỉ cần ghé và hỏi nhân viên tại quầy.</p>
          <Link to="/lien-he" className="crx-btn crx-btn-accent">Xem giờ mở cửa &amp; địa chỉ</Link>
        </div>
      </section>
    </>
  )
}

function GioiThieuPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Giới thiệu — ${settings.site_name || 'Mộc Rang'} Roastery | Câu Chuyện Xưởng Rang`,
    description: 'Câu chuyện thương hiệu — hành trình từ chọn hạt đến rang xay, cùng câu hỏi thường gặp về giá cả, nguồn gốc, bảo quản và đặt sỉ.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Giới thiệu</div>
          <h1 className="crx-ph-title">Câu chuyện của<br /><em>một xưởng rang nhỏ</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Bắt đầu từ một chiếc máy rang mẫu 1kg, đến nay chúng tôi vẫn giữ nguyên triết lý: rang mẻ nhỏ, kiểm soát chất lượng từng lô hạt.</p>
        </div>
      </section>
      <About />
      <Faq />
      <section className="crx-full-bleed">
        <div className="crx-container">
          <h2 className="crx-fb-title">Muốn nếm thử<br /><em>trước khi đặt sỉ?</em></h2>
          <p className="crx-fb-sub">Ghé xưởng để cupping trực tiếp cùng barista trước khi quyết định đặt hàng số lượng lớn.</p>
          <Link to="/lien-he" className="crx-btn crx-btn-accent">Liên hệ ngay</Link>
        </div>
      </section>
    </>
  )
}

function LienHePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Mộc Rang'} Roastery`,
    description: 'Liên hệ để đặt hạt rang, đặt sỉ, đặt lịch tham quan xưởng hoặc góp ý về sản phẩm.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Liên hệ</div>
          <h1 className="crx-ph-title">Đặt hạt rang, đặt sỉ<br />hoặc <em>ghé thăm xưởng</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Điền thông tin bên dưới hoặc liên hệ trực tiếp qua điện thoại / Zalo — chúng tôi phản hồi trong vòng 30 phút giờ hành chính.</p>
        </div>
      </section>
      <Contact />
    </>
  )
}

function PrivacyPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Chính sách bảo mật — ${settings.site_name || 'Mộc Rang'} Roastery`,
    description: 'Chính sách bảo mật thông tin khách hàng.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Pháp lý</div>
          <h1 className="crx-ph-title">Chính sách <em>bảo mật</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </section>
      <section className="crx-sec-pad" style={{ background: 'var(--bg)', paddingTop: 0 }}>
        <div className="crx-container crx-mx-auto" data-reveal style={{ maxWidth: 720, fontSize: 15, color: 'var(--text-2)', lineHeight: 1.95 }}>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>1. Thông tin chúng tôi thu thập</h4>
          <p>Khi bạn gửi yêu cầu đặt hạt rang, đặt sỉ hoặc liên hệ qua form trên website hoặc Zalo, chúng tôi thu thập các thông tin bạn chủ động cung cấp: họ tên, số điện thoại, email và nội dung yêu cầu.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>2. Mục đích sử dụng thông tin</h4>
          <p>Thông tin được sử dụng để xác nhận đơn hàng, tư vấn profile rang phù hợp và liên hệ khi cần thông báo về đơn đặt hạt/đặt sỉ. Chúng tôi không sử dụng thông tin khách hàng cho mục đích quảng cáo bên thứ ba.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>3. Bảo mật thông tin</h4>
          <p>Thông tin khách hàng được lưu trữ nội bộ, chỉ nhân viên phụ trách đặt hàng và giao hàng mới có quyền truy cập. Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của khách hàng cho bên thứ ba khi chưa có sự đồng ý.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>4. Hình ảnh xưởng rang</h4>
          <p>Hình ảnh quy trình rang, sản phẩm và không gian xưởng có thể được sử dụng cho mục đích giới thiệu trên website và mạng xã hội. Nếu khách hàng xuất hiện rõ trong ảnh và không muốn công khai, vui lòng liên hệ để chúng tôi gỡ bỏ.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>5. Cookie website</h4>
          <p>Website sử dụng cookie cơ bản để ghi nhớ tùy chọn hiển thị và cải thiện trải nghiệm duyệt web. Không có cookie nào được dùng để theo dõi hành vi cho mục đích quảng cáo bên ngoài.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>6. Quyền của khách hàng</h4>
          <p>Bạn có quyền yêu cầu chúng tôi cung cấp, chỉnh sửa hoặc xóa thông tin cá nhân đã cung cấp bất kỳ lúc nào bằng cách liên hệ qua email {settings.site_email || 'hello@mocrang.coffee'}.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>7. Liên hệ</h4>
          <p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ {settings.site_email || 'hello@mocrang.coffee'} hoặc {settings.site_phone || '0901 234 567'}.</p>
        </div>
      </section>
    </>
  )
}

function TermsPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Điều khoản sử dụng — ${settings.site_name || 'Mộc Rang'} Roastery`,
    description: 'Điều khoản sử dụng dịch vụ đặt hạt rang, đặt sỉ và tham quan xưởng.',
  })
  return (
    <>
      <section className="crx-page-hero">
        <div className="crx-container">
          <div className="crx-ph-tag">Pháp lý</div>
          <h1 className="crx-ph-title">Điều khoản <em>sử dụng</em></h1>
          <p className="crx-ph-sub crx-mx-auto">Cập nhật lần cuối: 01/01/2026</p>
        </div>
      </section>
      <section className="crx-sec-pad" style={{ background: 'var(--bg)', paddingTop: 0 }}>
        <div className="crx-container crx-mx-auto" data-reveal style={{ maxWidth: 720, fontSize: 15, color: 'var(--text-2)', lineHeight: 1.95 }}>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>1. Đặt hàng và thanh toán</h4>
          <p>Yêu cầu đặt hạt rang/đặt sỉ qua website hoặc Zalo được xác nhận trong vòng 30 phút giờ hành chính. Đơn hàng được xử lý sau khi khách xác nhận số lượng và địa chỉ giao hàng.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>2. Giao hàng</h4>
          <p>Nội thành giao trong ngày, miễn phí cho đơn từ 300.000đ trở lên (dưới mức này phụ thu 20.000đ). Khu vực ngoại thành và tỉnh khác giao qua đối tác vận chuyển GHN/GHTK, phí tính theo khoảng cách thực tế.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>3. Chính sách đổi trả</h4>
          <p>Đổi trong vòng 3 ngày kể từ ngày nhận hàng nếu túi chưa mở hoặc phát hiện lỗi từ phía xưởng (rang không đều, đóng gói hở van...). Trường hợp không hợp khẩu vị cá nhân, chúng tôi tư vấn đổi sang loại hạt/mức rang khác phù hợp hơn.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>4. Đặt sỉ / bán buôn</h4>
          <p>Số lượng từ 5kg/tháng trở lên áp dụng mức giá sỉ riêng theo thỏa thuận. Đối tác đặt hàng định kỳ vui lòng liên hệ trực tiếp để được tư vấn profile rang phù hợp với concept quán.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>5. Trách nhiệm khi tham quan xưởng</h4>
          <p>Khách tham quan xưởng rang vui lòng tuân thủ hướng dẫn an toàn tại khu vực máy rang. Chúng tôi không chịu trách nhiệm với thiệt hại phát sinh do khách tự ý vào khu vực không được phép.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>6. Sở hữu trí tuệ nội dung website</h4>
          <p>Toàn bộ nội dung, hình ảnh và thiết kế trên website thuộc quyền sở hữu của chúng tôi. Không sao chép, sử dụng lại cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.</p>
          <h4 style={{ fontFamily: 'var(--sans)', fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '32px 0 12px' }}>7. Liên hệ</h4>
          <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ {settings.site_email || 'hello@mocrang.coffee'} hoặc {settings.site_phone || '0901 234 567'}.</p>
        </div>
      </section>
    </>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SiteProvider>
      <AppShell />
    </SiteProvider>
  )
}
