import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import { api } from './api/client'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import About from './components/About'
import Menu from './components/Menu'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Reservation from './components/Reservation'
import { useDocumentMeta } from './hooks/useDocumentMeta'

interface SiteSettings {
  site_name?: string
  site_description?: string
  site_phone?: string
  site_email?: string
  site_address?: string
  working_hours?: string
  social_facebook?: string
  social_instagram?: string
  social_youtube?: string
  social_zalo?: string
  footer_copyright?: string
  footer_description?: string
  about_title?: string
  about_content?: string
  about_image?: string
  about_tagline?: string
  google_map_embed?: string
  [key: string]: string | undefined
}

interface Slide {
  id: number
  title: string
  subtitle: string
  button_text: string
  button_link: string
  image: string
}

interface SiteContextValue {
  settings: SiteSettings
  slides: Slide[]
  loading: boolean
}

const SiteContext = createContext<SiteContextValue>({ settings: {}, slides: [], loading: true })
export const useSite = () => useContext(SiteContext)

function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<SiteSettings>('/public/settings'),
      api.get<Slide[]>('/public/hero-slides'),
    ]).then(([s, sl]) => {
      setSettings(s)
      setSlides(sl)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return <SiteContext.Provider value={{ settings, slides, loading }}>{children}</SiteContext.Provider>
}

function HomePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: settings.meta_title || 'Nhà Hàng Nhật Bản Omakase & Sushi — Ẩm thực Nhật chính thống',
    description: settings.meta_description || 'Nhà hàng Nhật Bản chính thống với Omakase, Sushi, Ramen cao cấp. Bếp trưởng 15 năm kinh nghiệm tại Tokyo.',
  })
  return (
    <>
      <HeroSlider />
      <OmakaseSteps />
      <MenuHighlight />
      <About />
      <SakeSection />
      <Testimonials />
      <ReservationCTA />
    </>
  )
}

function OmakaseSteps() {
  useReveal()
  return (
    <section className="sec-pad" style={{ background: '#fff' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Trải nghiệm Omakase</div>
          <h2 className="sec-title">Ba bước đến<br /><em>bữa ăn hoàn hảo</em></h2>
          <p className="sec-sub">Omakase — "tôi phó thác cho bạn" — là cách thưởng thức ẩm thực Nhật trọn vẹn nhất. Bếp trưởng sẽ lo toàn bộ.</p>
        </div>
        <div className="row g-4">
          {[
            { num: '01', title: 'Chọn mức trải nghiệm', desc: 'Chúng tôi có 3 mức thực đơn omakase: Standard (8 món), Premium (12 món) và Signature (16 món). Đặt trước 24 giờ để bếp trưởng chuẩn bị tốt nhất.' },
            { num: '02', title: 'Bếp trưởng sáng tạo', desc: 'Dựa vào nguyên liệu tươi nhập hôm đó — cá hồi Nauy, tôm hùm Nhật, nhím biển Hokkaido — bếp trưởng thiết kế thực đơn riêng cho bàn bạn.' },
            { num: '03', title: 'Thưởng thức từng khoảnh khắc', desc: 'Mỗi món được trình bày trực tiếp trước mặt bạn, kèm câu chuyện về nguồn gốc nguyên liệu và kỹ thuật chế biến đặc biệt.' },
          ].map((s, i) => (
            <div key={s.num} className={`col-md-4 reveal${i > 0 ? ` reveal-d${i}` : ''}`}>
              <div className="omakase-step">
                <div className="os-num">{s.num}</div>
                <div className="os-title">{s.title}</div>
                <p className="os-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MenuHighlight() {
  const [items, setItems] = useState<Array<{ id: number; name: string; description: string; price: number; badge?: string }>>([])
  useEffect(() => {
    api.get<typeof items>('/public/menu-items?featured=1').then(setItems).catch(() => {})
  }, [])
  useReveal([items])

  const fallback = [
    { id: 1, jmJp: '大トロ握り', jmVn: 'Otoro Nigiri', desc: 'Sushi cá ngừ vây xanh phần bụng béo nhất — tan ngay khi chạm môi, vị umami đậm sâu. Nhập khẩu trực tiếp từ chợ Tsukiji, Tokyo.' },
    { id: 2, jmJp: 'うに丼', jmVn: 'Uni Don — Cơm Nhím Biển', desc: 'Nhím biển Hokkaido tươi sống trên cơm Nhật nấu với dấm gạo, kèm trứng cá hồi và rong biển. Số lượng có hạn mỗi ngày.' },
    { id: 3, jmJp: '特選刺身盛り合わせ', jmVn: 'Sashimi Đặc Tuyển — 9 loại cá', desc: 'Đĩa sashimi 9 loại theo mùa: cá hồi, cá ngừ, bạch tuộc, tôm ngọt, cua hoàng đế, cá tráp đỏ, sò điệp, cá bơn và cá kiếm.' },
    { id: 4, jmJp: '博多ラーメン', jmVn: 'Hakata Ramen — Đặc Sản Fukuoka', desc: 'Nước dùng tonkotsu hầm 18 tiếng từ xương heo Nhật, mì sợi mỏng Hakata, chashu lợn nướng, trứng luộc marinate và bơ tỏi đen.' },
    { id: 5, jmJp: '鉄板焼きA5和牛', jmVn: 'Teppanyaki Wagyu A5', desc: 'Thịt bò Wagyu A5 Miyazaki nướng trực tiếp trên bàn teppan trước mặt thực khách — marbling chuẩn Nhật, vị ngọt tự nhiên.' },
    { id: 6, jmJp: '抹茶パフェ', jmVn: 'Matcha Parfait — Tráng Miệng', desc: 'Parfait trà xanh matcha Kyoto chính gốc: kem matcha, mochi mềm, đậu đỏ azuki, crumble trà xanh và kem tươi Hokkaido.' },
  ]

  return (
    <section className="sec-pad" style={{ background: 'var(--dark2)' }}>
      <div className="wd-container">
        <div className="row align-items-end mb-5">
          <div className="col-md-7 reveal">
            <div className="eyebrow" style={{ color: '#ef4444' }}>Thực đơn đặc sắc</div>
            <h2 className="sec-title" style={{ color: '#fff', fontWeight: 300, letterSpacing: '-1.5px' }}>Những món <em style={{ color: '#ef4444' }}>chef tự hào</em></h2>
          </div>
          <div className="col-md-5 text-md-end reveal reveal-d1">
            <a href="/thuc-don" className="btn-outline-white">Xem toàn bộ thực đơn →</a>
          </div>
        </div>
        {fallback.map((item, i) => (
          <div key={item.id} className={`jp-menu-item reveal${i > 0 ? ` reveal-d${(i % 3) as 1 | 2 | 3}` : ''}`}>
            <div>
              <div className="jmi-jp">{item.jmJp}</div>
              <div className="jmi-vn">{item.jmVn}</div>
              <p className="jmi-desc">{item.desc}</p>
            </div>
            <div className="jmi-price">Liên hệ</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SakeSection() {
  useReveal()
  const sakes = [
    { cat: 'Junmai Daiginjo', name: 'Dassai 23', origin: 'Yamaguchi, Nhật Bản', desc: 'Sake thượng hạng từ gạo xay tới 23%, hương hoa đào tinh tế, vị ngọt thanh lịch.', img: 'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?w=400&q=80&auto=format&fit=crop' },
    { cat: 'Shochu', name: 'Iichiko Silhouette', origin: 'Oita, Kyushu', desc: 'Shochu làm từ lúa mì barley, vị mềm mại, phù hợp thưởng thức thuần túy hoặc pha với soda.', img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80&auto=format&fit=crop' },
    { cat: 'Umeshu', name: 'Choya Gold', origin: 'Osaka, Nhật Bản', desc: 'Rượu mơ vàng ngâm với mơ Nanko nguyên hạt, vị chua ngọt cân bằng, màu hổ phách đẹp mắt.', img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80&auto=format&fit=crop' },
    { cat: 'Trà Nhật', name: 'Gyokuro Premium', origin: 'Uji, Kyoto', desc: 'Trà lá kim trồng trong bóng râm 3 tuần trước thu hoạch, vị umami sâu, màu xanh ngọc bích.', img: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=80&auto=format&fit=crop' },
  ]
  return (
    <section className="sec-pad" style={{ background: 'var(--warm)' }}>
      <div className="wd-container">
        <div className="text-center reveal mb-5">
          <div className="eyebrow">Rượu & Đồ Uống</div>
          <h2 className="sec-title">Sake & <em>Rượu Nhật</em></h2>
          <p className="sec-sub">Bộ sưu tập hơn 40 loại sake, shochu và rượu plum tuyển chọn từ các kura truyền thống khắp Nhật Bản.</p>
        </div>
        <div className="row g-3">
          {sakes.map((s, i) => (
            <div key={s.name} className={`col-6 col-md-3 reveal${i > 0 ? ` reveal-d${i as 1 | 2 | 3}` : ''}`}>
              <div className="sake-card">
                <div className="sc-img-wrap"><img src={s.img} alt={s.name} className="sc-img" /></div>
                <div className="sc-body">
                  <div className="sc-cat">{s.cat}</div>
                  <div className="sc-name">{s.name}</div>
                  <div className="sc-origin">{s.origin}</div>
                  <p className="sc-desc">{s.desc}</p>
                  <div className="sc-price">Liên hệ</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReservationCTA() {
  const { settings } = useSite()
  useReveal()
  return (
    <section className="dark-cta-form">
      <div className="jp-deco" style={{ right: '5%', top: '10%', opacity: .04, fontSize: '200px', position: 'absolute' }}>予約</div>
      <div className="wd-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row align-items-center g-5">
          <div className="col-lg-5 reveal">
            <div className="ph-eyebrow mb-3">Omakase Reservation</div>
            <h2 className="dcf-title">Đặt bàn<br /><em>Omakase</em> ngay</h2>
            <p className="dcf-sub">Số chỗ có hạn — đặt trước ít nhất 24 giờ để bếp trưởng chuẩn bị nguyên liệu tốt nhất cho bạn.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '24px' }}>
              {settings.site_phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', border: '1px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>📞</div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Hotline</div>
                    <div style={{ fontSize: '15px', color: '#fff' }}>{settings.site_phone}</div>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', border: '1px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🕙</div>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Giờ phục vụ</div>
                  <div style={{ fontSize: '15px', color: '#fff' }}>11:30 – 14:00 / 17:30 – 22:00</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 reveal reveal-d1">
            <Reservation embedded />
          </div>
        </div>
      </div>
    </section>
  )
}

// Simple reveal hook
function useReveal(deps?: unknown[]) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll<Element>('[data-reveal]:not(.visible), .reveal:not(.visible)')
      if (!els.length) return
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } })
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
      els.forEach(el => ro.observe(el))
      return () => ro.disconnect()
    }, 0)
    return () => clearTimeout(timer)
  }, deps ?? [])
}

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
        <Route path="/thuc-don" element={<><Header /><MenuPage /><Footer /></>} />
        <Route path="/sushi-bar" element={<><Header /><SushiBarPage /><Footer /></>} />
        <Route path="/dat-ban" element={<><Header /><DatBanPage /><Footer /></>} />
        <Route path="/lien-he" element={<><Header /><LienHePage /><Footer /></>} />
        <Route path="*" element={<><Header /><HomePage /><Footer /></>} />
      </Routes>
    </SiteProvider>
  )
}

function MenuPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Thực đơn — ${settings.site_name || 'Nhà Hàng Nhật Bản Omakase & Sushi'}`,
    description: 'Hơn 60 món Nhật Bản chính thống — Omakase, Sushi, Sashimi, Ramen, Teppanyaki — từ nguyên liệu nhập Nhật trực tiếp, tươi mới mỗi ngày.',
  })
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-jp">お品書き</div>
          <div className="ph-eyebrow">Menu</div>
          <h1 className="ph-title">Thực đơn <em>Nhật Bản</em></h1>
          <p className="ph-sub">Hơn 60 món từ nguyên liệu nhập Nhật trực tiếp — tươi mới mỗi ngày, theo mùa.</p>
        </div>
      </div>
      <Menu />
    </>
  )
}

function SushiBarPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Sushi Bar Experience — ${settings.site_name || 'Nhà Hàng Nhật Bản Omakase & Sushi'}`,
    description: 'Ngồi trực tiếp tại quầy sushi — quan sát bếp trưởng sáng tạo từng miếng sushi. Chọn gói Omakase Standard, Premium hoặc Signature.',
  })
  useReveal()
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-jp">すし カウンター</div>
          <div className="ph-eyebrow">Sushi Counter</div>
          <h1 className="ph-title">Sushi Bar <em>Experience</em></h1>
          <p className="ph-sub">Ngồi trực tiếp tại quầy — quan sát bếp trưởng sáng tạo từng miếng sushi, tương tác và hỏi về từng nguyên liệu.</p>
        </div>
      </div>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row align-items-center g-5 mb-5">
            <div className="col-lg-6 reveal">
              <div className="eyebrow">Trải nghiệm counter</div>
              <h2 className="sec-title">Ngồi quầy —<br /><em>xem nghệ thuật</em></h2>
              <p style={{ fontSize: '15px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.85, marginBottom: '22px' }}>
                Sushi Bar có <strong>8 ghế ngồi quầy</strong> — đây là cách thưởng thức sushi truyền thống nhất. Bạn ngồi trực tiếp đối diện với bếp trưởng, quan sát từng động tác tạo hình sushi.
              </p>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[['8', 'Ghế quầy counter'], ['2–3', 'Giờ trải nghiệm'], ['24h', 'Đặt trước tối thiểu']].map(([num, label]) => (
                  <div key={label}>
                    <div style={{ fontSize: '24px', fontWeight: 300, color: 'var(--accent)', letterSpacing: '-1px' }}>{num}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 reveal reveal-d1">
              <img src="https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=700&q=80&auto=format&fit=crop" alt="Sushi bar counter" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
            </div>
          </div>
          {/* Omakase packages */}
          <div className="text-center reveal mb-5">
            <div className="eyebrow">Gói Omakase</div>
            <h2 className="sec-title">Chọn trải nghiệm<br /><em>phù hợp với bạn</em></h2>
            <p className="sec-sub">Tất cả các gói đều bao gồm: súp miso khai vị, món tráng miệng và trà xanh. Yêu cầu đặt trước 24 giờ.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { name: 'Standard', jp: 'おまかせ標準', courses: '8 món · 90–120 phút', featured: false,
                includes: ['Súp miso & tsukemono khai vị', '6 miếng nigiri tuyển chọn', '2 cuốn maki', 'Sashimi 3 loại', 'Tráng miệng & trà xanh'] },
              { name: 'Premium', jp: 'おまかせプレミアム', courses: '12 món · 150–180 phút', featured: true,
                includes: ['Khai vị 3 món nhỏ', '10 miếng nigiri bao gồm Otoro & Uni', 'Sashimi đặc tuyển 5 loại', '2 cuộn maki đặc biệt', 'Súp clam tươi Nhật', 'Tráng miệng Matcha Parfait', 'Trà Gyokuro hảo hạng'] },
              { name: 'Signature', jp: 'おまかせシグネチャー', courses: '16 món · 180–240 phút', featured: false,
                includes: ['Tất cả của gói Premium', 'Wagyu A5 teppan', 'Uni Don mini', 'Sake ghép theo từng món', 'Foie gras topping', 'Tráng miệng seasonal đặc biệt'] },
            ].map((pkg, i) => (
              <div key={pkg.name} className={`col-md-4 reveal${i > 0 ? ` reveal-d${i as 1 | 2}` : ''}`}>
                <div style={{ padding: '36px 32px', border: `1px solid ${pkg.featured ? 'var(--accent)' : 'var(--border)'}`, background: 'var(--surface)', position: 'relative', marginTop: pkg.featured ? '-16px' : '0', transition: 'all .25s' }}>
                  {pkg.featured && <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: '10.5px', fontWeight: 500, padding: '3px 14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Phổ biến nhất</div>}
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '6px' }}>{pkg.name}</div>
                  <div style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '-1px', marginBottom: '4px' }}>{pkg.jp}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '20px' }}>{pkg.courses}</div>
                  <div style={{ fontSize: '32px', fontWeight: 300, letterSpacing: '-1.5px', marginBottom: '20px' }}>Liên hệ <span style={{ fontSize: '14px', color: 'var(--text-3)', fontWeight: 300 }}>/người</span></div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pkg.includes.map(inc => (
                      <li key={inc} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', fontWeight: 300, color: 'var(--text-2)', lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--accent)', flexShrink: 0 }}>–</span>{inc}
                      </li>
                    ))}
                  </ul>
                  <a href="/dat-ban" className={pkg.featured ? 'btn-accent w-100' : 'btn-ghost w-100'} style={{ textAlign: 'center', display: 'block' }}>Đặt gói này</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function DatBanPage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Đặt bàn trực tuyến — ${settings.site_name || 'Nhà Hàng Nhật Bản Omakase & Sushi'}`,
    description: 'Đặt bàn Omakase trực tuyến — điền thông tin, chúng tôi xác nhận trong vòng 2 giờ qua điện thoại hoặc Zalo.',
  })
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-jp">ご予約</div>
          <div className="ph-eyebrow">Reservation</div>
          <h1 className="ph-title">Đặt bàn <em>trực tuyến</em></h1>
          <p className="ph-sub">Điền thông tin bên dưới — chúng tôi sẽ xác nhận trong vòng 2 giờ qua điện thoại hoặc Zalo.</p>
        </div>
      </div>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-8 reveal"><Reservation /></div>
            <div className="col-lg-4 reveal reveal-d1"><ReservationSidebar /></div>
          </div>
        </div>
      </section>
    </>
  )
}

function ReservationSidebar() {
  const { settings } = useSite()
  return (
    <div style={{ position: 'sticky', top: '80px' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>Thông tin nhà hàng</div>
        {[
          ['Địa chỉ', settings.site_address || 'Số nhà, Đường, Quận, TP'],
          ['Điện thoại', settings.site_phone || '0901 234 567'],
          ['Trưa', '11:30 – 14:00'],
          ['Tối', '17:30 – 22:00'],
          ['Nghỉ', 'Thứ Hai'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-light)', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-2)', fontWeight: 300 }}>{k}</span>
            <span style={{ color: 'var(--text)', fontWeight: 400, textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px' }}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Liên hệ nhanh</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href={`tel:${(settings.site_phone ?? '').replace(/\s/g, '')}`} className="btn-accent w-100" style={{ textAlign: 'center', borderRadius: '2px' }}>📞 Gọi ngay</a>
          <a href={`https://zalo.me/${settings.social_zalo ?? ''}`} target="_blank" rel="noreferrer" className="btn-ghost w-100" style={{ textAlign: 'center', borderRadius: '2px' }}>💬 Chat Zalo</a>
        </div>
      </div>
    </div>
  )
}

function LienHePage() {
  const { settings } = useSite()
  useDocumentMeta({
    title: `Liên hệ — ${settings.site_name || 'Nhà Hàng Nhật Bản Omakase & Sushi'}`,
    description: 'Liên hệ nhà hàng Nhật Bản — đặt bàn, hỏi về thực đơn, hoặc tổ chức sự kiện riêng tư. Địa chỉ, điện thoại, giờ mở cửa đầy đủ.',
  })
  return (
    <>
      <div className="page-hero">
        <div className="wd-container">
          <div className="ph-jp">お問い合わせ</div>
          <div className="ph-eyebrow">Contact</div>
          <h1 className="ph-title">Liên <em>hệ</em></h1>
          <p className="ph-sub">Chúng tôi luôn sẵn sàng hỗ trợ — đặt bàn, hỏi về thực đơn, hoặc tổ chức sự kiện riêng tư.</p>
        </div>
      </div>
      <section className="sec-pad" style={{ background: 'var(--bg)' }}>
        <div className="wd-container">
          <div className="row g-5">
            <div className="col-lg-5 reveal"><ContactInfo /></div>
            <div className="col-lg-7 reveal reveal-d1"><Contact /></div>
          </div>
        </div>
      </section>
    </>
  )
}

function ContactInfo() {
  const { settings } = useSite()
  return (
    <div>
      <div className="eyebrow">Thông tin</div>
      <h2 className="sec-title" style={{ marginBottom: '32px' }}>Tìm chúng tôi</h2>
      {[
        { icon: '📍', label: 'Địa chỉ', value: settings.site_address || 'Số nhà, Đường, Quận, TP' },
        { icon: '📞', label: 'Điện thoại / Hotline', value: settings.site_phone || '0901 234 567' },
        { icon: '✉️', label: 'Email', value: settings.site_email || 'info@nhahangnhat.vn' },
        { icon: '💬', label: 'Zalo', value: 'Chat trực tiếp trên Zalo' },
      ].map(r => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px 0', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ width: '40px', height: '40px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{r.icon}</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{r.label}</div>
            <div style={{ fontSize: '15px', fontWeight: 400, color: 'var(--text)' }}>{r.value}</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: '32px', padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>Giờ mở cửa</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[['Thứ Ba – Thứ Sáu', '11:30 – 14:00 / 17:30 – 22:00'], ['Thứ Bảy – Chủ Nhật', '11:00 – 14:30 / 17:00 – 22:30'], ['Thứ Hai', 'Nghỉ']].map(([day, hours]) => (
              <tr key={day} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '10px 0', fontSize: '13.5px', fontWeight: 300, color: 'var(--text-2)', width: '60%' }}>{day}</td>
                <td style={{ padding: '10px 0', fontSize: '13.5px', textAlign: 'right', color: hours === 'Nghỉ' ? 'var(--accent)' : 'var(--text)', fontWeight: hours === 'Nghỉ' ? 500 : 400 }}>{hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
